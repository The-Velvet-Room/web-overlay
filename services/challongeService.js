var request = require('request');
var pmx = require('pmx');
var config = require('../config');

function getChallongeHash(challongeUrl) {
    var tourneyHash = challongeUrl.substring(challongeUrl.lastIndexOf('/') + 1).trim();

    //If tournament belongs to an organization,
    //it must be specified in the request
    if (challongeUrl.split('.').length - 1 > 1) {
        var orgHash = challongeUrl.substring(challongeUrl.lastIndexOf('http://') + 7, challongeUrl.indexOf('.'));
        challongeHash = orgHash + '-' + tourneyHash;
        return challongeHash;
    }

    //Standard tournament
    return tourneyHash;
}

function getApiUrl(challongeUrl) {
    var hash = getChallongeHash(challongeUrl);
    return 'https://api.challonge.com/v1/tournaments/' + hash + '.json?include_matches=1&include_participants=1';
}

function parseResponse(response) {
    var matches = response.tournament.matches.map(function(match) {
        return parseMatch(match);
    });

    var players = response.tournament.participants.map(function(player) {
        return parsePlayer(player);
    })

    return {
        matches: matches,
        players: players
    };
}

function parseMatch(match) {
    score1 = null;
    score2 = null;
    if (match.match.scores_csv.indexOf('-')) {
        var scoresArr = match.match.scores_csv.split('-')
        score1 = parseInt(scoresArr[0])
        score2 = parseInt(scoresArr[1])
    }
    return {
        id: match.match.id,
        identifier: match.match.identifier,
        round: match.match.round,
        state: match.match.state,
        player1Id: match.match.player1_id,
        player2Id: match.match.player2_id,
        player1PrereqId: match.match.player1_prereq_match_id,
        player2PrereqId: match.match.player2_prereq_match_id,
        player1Score: score1,
        player2Score: score2
    };
}

function parsePlayer(player) {
    return {
        id: player.participant.id,
        name: player.participant.name,
    };
}

function fetchData(bracketUrl, callback) {
    var headers = {
        //Basic Auth must be encoded or request will be denied
        'Authorization': 'Basic ' + new Buffer(config.challongeDevUsername + ':' + config.challongeApiKey).toString('base64')
    };
    var options = {
        url: getApiUrl(bracketUrl),
        method: 'GET',
        headers: headers
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var jsonResponse = JSON.parse(body);
                var normalizedResponse = parseResponse(jsonResponse);
                callback(normalizedResponse);
            } catch (e) {
                console.log(e)
                var errorMessage = 'Challonge response could not be parsed: ' + body;
                console.log(errorMessage)
                pmx.notify(errorMessage)
            }
        }
    })
}

module.exports = {
    isUrl: function(url) {
        return url.indexOf('challonge') != -1;
    },
    fetchBracketData: function(url, callback) {
        fetchData(url, callback);
    }
}