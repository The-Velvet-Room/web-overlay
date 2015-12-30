var config = require('../config');
import * as request from 'request';
import * as redis from 'redis';

var client = redis.createClient();
const redisKey = 'web-overlay-twitch';

class TwitchData {
    public twitchUsername: string;
    public twitchFollowers: number;
    public twitchViewers: number;
    public twitchPeakViewers: number;
    public twitchLastFollower: string;
    public twitchGame: string;
    public twitchStatus: string;
}

export = function(io: SocketIO.Server) {
    var twitchData = new TwitchData();
    //In millis
    const twitchPollFrequency = 30000;
    var connectedSockets = 0;
    var timeout: NodeJS.Timer = null;
    var followersAtLaunch = [];
    var newFollowers = [];
    var currentFollowers = [];
    //Twitch returns paginated followers, making this var necessary
    var numFollowersAtLaunch = 0;

    var twitchIO = io.of('/twitch');

    // Load existing twitch data
    client.get(redisKey, function(err, reply) {
        if (err) {
            console.log(err);
        } else if (reply) {
            twitchData = JSON.parse(reply);
        }
    });

    twitchIO.on('connection', function(socket) {
        // Log the new connection
        console.log('twitch user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        socket.emit('send twitch data', twitchData);
        connectedSockets++;

        // if we go from 0 to 1 socket, start polling again
        pollTwitch();

        socket.on('disconnect', function() {
            console.log('twitch user disconnected: ' + socket.handshake.address);
            connectedSockets--;
            if (connectedSockets <= 0) {
                connectedSockets = 0;
                clearTimeout(timeout);
            }
        });

        socket.on('update twitch user', function(data: string) {
            twitchData = new TwitchData();
            twitchData.twitchUsername = data;
            initializeTwitchData();

            clearTimeout(timeout);
            pollTwitch();
        });

        socket.on('update twitch channel info', function(data: { game: string, status: string }) {
            updateTwitchData(data.game, data.status);
        });

        socket.on('reset peak viewers', function() {
            resetPeakViewers();
        });

        socket.on('log out', function() {
            logOut();
        });

        socket.on('process followers', function() {
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

        function cacheAndSendFollowers(followers: number, lastFollower: string) {
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

            request(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var followers = twitchResponse._total;
                    var lastFollower = twitchResponse.follows[0].user.name;
                    cacheAndSendFollowers(followers, lastFollower);

                    if (!followersAtLaunch.length) {
                        followersAtLaunch = twitchResponse.follows;
                        numFollowersAtLaunch = followers;
                    }

                    currentFollowers = twitchResponse.follows;
                }
            });
        }

        function cacheAndSendViewers(viewers: number) {
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

            request(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var stream = twitchResponse.stream;
                    var viewers = stream ? stream.viewers : null;
                    cacheAndSendViewers(viewers);
                }
            });
        }

        function updateTwitchData(game: string, status: string) {
            if (game && game !== twitchData.twitchGame) {
                setTwitchGame(game);
            }
            if (status && status !== twitchData.twitchStatus) {
                setTwitchStatus(status);
            }
        }

        function cacheAndSendChannelInfo(game: string, status: string) {
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

            request(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var twitchResponse = JSON.parse(body);
                    var game = twitchResponse.game;
                    var status = twitchResponse.status;
                    cacheAndSendChannelInfo(game, status);
                }
            });
        }

        function setTwitchGame(gameName: string) {
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


            request(options, function(error, response) {
                if (!error && response.statusCode === 200) {
                    console.log('Game updated');
                }
            });
        }

        function setTwitchStatus(status: string) {
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

            request(options, function(error, response) {
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
            for (var i = 0; i < numNewFollowers; i++) {
                newFollowers.push(currentFollowers[i].user.name);
                console.log('Adding new follower ' + currentFollowers[i].user.name);
            }

            twitchData.newFollowers = newFollowers;
            if (numNewFollowers != twitchData.twitchFollowers) {
                numFollowersAtLaunch = twitchData.twitchFollowers;
            }

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
            twitchData = new TwitchData();
            clearTimeout(timeout);
            socket.emit('send twitch data', twitchData);
            client.set(redisKey, JSON.stringify(twitchData));
        }

    });

};
