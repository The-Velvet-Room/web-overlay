module.exports = function (io) {

  var data = {};
  var ptsData = {};

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

    socket.on('request overlay', function() {
      console.log('fetching old overlay: ' + JSON.stringify(data));
      socket.emit('update overlay', data);
    });

    socket.on('start timer pts', function(msg){
      ptsData = msg;
      io.emit('start timer pts', ptsData);
      console.log('start timer pts: ' + JSON.stringify(ptsData));
    });

    socket.on('request timer pts', function() {
      console.log('fetching old timer pts: ' + JSON.stringify(ptsData));
      socket.emit('start timer pts', ptsData);
    });
  });

}
