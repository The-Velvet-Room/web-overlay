var config = require('../config');
//npm install xmlhttprequest if this fails
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
module.exports = function (io) {

  var data = {};
  var twitchPollingInterval = null;
  //In millis
  var twitchPollFrequency = 60000;
  var twitchPollCache = {};
  data.config = config;

  io.on('connection', function(socket){
    console.log('user connected');

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    socket.on('join', function(data) {
      socket.join(data.room);
    });

    socket.on('update overlay', function(msg){
      data = msg;
      data.config = config;
      if (data.twitchUsername)
      {
      	if(!data.twitchGame)
      	{
      		data = initializeTwitchData(data);
      		twitchPollCache = data;
      		getTwitchPollableData(data);
      		twitchPollingInterval = setInterval(
      			function() {
      				getTwitchPollableData(twitchPollCache)
      			}, twitchPollFrequency);
      	}
      	else
      	{
      		//data = updateTwitchData(data);
      	}
      }
      else
      {
      	console.log('Stopping Twitch polling...');
      	clearInterval(twitchPollingInterval);
      }
      	
      io.emit('update overlay', data);
      console.log('update overlay: ' + JSON.stringify(data));
  	});

    socket.on('request overlay', function() {
      console.log('fetching old overlay: ' + JSON.stringify(data));
      socket.emit('update overlay', data);
    });

    function getTwitchPollableData(data) {
    	data = getTwitchFollowerData(data);
    	console.log('Polling Twitch for updates...');
    	socket.emit('update twitch readonly data', data);
    }

    function getTwitchFollowerData(data) {
    	var requestUrl = config.twitchApiRoot + '/channels/'+data.twitchUsername+'/follows/';
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.open('GET',requestUrl,false);
		xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
		xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
		xmlhttp.send();
		console.log('Requesting follower data for '+data.twitchUsername);
		var twitchResponse = JSON.parse(xmlhttp.responseText);
		data.twitchFollowers = twitchResponse._total;
		data.twitchLastFollower = twitchResponse.follows[0].user.name;
		return data;
    }

    function updateTwitchData(data) {
    	var channelName = data.twitchUsername;
    	var game = setTwitchGame(data.twitchUsername, data.twitchGame).game;
    	//var status = set
    };

    function initializeTwitchData(data) {
    	var requestUrl = config.twitchApiRoot + '/channels/'+data.twitchUsername;
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.open('GET',requestUrl,false);
		xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
		xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
		xmlhttp.setRequestHeader('Authorization', 'OAuth '+config.twitchAccessToken);
		xmlhttp.send();
		console.log('Requesting channel data for '+data.twitchUsername);
		var twitchResponse = JSON.parse(xmlhttp.responseText);
		//console.log('Response: %j', twitchResponse);
		data.twitchGame = twitchResponse.game;
		data.twitchStatus = twitchResponse.status;
		return data;
    }

    function setTwitchGame(channel, gameName) {
    	var data = {"channel": {"game": game}}
    	var stringQuery = JSON.stringify(data)
    	var contentLength = stringQuery.length
    	var requestUrl = config.twitchApiRoot + '/channels/'+channel+'?channel[game]='+game;
    	
    	xmlhttp.open('POST',requestUrl,false);
		xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
		xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
		xmlhttp.setRequestHeader('Authorization', 'OAuth '+config.twitchAccessToken);
		xmlhttp.setRequestHeader('Scope', 'channel-editor');
		xmlhttp.setRequestHeader('Content-Length', contentLength);
		xmlhttp.send(stringQuery);
		return JSON.parse(xmlhttp.responseText);
    }
  });

}
