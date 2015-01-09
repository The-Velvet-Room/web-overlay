var config = require('../config');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
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

    var challongeIO = io.of('/challonge');

    challongeIO.on('connection', function(socket) {
        console.log('Challonge connected');
        socket.emit('update challonge', challongeData);
        connectedSockets++;

        socket.on('disconnect', function() {
            console.log('Challonge disconnected');
            connectedSockets--;
        });

        socket.on('update challonge', function(msg) {
            var urlChanged = msg.challongeUrl !== challongeData.challongeUrl;
            challongeData = msg;
            if (challongeData.challongeUrl) {
                if (!challongeHash || urlChanged) {
                    challongeHash = createChallongeHash(challongeData.challongeUrl);
                    pollChallonge();
                }
            }

            console.log('update challonge: ' + JSON.stringify(challongeData));
        });

        function pollChallonge() {
            getChallongePollableData(challongeData);
            if (connectedSockets > 0 && challongeHash)
              setTimeout(pollChallonge, challongePollFrequency);
        }

        function getChallongePollableData(data) {
            console.log('Polling challonge for updates...');
            fetchChallongeData(data);
            data.upcomingMatches = getUpcomingMatches();
            data = checkForMatchUpdates(data);
            data.players = getPlayerDictionary();

            challongeData = data;
            console.log('Challonge update complete');
            challongeIO.emit('update challonge', challongeData);
        }

        function fetchChallongeData(data) {
            var requestUrl = challongeApiRoot + '/tournaments/' + challongeHash + '.json?include_matches=1&include_participants=1';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', requestUrl, false);
            //Basic Auth must be encoded or request will be denied
            xmlhttp.setRequestHeader('Authorization', 'Basic ' + new Buffer(config.challongeDevUsername + ':' + config.challongeApiKey).toString('base64'));
            xmlhttp.send();
            console.log('Requesting tournament data for ' + data.challongeUrl);
            console.log(xmlhttp.responseText);
            var challongeResponse = JSON.parse(xmlhttp.responseText);
            matches = challongeResponse.tournament.matches;
            players = challongeResponse.tournament.participants;
        }

        function getUpcomingMatches() {
            var upcomingMatches = [];
            matches.forEach(function(match){
                //Their JSON sucks
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

        function checkForMatchUpdates(data) {
            if (Object.equals(data.upcomingMatches, availableMatchesCache)) {
                data.matchesChanged = false;
            }
            else {
                data.matchesChanged = true;
                availableMatchesCache = data.upcomingMatches;
                console.log('Matches changed. Will alert clients.');
            }

            return data;
        }

        //Used to detect match changes with high accuracy
        //https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
        Object.equals = function( x, y ) {
          if ( x === y ) return true;
            // if both x and y are null or undefined and exactly the same

          if ( !( x instanceof Object ) || !( y instanceof Object ) ) return false;
            // if they are not strictly equal, they both need to be Objects

          if ( x.constructor !== y.constructor ) return false;
            // they must have the exact same prototype chain, the closest we can do is
            // test there constructor.

          for ( var p in x ) {
            if ( !x.hasOwnProperty( p ) ) continue;
              // other properties were tested using x.constructor === y.constructor

            if ( !y.hasOwnProperty( p ) ) return false;
              // allows to compare x[ p ] and y[ p ] when set to undefined

            if ( x[ p ] === y[ p ] ) continue;
              // if they have the same strict value or identity then they are equal

            if ( typeof ( x[ p ] ) !== 'object' ) return false;
              // Numbers, Strings, Functions, Booleans must be strictly equal

            if ( !Object.equals( x[ p ],  y[ p ] ) ) return false;
              // Objects and Arrays must be tested recursively
          }

          for ( p in y ) {
            if ( y.hasOwnProperty( p ) && !x.hasOwnProperty( p ) ) return false;
              // allows x[ p ] to be set to undefined
          }
          return true;
        };
    });
};
