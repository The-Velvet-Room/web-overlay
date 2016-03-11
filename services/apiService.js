var pmx = require('pmx');
var redisService = require('./redisService');

module.exports = {
	getCurrentMatchState: function(callback) {
		redisService.getOverlayData(function(data) {
			return callback(data);
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

		redisService.getReplayData(function(reply) {
			var replays = reply || [];
			replays.push(newReplay);
			redisService.setReplayData(replays);
			console.log('New replay count: '+replays.length);
			callback(true);
		});
	},

	getReplays: function(callback) {
		redisService.getReplayData(function(data) {
			return callback(data);
		});
	}
}