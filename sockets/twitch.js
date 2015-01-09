var config = require('../config');
//npm install xmlhttprequest if this fails
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
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
            var requestUrl = config.twitchApiRoot + '/channels/' + data.twitchUsername + '/follows/';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', requestUrl, false);
            xmlhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v2+json');
            xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
            xmlhttp.send();
            console.log('Requesting follower data for ' + data.twitchUsername);
            var twitchResponse = JSON.parse(xmlhttp.responseText);
            data.twitchFollowers = twitchResponse._total;
            data.twitchLastFollower = twitchResponse.follows[0].user.name;
            return data;
        }

        function getTwitchViewerData(data) {
            var requestUrl = config.twitchApiRoot + '/streams/' + data.twitchUsername;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', requestUrl, false);
            xmlhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v2+json');
            xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
            xmlhttp.send();
            console.log('Requesting viewer data for ' + data.twitchUsername);
            var twitchResponse = JSON.parse(xmlhttp.responseText);
            var stream = twitchResponse.stream;
            data.twitchViewers = stream ? stream.viewers : null;
            if (data.twitchViewers) {
                if (!data.twitchPeakViewers || data.twitchViewers > data.twitchPeakViewers) {
                    data.twitchPeakViewers = data.twitchViewers;
                }
            }
            return data;
        }

        function updateTwitchData(data) {
            var channelName = data.twitchUsername;
            var game = setTwitchGame(data.twitchUsername, data.twitchGame).game;
            var status = setTwitchStatus(data.twitchUsername, data.twitchStatus).status;
            data.twitchGame = game;
            data.twitchStatus = status;
            return data;
        }

        function initializeTwitchData(data) {
            var requestUrl = config.twitchApiRoot + '/channels/' + data.twitchUsername;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', requestUrl, false);
            xmlhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v2+json');
            xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
            xmlhttp.setRequestHeader('Authorization', 'OAuth ' + config.twitchAccessToken);
            xmlhttp.send();
            console.log('Requesting channel data for ' + data.twitchUsername);
            var twitchResponse = JSON.parse(xmlhttp.responseText);
            data.twitchGame = twitchResponse.game;
            data.twitchStatus = twitchResponse.status;
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
            var requestUrl = config.twitchApiRoot + '/channels/' + channel + '?channel[game]=' + gameName;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('PUT', requestUrl, false);
            xmlhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v2+json');
            xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
            xmlhttp.setRequestHeader('Authorization', 'OAuth ' + config.twitchAccessToken);
            xmlhttp.setRequestHeader('Scope', 'channel-editor');
            xmlhttp.setRequestHeader('Content-Length', contentLength);
            xmlhttp.send(stringQuery);
            return JSON.parse(xmlhttp.responseText);
        }

        function setTwitchStatus(channel, status) {
            var queryData = {
                'channel': {
                    'status': status
                }
            };
            var stringQuery = JSON.stringify(queryData);
            var contentLength = stringQuery.length;
            var requestUrl = config.twitchApiRoot + '/channels/' + channel + '?channel[status]=' + status;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('PUT', requestUrl, false);
            xmlhttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v2+json');
            xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
            xmlhttp.setRequestHeader('Authorization', 'OAuth ' + config.twitchAccessToken);
            xmlhttp.setRequestHeader('Scope', 'channel-editor');
            xmlhttp.setRequestHeader('Content-Length', contentLength);
            xmlhttp.send(stringQuery);
            return JSON.parse(xmlhttp.responseText);
        }
    });

};
