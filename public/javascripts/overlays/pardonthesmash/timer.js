// Takes the output of timeLeft and returns a string formatted for display
function formatTime(timeRemaining) {
	var seconds = timeRemaining.seconds.toString();
	if (seconds.length === 1) {
		seconds = '0' + seconds;
	}
	return timeRemaining.minutes + ':' + seconds;
}

function timeLeft(endTime) {
	if (!endTime) {
		return {'minutes': 0, 'seconds': 0};
	}

	var end = new Date(endTime);
	var now = new Date();

	var diff = end - now;
	if (diff < 0) {
		return {'minutes': 0, 'seconds': 0};
	}

	return {'minutes': Math.floor(diff / 60000), 'seconds': Math.floor((diff % 60000) / 1000)};
}
