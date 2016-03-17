var redis = require('redis');
var pmx = require('pmx');
var bracketService = require('../services/bracketService')

var client = redis.createClient();
var redisKey = 'web-overlay-bracket';

module.exports = function(io) {
    var url = null;
    var bracketPollFrequency = 10000;
    var connectedSockets = 0;
    var matches = [];
    var players = [];
    //Used to check for updates
    var availableMatchesCache = [];
    var top8cache = {};
    var timeout = null;

    var bracketIO = io.of('/bracket');

    bracketIO.on('connection', function(socket) {
        // Log the new connection
        console.log('bracket user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        // Load existing bracket data
        client.get(redisKey, function (err, reply) {
            if (err) {
                console.log(err);
            } else if (reply) {
                socket.emit('update bracket', JSON.parse(reply));
            }
        });

        socket.emit('update bracket top8', top8cache);
        connectedSockets++;

        // if we go from 0 to 1 socket, start polling again
        pollBracket();

        socket.on('disconnect', function() {
            console.log('bracket user disconnected: ' + socket.handshake.address);
            connectedSockets--;
            if (connectedSockets <= 0) {
                connectedSockets = 0;
                clearTimeout(timeout);
            }
        });

        socket.on('update bracket', function(msg) {
            var urlChanged = msg.url !== url;
            url = msg.url;
            if (urlChanged) {
                availableMatchesCache = [];
                clearTimeout(timeout);
                pollBracket();
                client.set(redisKey, JSON.stringify(getBracketDataModel()));
            }
        });

        socket.on('clear bracket', function() {
            clearBracket();
        });

        function pollBracket() {
            if (connectedSockets > 0 && url) {
                console.log('Polling bracket for updates...');
                fetchBracketData();
                timeout = setTimeout(pollBracket, bracketPollFrequency);
            }
        }

        function sendBracketUpdate() {
            var upcomingMatches = getUpcomingMatches();
            if (checkForMatchUpdates(upcomingMatches)) {
                availableMatchesCache = upcomingMatches;
                console.log('Sending bracket update');
                var bracketDataModel = getBracketDataModel();
                bracketIO.emit('update bracket', bracketDataModel);
                client.set(redisKey, JSON.stringify(bracketDataModel));
            }
        }

        function sendTop8Update() {
            var top8 = getTop8();
            if (JSON.stringify(top8) !== JSON.stringify(top8cache)) {
                bracketIO.emit('update bracket top8', top8);
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

        function fetchBracketData() {
            console.log('Requesting tournament data for ' + url);

            bracketService.getBracketData(url, function(data) {
                matches = data.matches;
                players = data.players;
                sendBracketUpdate();
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

        function getBracketDataModel() {
            return {
                url: url,
                upcomingMatches: availableMatchesCache,
                players: getPlayerDictionary(players)
            }
        }

        function clearBracket() {
            console.log('Clearing bracket data');
            url = null;
            matches = [];
            players = [];
            availableMatchesCache = [];
            clearTimeout(timeout);
            var newData = getBracketDataModel()
            socket.emit('update bracket', newData);
            client.set(redisKey, JSON.stringify(newData));
        }
    });
};
