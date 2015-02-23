var characterLeft = null;
var characterRight = null;

//array of character names
var characters =['bowser','bowser-jr','captain-falcon','charizard','dark-pit','king-dedede',
'diddy-kong','donkey-kong','dr-mario','duck-hunt-dog','falco','fox','ganondorf',
'mr-game-and-watch','greninja','ice-climbers','ike','ivysaur','jigglypuff','kirby','link',
'little-mac','lucario', 'lucas','lucina','luigi','mario','marth','megaman','metaknight',
'mewtwo','mii','ness','olimar','pacman','palutena','peach','pichu','pikachu','pit','rob',
'robin','rosalina','roy','samus','sheik','shulk', 'snake','squirtle','sonic','toon-link',
'villager','wario','wii-fit-trainer','wolf','yoshi','young-link','zelda','zero-suit-samus']

//Pass in either 'Left' or 'Right'
function createCharacterList(direction) {
	var selectList = document.createElement('select');
	selectList.id = 'charList'+direction;
	document.getElementById('charList'+direction+'Placeholder').appendChild(selectList);

	var defaultOption = document.createElement('option');
	defaultOption.text = 'None';
	defaultOption.value = null;
	selectList.appendChild(defaultOption);

	characters.forEach(function(character){
		var option = document.createElement('option');
		option.text = character;
		option.value = character;
		selectList.appendChild(option);
	});

	$('#charList'+direction).change(function(){
		var selectedOption = $('#charList'+direction+' option:selected');

		if(direction == 'Left') {
			characterLeft = selectedOption.val();
		}
		else {
			characterRight = selectedOption.val();
		}
		sendUpdate();
	});
}

createCharacterList('Left');
createCharacterList('Right');

var socket = io('/overlay');

socket.on('update overlay', function(data) {
	document.getElementById('lplayer').value = data.lplayer || '';
	document.getElementById('rplayer').value = data.rplayer || '';
	document.getElementById('title').value = data.title || '';
	document.getElementById('commentators').value = data.commentators || '';
	document.getElementById('twitter').value = data.twitter || '';
	document.getElementById('lscore').value = data.lscore || 0;
	document.getElementById('rscore').value = data.rscore || 0;
	characterLeft = data.lCharacter || null;
	characterRight = data.rCharacter || null;
});

var twitchSocket = io('/twitch');
var twitchGame = null;
var twitchStatus = null;
var twitchUsername = null;

twitchSocket.on('send twitch data', function(data) {
	twitchUsername = data.twitchUsername;
	document.getElementById('twitchUsername').value = data.twitchUsername || '';
	twitchStatus = data.twitchStatus;
	document.getElementById('twitchStatus').value = data.twitchStatus || '';
	twitchGame = data.twitchGame;
	document.getElementById('twitchGame').value = data.twitchGame || '';
	document.getElementById('twitchFollowers').value = data.twitchFollowers || 0;
	document.getElementById('twitchLastFollower').value = data.twitchLastFollower || '';
	document.getElementById('twitchViewers').value = data.twitchViewers || 'offline';
	document.getElementById('twitchPeakViewers').value = data.twitchPeakViewers || 'offline';
	if (data.twitchUsername) {
		animateTwitchData(true);
	}
});

twitchSocket.on('update twitch followers', function(data) {
	document.getElementById('twitchFollowers').value = data.followers || 0;
	document.getElementById('twitchLastFollower').value = data.lastFollower || '';

	animateTwitchData(true);
});

twitchSocket.on('update twitch viewers', function(data) {
	document.getElementById('twitchViewers').value = data.viewers || 'offline';
	document.getElementById('twitchPeakViewers').value = data.peakViewers || 'offline';

	animateTwitchData(true);
});

twitchSocket.on('update twitch channel info', function(data) {
	twitchStatus = data.status;
	document.getElementById('twitchStatus').value = data.status || '';
	twitchGame = data.game;
	document.getElementById('twitchGame').value = data.game || '';
	twitchUsername = data.username;
	document.getElementById('twitchUsername').value = data.username || '';

	animateTwitchData(true);
});

function animateTwitchData(shouldShow) {
	if (shouldShow) {
		$('.requires-twitch').show(200);
	} else {
		$('.requires-twitch').hide(200);
	}
}

var challongeSocket = io('/challonge');
var challongeMatches = [];
var challongeUrl;

challongeSocket.on('update challonge', function(data){
	if (data.challongeUrl && (data.challongeUrl !== challongeUrl || document.getElementById('challongeBracket') === null)) {
		document.getElementById('challongeUrl').value = data.challongeUrl || '';
		document.getElementById('challongeApiHash').value = data.challongeApiHash || '';
		challongeUrl = data.challongeUrl;
		embedChallongeBracket(challongeUrl);
	}

	if (data.upcomingMatches) {
		challongeMatches = data.upcomingMatches;
		createMatchList(data.players);
	}
});

