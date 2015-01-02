var config = require('../config');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
module.exports = function(io) {
    var challongeData = {};
    var challongePollFrequency = 10000;
    var connectedSockets = 0;
    var challongeApiRoot = 'https://Camtendo:'+config.challongeApiKey+'@api.challonge.com/v1';
    var challongeHash = '';
    var matches = [];
    var players = [];

    var challongeIO = io.of('/challonge');

    challongeIO.on('connection', function(socket) {
        console.log('Challonge connected');
        socket.emit('update challonge', challonge);
        connectedSockets++;

        socket.on('disconnect', function() {
            console.log('Challonge disconnected');
            connectedSockets--;
        });

        socket.on('update challonge', function(msg) {
            challongeData = msg;
            if (challongeData.challongeUrl) {
                if (!challongeHash) {
                    challongeData = createChallongeHash(challongeData.challongeUrl);
                }

                getchallongePollableData(challongeData);
                setTimeout(pollchallonge, challongePollFrequency);
            }

            challongeIO.emit('update challonge', challongeData);
            console.log('update challonge: ' + JSON.stringify(challongeData));
        });

        function pollChallonge() {
            getchallongePollableData(challongeData);
            if (connectedSockets > 0 && challongeData.challongeUsername)
              setTimeout(pollchallonge, challongePollFrequency);
        }

        function getchallongePollableData(challongeData) {
            console.log('Polling challonge for updates...');
            challongeData = fetchChallongeData(challongeData);
            challongeData.upcomingMatches = getUpcomingMatches();
            console.log('New challonge Pollable Data: ' + JSON.stringify(challongeData));
            socket.emit('update challonge readonly data', challongeData);
        }

        function fetchChallongeData(challongeData) {
            var requestUrl = challongeApiRoot + '/tournaments/' + challongeHash + '.json?include_matches=1&include_participants=1';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', requestUrl, false);
            xmlhttp.send();
            console.log('Requesting channel data for ' + challongeData.challongeUrl);
            var challongeResponse = JSON.parse(xmlhttp.responseText);
            matches = challongeResponse.tournament.matches;
            players = challongeResponse.tournament.participants;
            return challongeData;
        }

        function getUpcomingMatches() {
            var upcomingMatches = [];
            matches.forEach(function(match){
                //Their JSON sucks
                if (match.match.state == 'open') {
                    upcomingMatches.push(match);
                }
            });

            return upcomingMatches;
        }

        function createChallongeHash(challongeUrl) {
            tourneyHash = challongeUrl.substring(challongeUrl.lastIndexOf('/') + 1).trim();

            //If tournament belongs to an organization,
            //it must be specified in the request
            if (challongeUrl.split('.').length - 1 > 1) {
                orgHash = challongeUrl.substring(challongeUrl.lastIndexOf('http://') + 7, challongeUrl.indexOf('.'));
                challongeHash = orgHash + '-' + tourneyHash;    
                return;
            }

            //Standard tournament
            challongeHash = tourneyHash;
        }
    });
}