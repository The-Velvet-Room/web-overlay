var redis = require('redis');
var pmx = require('pmx');
var bracketService = require('../services/bracketService')

var client = redis.createClient();
var redisKey = 'web-overlay-challonge';

module.exports = function(io) {
    var url = null;
    var challongePollFrequency = 10000;
    var connectedSockets = 0;
    var matches = [];
    var players = [];
    //Used to check for updates
    var availableMatchesCache = [];
    var top8cache = {};
    var timeout = null;

    var challongeIO = io.of('/challonge');

    challongeIO.on('connection', function(socket) {
        // Log the new connection
        console.log('challonge user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        // Load existing challonge data
        client.get(redisKey, function (err, reply) {
            if (err) {
                console.log(err);
            } else if (reply) {
                socket.emit('update challonge', JSON.parse(reply));
            }
        });

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
            var urlChanged = msg.challongeUrl !== url;
            url = msg.challongeUrl;
            if (urlChanged) {
                availableMatchesCache = [];
                clearTimeout(timeout);
                pollChallonge();
                client.set(redisKey, JSON.stringify(getChallongeDataModel()));
            }
        });

        socket.on('clear bracket', function() {
            clearBracket();
        });

        function pollChallonge() {
            if (connectedSockets > 0 && url) {
                console.log('Polling bracket for updates...');
                fetchChallongeData();
                timeout = setTimeout(pollChallonge, challongePollFrequency);
            }
        }

        function sendChallongeUpdate() {
            var upcomingMatches = getUpcomingMatches();
            if (checkForMatchUpdates(upcomingMatches)) {
                availableMatchesCache = upcomingMatches;
                console.log('Sending bracket update');
                var challongeDataModel = getChallongeDataModel();
                challongeIO.emit('update challonge', challongeDataModel);
                client.set(redisKey, JSON.stringify(challongeDataModel));
            }
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
                participants: []
            };
            var participantDict = {};
            var i;
            var maxRound = 0;
            var minRound = 0;

            // This is inefficient, but I couldn't figure out the math formula for determining
            // which round would put you in the top 8 for winners and losers.
            for (i = 0; i < matches.length; i++) {
                if (matches[i].round > maxRound) {
                    maxRound = matches[i].round;
                } else if (matches[i].round < minRound) {
                    minRound = matches[i].round;
                }
            }

            // Check the round so we only send matches and participants
            // in the top 8. Winners bracket rounds are positive and losers
            // bracket rounds are negative.
            //
            // The first round of top 8 losers is the 4th round back from
            // the last round of losers, and the first round of top 8
            // winners is the 3rd round back from the last round of winners.
            top8Object.matches = matches.filter(function(match) {
                if (match.round && (match.round > maxRound - 3 || match.round < minRound + 4)) {
                    participantDict[match.player1Id] = true;
                    participantDict[match.player2Id] = true;
                    return true;
                }
                return false;
            });

            top8Object.participants = players.filter(function(player) {
                return !!participantDict[player.id];
            });

            return top8Object;
        }

        function fetchChallongeData() {
            console.log('Requesting tournament data for ' + url);

            bracketService.getBracketData(url, function(data) {
                matches = data.matches;
                players = data.players;
                sendChallongeUpdate();
                sendTop8Update();
            });
        }

        function getUpcomingMatches() {
            return matches.filter(function(match) {
                return match.state === 'open';
            });
        }

        function getPlayerDictionary() {
            var playerDict = {};

            players.forEach(function(player){
                playerDict[player.id] = player.name;
            });

            return playerDict;
        }

        function checkForMatchUpdates(upcomingMatches) {
            if (upcomingMatches.length !== availableMatchesCache.length) {
                return true;
            }
            for (var i = 0; i < availableMatchesCache.length; i++) {
                if (availableMatchesCache[i].id !== upcomingMatches[i].id) {
                    return true;
                }
            }
            return false;
        }

        function getChallongeDataModel() {
            return {
                challongeUrl: url,
                upcomingMatches: availableMatchesCache,
                players: getPlayerDictionary(players)
            }
        }

        function clearBracket() {
            console.log('Clearing challonge data');
            url = null;
            matches = [];
            players = [];
            availableMatchesCache = [];
            clearTimeout(timeout);
            var newData = getChallongeDataModel()
            socket.emit('update challonge', newData);
            client.set(redisKey, JSON.stringify(newData));
        }
    });
};
