var redis = require('redis');

var client = redis.createClient();

var redisUsersKey = 'web-overlay-users';
var redisOverlayKey = 'web-overlay-overlay';
var redisReplaysKey = 'web-overlay-replays';
var redisChallongeKey = 'web-overlay-challonge';
var redisTwitchKey = 'web-overlay-twitch';

//TODO implement this when we're sure all data will be JSON
function isValidJson (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
};

module.exports = {
	getUsersData: function(callback) {
		this.get(redisUsersKey, function(data) {
			return callback(data);
		});
	},
	setUsersData: function (newData) {
		this.set(redisUsersKey, newData);
	},
	getOverlayData: function(callback) {
		this.get(redisOverlayKey, function(data) {
			return callback(data);
		});
	},
	setOverlayData: function (newData) {
		this.set(redisOverlayKey, newData);
	},
	getTwitchData: function(callback) {
		this.get(redisTwitchKey, function(data) {
			return callback(data);
		});
	},
	setTwitchData: function (newData) {
		this.set(redisTwitchKey, newData);
	},
	getReplayData: function(callback) {
		this.get(redisReplaysKey, function(data) {
			return callback(data);
		});
	},
	setReplayData: function (newData) {
		this.set(redisReplaysKey, newData);
	},	
	get: function(key, callback) {
		client.get(key, function(err, reply) {
			return callback(JSON.parse(reply));
		});
	},
	set: function(key, data) {
		client.set(key, JSON.stringify(data));
	}
}