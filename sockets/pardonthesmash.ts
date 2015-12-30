export = function (io: SocketIO.Server) {

  var ptsData = {};
  var ptsTopics: any[] = [];

  var pts = io.of('/pardonthesmash');

  pts.on('connection', function(socket) {
    // Log the new connection
    console.log('pardonthesmash user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    socket.emit('start timer', ptsData);
    socket.emit('update topics', ptsTopics);

    socket.on('disconnect', function() {
      console.log('pardonthesmash user disconnected: ' + socket.handshake.address);
    });

    socket.on('start timer', function(msg: any){
      ptsData = msg;
      pts.emit('start timer', ptsData);
      console.log('start timer: ' + JSON.stringify(ptsData));
    });

    socket.on('update topics', function (msg: any[]) {
      ptsTopics = msg;
      console.log('update topics: ' + JSON.stringify(ptsTopics));
      pts.emit('update topics', ptsTopics);
    });
  });

};
