module.exports = function (io) {

  var ptsData = {};
  var ptsTopics = [];

  var pts = io.of('/pardonthesmash');

  pts.on('connection', function(socket) {
    console.log('pardonthesmash user connected');

    socket.on('disconnect', function() {
      console.log('pardonthesmash user disconnected');
    });

    socket.on('start timer pts', function(msg){
      ptsData = msg;
      pts.emit('start timer pts', ptsData);
      console.log('start timer pts: ' + JSON.stringify(ptsData));
    });

    socket.on('request timer pts', function() {
      console.log('fetching old timer pts: ' + JSON.stringify(ptsData));
      socket.emit('start timer pts', ptsData);
    });

    socket.on('update topics pts', function (msg) {
      ptsTopics = msg;
      console.log('update topics pts: ' + JSON.stringify(ptsTopics));
      pts.emit('update topics pts', ptsTopics);
    });

    socket.on('request topics pts', function() {
      console.log('fetching old topics pts: ' + JSON.stringify(ptsTopics));
      socket.emit('update topics pts', ptsTopics);
    });
  });

}
