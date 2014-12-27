module.exports = function (io) {

  var ptsData = {};
  var ptsTopics = [];

  var pts = io.of('/pardonthesmash');

  pts.on('connection', function(socket) {
    // Log the new connection
    console.log('pardonthesmash user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    socket.emit('start timer pts', ptsData);
    socket.emit('update topics pts', ptsTopics);

    socket.on('disconnect', function() {
      console.log('pardonthesmash user disconnected: ' + socket.handshake.address);
    });

    socket.on('start timer pts', function(msg){
      ptsData = msg;
      pts.emit('start timer pts', ptsData);
      console.log('start timer pts: ' + JSON.stringify(ptsData));
    });

    socket.on('update topics pts', function (msg) {
      ptsTopics = msg;
      console.log('update topics pts: ' + JSON.stringify(ptsTopics));
      pts.emit('update topics pts', ptsTopics);
    });
  });

}
