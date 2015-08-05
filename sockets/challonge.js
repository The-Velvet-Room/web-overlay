var config = require('../config');
var request = require('request');
var redis = require('redis');
var pmx = require('pmx');

var client = redis.createClient();
var redisKey = 'web-overlay-challonge';

module.exports = function(io) {
    var challongeData = {};
    var challongePollFrequency = 10000;
    var connectedSockets = 0;
    var challongeApiRoot = 'https://api.challonge.com/v1';
    var challongeHash = null;
    var matches = [];
    var players = [];
    var top8Round = 0;
    //Used to check for updates
    var availableMatchesCache = [];
    var top8cache = {};
    var timeout = null;

    // Load existing challonge data
    client.get(redisKey, function (err, reply) {
        if (err) {
            console.log(err);
        } else if (reply) {
            challongeData = JSON.parse(reply);
            challongeHash = challongeData.challongeApiHash;
        }
    });

    var challongeIO = io.of('/challonge');

    challongeIO.on('connection', function(socket) {
        // Log the new connection
        console.log('challonge user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        socket.emit('update challonge', challongeData);
        socket.emit('update challonge top8', top8cache);
        connectedSockets++;

        // if we go from 0 to 1 socket, start polling again
        pollChallonge();

        socket.on('disconnect', function() {
            console.log('challonge user disconnected: ' + socket.handshake.address);
            connectedSockets--;
            if (connectedSockets <= 0) {
                connectedSockets = 0;
                clearTimeout(timeout);
            }
        });

        socket.on('update challonge', function(msg) {
            var urlChanged = msg.challongeUrl !== challongeData.challongeUrl;
            challongeData = msg;
            if (challongeData.challongeUrl) {
                if (!challongeHash || urlChanged) {
                    availableMatchesCache = [];
                    challongeHash = createChallongeHash(challongeData.challongeUrl);
                    challongeData.challongeApiHash = challongeHash;
                    clearTimeout(timeout);
                    pollChallonge();
                    client.set(redisKey, JSON.stringify(challongeData));
                }
            }
        });

        socket.on('clear bracket', function() {
            clearBracket();
        });

        function pollChallonge() {
            if (connectedSockets > 0 && challongeHash) {
                console.log('Polling challonge for updates...');
                fetchChallongeData();
                timeout = setTimeout(pollChallonge, challongePollFrequency);
            }
        }

        function sendChallongeUpdate() {
            challongeData.upcomingMatches = getUpcomingMatches();
            if (checkForMatchUpdates()) {
                availableMatchesCache = challongeData.upcomingMatches;
                challongeData.players = getPlayerDictionary();
                console.log('Sending challonge update');
                challongeIO.emit('update challonge', challongeData);
            }
            client.set(redisKey, JSON.stringify(challongeData));
        }

        function sendTop8Update() {
            var top8 = getTop8();
            if (JSON.stringify(top8) !== JSON.stringify(top8cache)) {
                challongeIO.emit('update challonge top8', top8);
                top8cache = top8;
            }
        }

        function getTop8() {
            var top8Object = {
                matches: [],
                participants: [],
                top8Round: top8Round
            };
            var participantIdList = [];
            var i;
            var match;
            var player;

            for (i = 0; i < matches.length; i++) {
                match = matches[i].match;
                console.log(match);
                if (match.round && (match.round >= top8Round || match.round <= -top8Round)) {
                    top8Object.matches.push(match);
                }
                participantIdList.push(match.player1_id);
                participantIdList.push(match.player2_id);
            }
            for (i = 0; i < players.length; i++) {
                player = players[i].participant;
                if (participantIdList.indexOf(player['id']) >= 0) {
                    top8Object.participants.push(player);
                }
            }

            return top8Object;
        }

        function fetchChallongeData() {
            var headers = {
                //Basic Auth must be encoded or request will be denied
                'Authorization': 'Basic ' + new Buffer(config.challongeDevUsername + ':' + config.challongeApiKey).toString('base64')
            };
            var options = {
                url: challongeApiRoot + '/tournaments/' + challongeHash + '.json?include_matches=1&include_participants=1',
                method: 'GET',
                headers: headers
            };

            console.log('Requesting tournament data for ' + challongeData.challongeUrl);

            request(options, function (error, response, body) {
                console.log('Challonge Response: ' + response.statusCode);
                if (!error && response.statusCode === 200) {
                    try {
                        var challongeResponse = JSON.parse(body);
                        top8Round = Math.ceil(Math.log(challongeResponse.tournament.participants_count / 4) / Math.log(2)) + 1;
                        matches = challongeResponse.tournament.matches;
                        players = challongeResponse.tournament.participants;
                        sendChallongeUpdate();
                        sendTop8Update();
                    } catch (e) {
                        var errorMessage = 'Challonge response could not be parsed: ' + body;
                        console.log(errorMessage);
                        pmx.notify(errorMessage);
                    }
                }
            });
        }

        function getUpcomingMatches() {
            var upcomingMatches = [];
            matches.forEach(function(match){
                if (match.match.state === 'open') {
                    upcomingMatches.push(match);
                }
            });

            return upcomingMatches;
        }

        function getPlayerDictionary() {
            var playerDict = {};

            players.forEach(function(player){
                playerDict[player.participant.id] = player.participant.name || player.participant.username;
            });

            return playerDict;
        }

        function createChallongeHash(challongeUrl) {
            var tourneyHash = challongeUrl.substring(challongeUrl.lastIndexOf('/') + 1).trim();

            //If tournament belongs to an organization,
            //it must be specified in the request
            if (challongeUrl.split('.').length - 1 > 1) {
                var orgHash = challongeUrl.substring(challongeUrl.lastIndexOf('http://') + 7, challongeUrl.indexOf('.'));
                challongeHash = orgHash + '-' + tourneyHash;
                return challongeHash;
            }

            //Standard tournament
            challongeHash = tourneyHash;
            return challongeHash;
        }

        function checkForMatchUpdates() {
            if (challongeData.upcomingMatches.length !== availableMatchesCache.length) {
                return true;
            }
            for (var i = 0; i < availableMatchesCache.length; i++) {
                if (availableMatchesCache[i].match.id !== challongeData.upcomingMatches[i].match.id) {
                    return true;
                }
            }
            return false;
        }

        function clearBracket() {
            console.log('Clearing challonge data');
            challongeHash = null;
            challongeData = {};
            matches = [];
            players = [];
            availableMatchesCache = [];
            clearTimeout(timeout);
            socket.emit('update challonge', challongeData);
            client.set(redisKey, JSON.stringify(challongeData));
        }
    });
};
