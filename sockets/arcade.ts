export = function (io: SocketIO.Server) {
    var data = {};

    var arcade = io.of('/arcade');

    arcade.on('connection', function(socket) {
        // Log the new connection
        console.log('velvet arcade user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

        socket.emit('update arcade', data);

        socket.on('disconnect', function() {
            console.log('velvet arcade user disconnected: ' + socket.handshake.address);
        });

        socket.on('update arcade', function(msg: any) {
            data = msg;
            console.log('update arcade: ' + JSON.stringify(data));
            arcade.emit('update arcade', data);
        });

    });
}
