var request = require('request');
var pmx = require('pmx');

// example URL: https://smash.gg/tournament/salt-in-the-city-3/brackets/11558/10844/38067
// 11558 is the event, 10844 is the phase, and 38067 is the phase group
// returns
function parseUrl(url) {
    var offset = 0;
    url = url.trim();
    if (url.endsWith('/')) {
        url = url.substr(0, url.length - 1)
    }
    if (url.endsWith('/bracket')) {
        offset = 1;
    }
    splitUrl = url.split('/');
    return {
        event: splitUrl[splitUrl.length - offset - 3],
        phase: splitUrl[splitUrl.length - offset - 2],
        phaseGroup: splitUrl[splitUrl.length - offset - 1],
    };
}

function getPhaseGroupUrl(phaseGroupId) {
    var prefix = "https://smash.gg/api/-/resource/gg_api./phase_group/";
    var params = ";expand=%5B%22sets%22%2C%22seeds%22%2C%22entrants%22%5D;force=true;reset=false";
    return prefix + phaseGroupId + params;
}

function parseResponse(response) {
    var matches = response.entities.sets.filter(function(set) {
        // smash gg seems to return a lot of junk matches, so let's
        // filter them out.
        // In particular, cases where there are byes in round 1
        if (Math.abs(set.round) === 1) {
            return !(set.entrant1PrereqType === 'bye' || set.entrant2PrereqType === 'bye');
        }
        return !(set.entrant1PrereqType === 'bye' && set.entrant2PrereqType === 'bye');
    }).map(function(set) {
        return parseMatch(set);
    });

    var players = response.entities.entrants.map(function(player) {
        return parsePlayer(player);
    })

    return {
        matches: matches,
        players: players
    };
}

function parseMatch(match) {
    return {
        id: match.id,
        identifier: match.identifier,
        round: match.round,
        state: parseMatchState(match),
        player1Id: match.entrant1Id,
        player2Id: match.entrant2Id,
        player1PrereqId: match.entrant1PrereqId,
        player2PrereqId: match.entrant2PrereqId,
        player1Score: match.entrant1Score,
        player2Score: match.entrant2Score
    };
}

function parseMatchState(match) {
    if (match.state === 3) {
        return 'complete';
    }
    if (match.state === 1 &&
        match.entrant1Id !== null &&
        match.entrant2Id !== null) {
        return 'open';
    }
    return 'pending';
}

function parsePlayer(player) {
    return {
        id: player.id,
        name: player.name,
    };
}

function fetchData(bracketUrl, callback) {
    var phaseGroupId = parseUrl(bracketUrl).phaseGroup;
    var options = {
        url: getPhaseGroupUrl(phaseGroupId),
        method: 'GET',
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var jsonResponse = JSON.parse(body);
                var normalizedResponse = parseResponse(jsonResponse);
                callback(normalizedResponse);
            } catch (e) {
                console.log(e);
                var errorMessage = 'Smash.gg response could not be parsed: ' + body;
                console.log(errorMessage)
                pmx.notify(errorMessage)
            }
        }
    })
}

module.exports = {
    isUrl: function(url) {
        return url.indexOf("smash.gg") !== -1;
    },
    fetchBracketData: function(url, callback) {
        fetchData(url, callback);
    }
}