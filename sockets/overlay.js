module.exports = function (io) {

  var data = {};

  var overlay = io.of('/overlay');

  overlay.on('connection', function(socket) {
    // Log the new connection
    console.log('overlay user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    socket.emit('update overlay', data);

    socket.on('disconnect', function() {
      console.log('overlay user disconnected: ' + socket.handshake.address);
    });

    socket.on('update overlay', function(msg) {
      data = msg;
    	overlay.emit('update overlay', data);
    	console.log('update overlay: ' + JSON.stringify(data));
  	});
  });

}
