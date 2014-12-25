module.exports = function (io) {

  var ptsData = {};
  var ptsTopics = [];

  io.on('connection', function(socket){
    console.log('user connected');

    socket.on('disconnect', function() {
      console.log('user disconnected');
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
