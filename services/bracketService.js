var smashGGService = require('./smashGGService');
var challongeService = require('./challongeService');

function fetchBracketData(url, callback) {
    if (smashGGService.isUrl(url)) {
        smashGGService.fetchBracketData(url, callback);
    } else if (challongeService.isUrl(url)) {
        challongeService.fetchBracketData(url, callback);
    } else {
        callback();
    }
}

function parseTop8(bracket) {
    var top8Object = {
        matches: [],
        participants: []
    };
    var participantDict = {};
    var i;
    var maxRound = 0;
    var minRound = 0;

    var matches = bracket.matches;
    var players = bracket.players;

    // This is inefficient, but I couldn't figure out the math formula for determining
    // which round would put you in the top 8 for winners and losers.
    for (i = 0; i < matches.length; i++) {
        if (matches[i].round > maxRound) {
            maxRound = matches[i].round;
        } else if (matches[i].round < minRound) {
            minRound = matches[i].round;
        }
    }

    // Check the round so we only send matches and participants
    // in the top 8. Winners bracket rounds are positive and losers
    // bracket rounds are negative.
    //
    // The first round of top 8 losers is the 4th round back from
    // the last round of losers, and the first round of top 8
    // winners is the 3rd round back from the last round of winners.
    top8Object.matches = matches.filter(function(match) {
        if (match.round && (match.round > maxRound - 3 || match.round < minRound + 4)) {
            participantDict[match.player1Id] = true;
            participantDict[match.player2Id] = true;
            return true;
        }
        return false;
    });

    top8Object.participants = players.filter(function(player) {
        return !!participantDict[player.id];
    });

    return top8Object;
}

module.exports = {
    getTop8: function(url, callback) {
        fetchBracketData(url, function(data) {
            var top8 = parseTop8(data);
            callback(top8);
        });
    },
    getBracketData: function(url, callback) {
        fetchBracketData(url, callback);
    }
}