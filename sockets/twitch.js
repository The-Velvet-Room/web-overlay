var config = require('../config');
var request = require('request');

module.exports = function(io) {
    var twitchData = {};
    //In millis
    var twitchPollFrequency = 30000;
    var connectedSockets = 0;
    var timeout = null;

    var twitchIO = io.of('/twitch');

    twitchIO.on('connection', function (socket) {
        console.log('Connected to Twitch');
        socket.emit('send twitch data', twitchData);
        connectedSockets++;

        // if we go from 0 to 1 socket, start polling again
        pollTwitch();

        socket.on('disconnect', function () {
            console.log('Twitch disconnected');
            connectedSockets--;
            if (connectedSockets === 0) {
                clearTimeout(timeout);
            }
        });

        socket.on('update twitch user', function (data) {
            twitchData = { 'twitchUsername': data };
            initializeTwitchData();

            clearTimeout(timeout);
            pollTwitch();
        });

        socket.on('update twitch channel info', function (data) {
            updateTwitchData(data.game, data.status);
        });

        function pollTwitch() {
            if (connectedSockets > 0 && twitchData.twitchUsername) {
                getTwitchPollableData();
                timeout = setTimeout(pollTwitch, twitchPollFrequency);
            }
        }

        function getTwitchPollableData() {
            console.log('Polling Twitch for updates...');
            getTwitchFollowerData();
            getTwitchViewerData();
        }

        function cacheAndSendFollowers(followers, lastFollower) {
            twitchData.twitchFollowers = followers;
            twitchData.twitchLastFollower = lastFollower;
            twitchIO.emit('update twitch followers', {
                'followers': followers,
                'lastFollower': lastFollower
            });
        }

        function getTwitchFollowerData() {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + twitchData.twitchUsername + '/follows/',
                method: 'GET',
                headers: headers
            };

            console.log('Requesting follower data for ' + twitchData.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var followers = twitchResponse._total;
                    var lastFollower = twitchResponse.follows[0].user.name;
                    cacheAndSendFollowers(followers, lastFollower);
                }
            });
        }

        function cacheAndSendViewers(viewers) {
            twitchData.twitchViewers = viewers;

            if (viewers) {
                if (!twitchData.twitchPeakViewers || twitchData.twitchViewers > twitchData.twitchPeakViewers) {
                    twitchData.twitchPeakViewers = twitchData.twitchViewers;
                }
            }

            twitchIO.emit('update twitch viewers', {
                'viewers': viewers,
                'peakViewers': twitchData.twitchPeakViewers
            });
        }

        function getTwitchViewerData() {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId
            };
            var options = {
                url: config.twitchApiRoot + '/streams/' + twitchData.twitchUsername,
                method: 'GET',
                headers: headers
            };

            console.log('Requesting viewer data for ' + twitchData.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var stream = twitchResponse.stream;
                    var viewers = stream ? stream.viewers : null;
                    cacheAndSendViewers(viewers);
                }
            });
        }

        function updateTwitchData(game, status) {
            if (game && game !== twitchData.twitchGame) {
                setTwitchGame(game);
            }
            if (status && status !== twitchData.twitchStatus) {
                setTwitchStatus(status);
            }
        }

        function cacheAndSendChannelInfo(game, status) {
            twitchData.twitchGame = game;
            twitchData.twitchStatus = status;
            twitchIO.emit('update twitch channel info', {
                'game': game,
                'status': status,
                'username': twitchData.twitchUsername
            });
        }

        function initializeTwitchData() {
            var headers = {
                'Accept': 'application/vnd.twitchtv.v2+json',
                'Client-Id': config.twitchClientId,
                'Authorization': 'OAuth ' + config.twitchAccessToken
            };
            var options = {
                url: config.twitchApiRoot + '/channels/' + twitchData.twitchUsername,
                method: 'GET',
                headers: headers
            };

            console.log('Requesting channel data for ' + twitchData.twitchUsername);

            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var game = twitchResponse.game;
                    var status = twitchResponse.status;
                    cacheAndSendChannelInfo(game, status);
                }
            });
        }

        function setTwitchGame(gameName) {
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
                url: config.twitchApiRoot + '/channels/' + twitchData.twitchUsername + '?channel[game]=' + gameName,
                method: 'PUT',
                headers: headers,
                body: stringQuery
            };


            request(options, function (error, response) {
                if (!error && response.statusCode === 200) {
                    console.log('Game updated');
                }
            });
        }

        function setTwitchStatus(status) {
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
                url: config.twitchApiRoot + '/channels/' + twitchData.twitchUsername + '?channel[status]=' + status,
                method: 'PUT',
                headers: headers,
                body: stringQuery
            };

            request(options, function (error, response) {
                if (!error && response.statusCode === 200) {
                    console.log('Status updated');
                }
            });
        }

    });

};