function plusOneLeft() {
	var numVal = parseInt(document.getElementById('lscore').value);
	document.getElementById('lscore').value = numVal + 1;
	sendUpdate();
}

function plusOneRight() {
	var numVal = parseInt(document.getElementById('rscore').value);
	document.getElementById('rscore').value = numVal + 1;
	sendUpdate();
}

function swapNames() {
	var tempPlayer = document.getElementById('lplayer').value;
	document.getElementById('lplayer').value = document.getElementById('rplayer').value;
	document.getElementById('rplayer').value = tempPlayer;
	sendUpdate();
}

function zeroScores() {
	document.getElementById('lscore').value = 0;
	document.getElementById('rscore').value = 0;
	sendUpdate();
}

function sendUpdate() {
	var data = {
		'lplayer': document.getElementById('lplayer').value,
		'rplayer': document.getElementById('rplayer').value,
		'title': document.getElementById('title').value,
		'lscore': document.getElementById('lscore').value,
		'rscore': document.getElementById('rscore').value,
		'commentators': document.getElementById('commentators').value,
		'twitter': document.getElementById('twitter').value,
		'lCharacter': window.characterLeft || null,
		'rCharacter': window.characterRight || null
	};
	socket.emit('update overlay', data);
	toastNotify();
}

function sendTwitchUpdate() {
	var user = document.getElementById('twitchUsername').value;
	if (twitchUsername !== user) {
		twitchSocket.emit('update twitch user', user);
	} else {
		var data = {
			'status': document.getElementById('twitchStatus').value,
			'game': document.getElementById('twitchGame').value
		};
		twitchSocket.emit('update twitch channel info', data);
	}

	toastNotify();
}

function sendChallongeUpdate() {
	var url = document.getElementById('challongeUrl').value;
	var data = {
		'challongeUrl': document.getElementById('challongeUrl').value,
		'challongeApiHash': document.getElementById('challongeApiHash').value
	};
	challongeSocket.emit('update challonge', data);
	toastNotify();
}

function createMatchList(players) {
	var oldVal = null;
	var matchList = $('#challongeMatchList');
	if (matchList) {
		oldVal = matchList.val();
		matchList.remove();
	}

	var selectList = document.createElement('select');
	selectList.id = 'challongeMatchList';
	document.getElementById('challongeMatchListPlaceholder').appendChild(selectList);

	var defaultOption = document.createElement('option');
	defaultOption.text = 'Select a match to display';
	defaultOption.value = null;
	selectList.appendChild(defaultOption);

	challongeMatches.forEach(function(match){
		var option = document.createElement('option');
		var playerOne = players[match.match.player1_id];
		var playerTwo = players[match.match.player2_id];
		option.text = match.match.identifier + ': ' + playerOne + ' vs. ' + playerTwo;
		option.value = match.match.identifier;
		if (oldVal && option.value === oldVal) {
			option.selected = true;
		}
		selectList.appendChild(option);
	});

	$('#challongeMatchList').change(function(){
		var selectedOption = $('#challongeMatchList option:selected');
		var identifier = selectedOption.val();
		if (selectedOption.val()) {
			console.log('Updating match...');
			var match = getMatchForIdentifier(identifier);
			var playerOne = players[match.match.player1_id];
			var playerTwo = players[match.match.player2_id];
			document.getElementById('lplayer').value = playerOne;
			document.getElementById('rplayer').value = playerTwo;
			sendUpdate();
		}
	});
}

function getMatchForIdentifier(identifier) {
	//Sublime Text autocompleted a backwards loop because they are fast
	for (var i = challongeMatches.length - 1; i >= 0; i--) {
		if (challongeMatches[i].match.identifier === identifier)
			return challongeMatches[i];
	}

	return null;
}

function toastNotify() {
	// TODO: figure out how to make this an acknowledgment callback
	var info = $('#info');
	info.show();
	info.fadeOut(1200);
}

function embedChallongeBracket(url) {
	$('#challongeEmbedPlaceholder').empty();
	var embedded = document.createElement('iframe');
	embedded.id = 'challongeBracket';
	embedded.src = url + '/module';
	embedded.width = '100%';
	embedded.height = '500';
	embedded.frameboarder = '0';
	embedded.scrolling = 'auto';
	document.getElementById('challongeEmbedPlaceholder').appendChild(embedded);
}

function toggleNightMode() {
	var body = document.body;
	if (body.style.background === 'black') {
		body.style.color = 'black';
		body.style.background = 'white';
		return;
	}

	body.style.color = 'white';
	body.style.background = 'black';
}