var config = require('../config');
//npm install xmlhttprequest if this fails
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var request = require('request');
module.exports = function(io) {
    var twitchData = {};
    //In millis
    var twitchPollFrequency = 30000;
    var twitchPollCache = {};
    var connectedSockets = 0;

    var twitchIO = io.of('/twitch');

    twitchIO.on('connection', function(socket) {
        console.log('Twitch connected');
        socket.emit('update twitch', twitchData);
        connectedSockets++;

        socket.on('disconnect', function() {
            console.log('Twitch disconnected');
            connectedSockets--;
        });

        socket.on('update twitch', function(msg) {
            twitchData = msg;
            if (twitchData.twitchUsername) {
                if (!twitchData.twitchGame && !twitchData.twitchStatus) {
                    twitchData = initializeTwitchData(twitchData);
                } else {
                    twitchData = updateTwitchData(twitchData);
                }

                twitchPollCache = twitchData;
                getTwitchPollableData(twitchData);
                setTimeout(pollTwitch, twitchPollFrequency);
            }

            twitchIO.emit('update twitch', twitchData);
            console.log('update twitch: ' + JSON.stringify(twitchData));
        });

        function pollTwitch() {
            getTwitchPollableData(twitchPollCache);
            if (connectedSockets > 0 && twitchData.twitchUsername)
              setTimeout(pollTwitch, twitchPollFrequency);
        }

        function getTwitchPollableData(data) {
            console.log('Polling Twitch for updates...');
            twitchData = getTwitchFollowerData(data);
            twitchData = getTwitchViewerData(data);
            console.log('New Twitch Pollable Data: ' + JSON.stringify(twitchData));
            socket.emit('update twitch readonly data', twitchData);
        }

        function getTwitchFollowerData(data) {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + data.twitchUsername + '/follows/',
                method: 'GET',
                headers: headers
            };

            console.log('Requesting follower data for ' + data.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    data.twitchFollowers = twitchResponse._total;
                    data.twitchLastFollower = twitchResponse.follows[0].user.name;
                }
            });

            return data;
        }

        function getTwitchViewerData(data) {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId
            };
            var options = {
                url: config.twitchApiRoot + '/streams/' + data.twitchUsername,
                method: 'GET',
                headers: headers
            };

            console.log('Requesting viewer data for ' + data.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var stream = twitchResponse.stream;
                    data.twitchViewers = stream ? stream.viewers : null;
                    if (data.twitchViewers) {
                        if (!data.twitchPeakViewers || data.twitchViewers > data.twitchPeakViewers) {
                            data.twitchPeakViewers = data.twitchViewers;
                        }
                    }
                }
            });

            return data;
        }

        function updateTwitchData(data) {
            var game = setTwitchGame(data.twitchUsername, data.twitchGame).game;
            var status = setTwitchStatus(data.twitchUsername, data.twitchStatus).status;
            data.twitchGame = game;
            data.twitchStatus = status;
            return data;
        }

        function initializeTwitchData(data) {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId,
                'Authorization': 'OAuth ' + config.twitchAccessToken
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + data.twitchUsername,
                method: 'GET',
                headers: headers
            };

            console.log('Requesting channel data for ' + data.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    data.twitchGame = twitchResponse.game;
                    data.twitchStatus = twitchResponse.status;
                }
            });

            return data;
        }

        function setTwitchGame(channel, gameName) {
            var queryData = {
                'channel': {
                    'game': gameName
                }
            };
            var stringQuery = JSON.stringify(queryData);
            var contentLength = stringQuery.length;

            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId,
                'Authorization': 'OAuth ' + config.twitchAccessToken,
                'Scope': 'channel-editor',
                'Content-Length': contentLength
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + channel + '?channel[game]=' + gameName,
                method: 'PUT',
                headers: headers,
                body: stringQuery
            };


            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                }
            });
        }

        function setTwitchStatus(channel, status) {
            var queryData = {
                'channel': {
                    'status': status
                }
            };

            var stringQuery = JSON.stringify(queryData);
            var contentLength = stringQuery.length;

            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId,
                'Authorization': 'OAuth ' + config.twitchAccessToken,
                'Scope': 'channel-editor',
                'Content-Length': contentLength
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + channel + '?channel[status]=' + status,
                method: 'PUT',
                headers: headers,
                body: stringQuery
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                }
            });
        }

    });

};
