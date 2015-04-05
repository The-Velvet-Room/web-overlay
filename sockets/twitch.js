var config = require('../config');
var request = require('request');
var redis = require('redis');

var client = redis.createClient();
var redisKey = 'web-overlay-twitch';

module.exports = function(io) {
    var twitchData = {};
    //In millis
    var twitchPollFrequency = 30000;
    var connectedSockets = 0;
    var timeout = null;
    var followersAtLaunch = [];
    var newFollowers = [];
    var currentFollowers = [];
    //Twitch returns paginated followers, making this var necessary
    var numFollowersAtLaunch = 0;

    var twitchIO = io.of('/twitch');

    // Load existing twitch data
    client.get(redisKey, function (err, reply) {
        if (err) {
            console.log(err);
        } else if (reply) {
            twitchData = JSON.parse(reply);
        }
    });

    twitchIO.on('connection', function (socket) {
        // Log the new connection
        console.log('twitch user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        socket.emit('send twitch data', twitchData);
        connectedSockets++;

        // if we go from 0 to 1 socket, start polling again
        pollTwitch();

        socket.on('disconnect', function () {
            console.log('twitch user disconnected: ' + socket.handshake.address);
            connectedSockets--;
            if (connectedSockets <= 0) {
                connectedSockets = 0;
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

        socket.on('reset peak viewers', function () {
            resetPeakViewers();
        });

        socket.on('log out', function () {
            logOut();
        });

        socket.on('process followers', function(){
            processFollowers();
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
            client.set(redisKey, JSON.stringify(twitchData));
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

                    if(!followersAtLaunch.length) {
                        followersAtLaunch = twitchResponse.follows;
                        numFollowersAtLaunch = followers;
                    }

                    currentFollowers = twitchResponse.follows;
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
            client.set(redisKey, JSON.stringify(twitchData));
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
            client.set(redisKey, JSON.stringify(twitchData));
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

        function processFollowers() {
            console.log('Processing new followers...');
            /*var dummyFollower = {
                user:{
                    name:'Dummy Follower'
                }
            }

            currentFollowers.unshift(dummyFollower);
            console.log(currentFollowers);*/
            var numNewFollowers = twitchData.twitchFollowers - numFollowersAtLaunch;
            if (numNewFollowers > 25) {
                numNewFollowers = 25;
            }
            console.log(numNewFollowers);
            newFollowers = [];
            for(var i=0; i<numNewFollowers; i++) {
                newFollowers.push(currentFollowers[i].user.name);
                console.log('Adding new follower '+currentFollowers[i].user.name);
            }

            twitchData.newFollowers = newFollowers;
            twitchIO.emit('send twitch data', twitchData);
        }

        function resetPeakViewers() {
            twitchData.twitchPeakViewers = twitchData.twitchViewers;
            twitchIO.emit('update twitch viewers', {
                'viewers': twitchData.twitchViewers,
                'peakViewers': twitchData.twitchPeakViewers
            });
            client.set(redisKey, JSON.stringify(twitchData));
        }

        function logOut() {
            console.log('Clearing twitch data');
            twitchData = {};
            clearTimeout(timeout);
            socket.emit('send twitch data', twitchData);
            client.set(redisKey, JSON.stringify(twitchData));
        }

    });

};
