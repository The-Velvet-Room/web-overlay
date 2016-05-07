var redis = require('redis');

var client = redis.createClient();
var redisOverlayKey = 'web-overlay-overlay';
var redisLayoutKey = 'web-overlay-layout';

module.exports = function (io) {

  var overlay = io.of('/overlay');

  overlay.on('connection', function(socket) {
    // Log the new connection
    console.log('overlay user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    client.get(redisOverlayKey, function (err, reply) {
      if (err) {
        console.log(err);
      } else if (reply) {
        socket.emit('update overlay', JSON.parse(reply));
      }
    });

    // Set the layout to last-selected option
    client.get(redisLayoutKey, function (err, reply) {
      if (err) {
        console.log(err);
      } else if (reply) {
        socket.emit('change layout', JSON.parse(reply));
      }
    });

    socket.on('disconnect', function() {
      console.log('overlay user disconnected: ' + socket.handshake.address);
    });

    socket.on('update overlay', function(msg) {
      client.set(redisOverlayKey, JSON.stringify(msg));
      overlay.emit('update overlay', msg);
      console.log('update overlay: ' + JSON.stringify(msg));
    });

    socket.on('flash screen', function() {
      overlay.emit('flash screen');
    });

    socket.on('generate profile', function(msg) {
      overlay.emit('generate profile', msg);
    });

    socket.on('play intro', function(msg) {
      overlay.emit('play intro', msg);
      console.log('play intro: ' + JSON.stringify(msg));
    });

    socket.on('change layout', function(msg) {
      client.set(redisLayoutKey, JSON.stringify(msg));
      overlay.emit('change layout', msg);
      console.log('change layout: ' + JSON.stringify(msg));
    });

    socket.on('fire transition', function() {
      overlay.emit('fire transition');
    });

    socket.on('fire announcement', function(msg) {
      overlay.emit('fire announcement', msg);
    });

  });
};
