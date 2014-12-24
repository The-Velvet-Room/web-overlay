var config = require('../config');
//npm install xmlhttprequest if this fails
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
module.exports = function (io) {

  var data = {};

  var twitchData = {};
  var twitchPollingInterval = null;
  //In millis
  var twitchPollFrequency = 60000;
  var twitchPollCache = {};

  var ptsData = {};
  var ptsTopics = [];

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
      io.emit('update overlay', data);
      console.log('update overlay: ' + JSON.stringify(data));
  	});

    socket.on('update twitch', function(msg){
      twitchData = msg;
      if (twitchData.twitchUsername)
      {
        if(!twitchData.twitchGame)
        {
          twitchData = initializeTwitchData(twitchData);
          twitchPollCache = twitchData;
          getTwitchPollableData(twitchData);
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

      io.emit('update twitch', twitchData);
      console.log('update twitch: ' + JSON.stringify(twitchData));
    });

    socket.on('request overlay', function() {
      console.log('fetching old overlay: ' + JSON.stringify(data));
      socket.emit('update overlay', data);
      socket.emit('update twitch', twitchData);
    });

    function getTwitchPollableData(twitchData) {
      console.log('Polling Twitch for updates...');
    	twitchData = getTwitchFollowerData(twitchData);
      twitchData = getTwitchViewerData(twitchData);
      console.log('New Twitch Pollable Data: '+ JSON.stringify(twitchData));
    	socket.emit('update twitch readonly data', twitchData);
    }

    function getTwitchFollowerData(twitchData) {
    	var requestUrl = config.twitchApiRoot + '/channels/'+twitchData.twitchUsername+'/follows/';
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.open('GET',requestUrl,false);
  		xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
  		xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
  		xmlhttp.send();
  		console.log('Requesting follower data for '+twitchData.twitchUsername);
  		var twitchResponse = JSON.parse(xmlhttp.responseText);
  		twitchData.twitchFollowers = twitchResponse._total;
  		twitchData.twitchLastFollower = twitchResponse.follows[0].user.name;
  		return twitchData;
    }

    function getTwitchViewerData(twitchData) {
      var requestUrl = config.twitchApiRoot + '/streams/'+twitchData.twitchUsername;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET',requestUrl,false);
      xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
      xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
      xmlhttp.send();
      console.log('Requesting viewer data for '+twitchData.twitchUsername);
      var twitchResponse = JSON.parse(xmlhttp.responseText);
      var stream = twitchResponse.stream;
      twitchData.twitchViewers = stream ? stream.viewers : null;
      return twitchData;
    }

    function updateTwitchData(twitchData) {
    	var channelName = twitchData.twitchUsername;
    	var game = setTwitchGame(twitchData.twitchUsername, twitchData.twitchGame).game;
    	//var status = set
    };

    function initializeTwitchData(twitchData) {
    	var requestUrl = config.twitchApiRoot + '/channels/'+twitchData.twitchUsername;
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.open('GET',requestUrl,false);
  		xmlhttp.setRequestHeader('Accept','application/vnd.twitchtv.v2+json');
  		xmlhttp.setRequestHeader('Client-Id', config.twitchClientId);
  		xmlhttp.setRequestHeader('Authorization', 'OAuth '+config.twitchAccessToken);
  		xmlhttp.send();
  		console.log('Requesting channel data for '+twitchData.twitchUsername);
  		var twitchResponse = JSON.parse(xmlhttp.responseText);
  		//console.log('Response: %j', twitchResponse);
  		twitchData.twitchGame = twitchResponse.game;
  		twitchData.twitchStatus = twitchResponse.status;
  		return twitchData;
    }

    function setTwitchGame(channel, gameName) {
    	var queryData = {"channel": {"game": game}};
    	var stringQuery = JSON.stringify(queryData);
    	var contentLength = stringQuery.length;
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
    socket.on('start timer pts', function(msg){
      ptsData = msg;
      io.emit('start timer pts', ptsData);
      console.log('start timer pts: ' + JSON.stringify(ptsData));
    });

    socket.on('request timer pts', function() {
      console.log('fetching old timer pts: ' + JSON.stringify(ptsData));
      socket.emit('start timer pts', ptsData);
    });

    socket.on('update topics pts', function (msg) {
      ptsTopics = msg;
      console.log('update topics pts: ' + JSON.stringify(ptsTopics));
      io.emit('update topics pts', ptsTopics);
    });

    socket.on('request topics pts', function() {
      console.log('fetching old topics pts: ' + JSON.stringify(ptsTopics));
      socket.emit('update topics pts', ptsTopics);
    });
  });

}
