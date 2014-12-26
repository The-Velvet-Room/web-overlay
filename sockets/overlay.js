module.exports = function (io) {

  var data = {};

  var overlay = io.of('/overlay');

  overlay.on('connection', function(socket) {
    console.log('overlay user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    socket.on('disconnect', function() {
      console.log('overlay user disconnected: ' + socket.handshake.address);
    });

    socket.on('request overlay', function() {
      console.log('fetching old overlay: ' + JSON.stringify(data));
      socket.emit('update overlay', data);
    });

    socket.on('update overlay', function(msg) {
      data = msg;
    	overlay.emit('update overlay', data);
    	console.log('update overlay: ' + JSON.stringify(data));
  	});
  });

}
