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
        socket.emit('send twitch data', twitchData);
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
                getTwitchPollableData();
            }
        });

        function pollTwitch() {
            getTwitchPollableData();
            if (connectedSockets > 0 && twitchData.twitchUsername)
              setTimeout(pollTwitch, twitchPollFrequency);
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

        function updateTwitchData(data) {
            var game = setTwitchGame(data.twitchUsername, data.twitchGame);
            var status = setTwitchStatus(data.twitchUsername, data.twitchStatus);
            data.twitchGame = game;
            data.twitchStatus = status;
            return data;
        }

        function cacheAndSendChannelInfo(game, status) {
            twitchData.twitchGame = game;
            twitchData.twitchStatus = status;
            twitchIO.emit('update twitch channel info', {
                'game': game,
                'status': status
            });
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
                    var game = twitchResponse.game;
                    var status = twitchResponse.status;
                    cacheAndSendChannelInfo(game, status);
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


            request(options, function (error, response) {
                if (!error && response.statusCode === 200) {
                    console.log('Game updated');
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

            request(options, function (error, response) {
                if (!error && response.statusCode === 200) {
                    console.log('Status updated');
                }
            });
        }

    });

};
