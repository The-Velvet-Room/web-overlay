//TODO Break into separate services

var config = require('../config');
var request = require('request');
var redis = require('redis');
var pmx = require('pmx');

var client = redis.createClient();
var redisUsersKey = 'web-overlay-users';
var redisOverlayKey = 'web-overlay-overlay';
var redisReplaysKey = 'web-overlay-replays';

module.exports = {
	getCurrentMatchState: function(callback) {
		client.get(redisOverlayKey, function(err, reply) {
			return callback(JSON.parse(reply));
		});
	},

	//Replay Data Structure
	// string url - media file location
	// Array<string> players - participating players by id
	// long dateCreated - JS date (inserted automatically)
	// string game - game being played in the replay
	// string highlightPlayer - id of player performing well

	addReplay: function(newReplay, callback) {
		//Add timestamp
		var date = new Date();
		newReplay.dateCreated = date.getTime();

		client.get(redisReplaysKey, function(err, reply) {
			var replays = JSON.parse(reply) || [];
			console.log(replays);
			replays.push(newReplay);
			client.set(redisReplaysKey, JSON.stringify(replays));
			console.log('New replay count: '+replays.length);
			callback(true);
		});
	},

	getReplays: function(callback) {
		client.get(redisReplaysKey, function(err, reply) {
			return callback(JSON.parse(reply));
		});
	}
}