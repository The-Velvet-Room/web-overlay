var config = require('../config');
var request = require('request');

module.exports = function(io) {
    var challongeData = {};
    var challongePollFrequency = 10000;
    var connectedSockets = 0;
    var challongeApiRoot = 'https://api.challonge.com/v1';
    var challongeHash = null;
    var matches = [];
    var players = [];
    //Used to check for updates
    var availableMatchesCache = [];
    var timeout = null;

    var challongeIO = io.of('/challonge');

    challongeIO.on('connection', function(socket) {
        // Log the new connection
        console.log('challonge user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        socket.emit('update challonge', challongeData);
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
                    clearTimeout(timeout);
                    pollChallonge();
                }
            }
        });

        function pollChallonge() {
            if (connectedSockets > 0 && challongeHash) {
                getChallongePollableData(challongeData);
                timeout = setTimeout(pollChallonge, challongePollFrequency);
            }
        }

        function getChallongePollableData(data) {
            console.log('Polling challonge for updates...');
            fetchChallongeData();
        }

        function sendChallongeUpdate() {
            challongeData.upcomingMatches = getUpcomingMatches();
            if (checkForMatchUpdates()) {
                availableMatchesCache = challongeData.upcomingMatches;
                challongeData.players = getPlayerDictionary();
                console.log('Sending challonge update');
                challongeIO.emit('update challonge', challongeData);
            }
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
                console.log('Challonge Response: '+response.statusCode);
                if (!error && response.statusCode === 200) {
                    var challongeResponse = JSON.parse(body);
                    matches = challongeResponse.tournament.matches;
                    players = challongeResponse.tournament.participants;
                    sendChallongeUpdate();
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
    });
};
