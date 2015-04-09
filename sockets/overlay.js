var redis = require('redis');

var client = redis.createClient();
var redisKey = 'web-overlay-overlay';

module.exports = function (io) {

  var overlay = io.of('/overlay');

  overlay.on('connection', function(socket) {
    // Log the new connection
    console.log('overlay user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    client.get(redisKey, function (err, reply) {
      if (err) {
        console.log(err);
      } else if (reply) {
        socket.emit('update overlay', JSON.parse(reply));
      }
    });

    socket.on('disconnect', function() {
      console.log('overlay user disconnected: ' + socket.handshake.address);
    });

    socket.on('update overlay', function(msg) {
      client.set(redisKey, JSON.stringify(msg));
      overlay.emit('update overlay', msg);
      console.log('update overlay: ' + JSON.stringify(msg));
    });

    socket.on('flash screen', function() {
      overlay.emit('flash screen');
    });

    socket.on('play intro', function(msg) {
      client.set(redisKey, JSON.stringify(msg));
      overlay.emit('play intro', msg);
      console.log('play intro: ' + JSON.stringify(msg));
    });
  });

};
