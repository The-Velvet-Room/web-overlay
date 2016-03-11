import * as redis from 'redis'
import { AdminData } from '../client/models/AdminData';

const client = redis.createClient();
const redisAdminKey = 'web-overlay-admin';

export = function (io: SocketIO.Server) {

  const admin = io.of('/admin');

  admin.on('connection', function(socket) {
    // Log the new connection
    console.log('admin user connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);

    // Send out existing data to the new connection
    client.get(redisAdminKey, function (err, reply) {
      if (err) {
        console.log(err);
      } else if (reply) {
        socket.emit('refresh admin', JSON.parse(reply));
      }
    });

    socket.on('disconnect', function() {
      console.log('admin user disconnected: ' + socket.handshake.address);
    });

    socket.on('update admin', function(adminData: AdminData) {
      client.set(redisAdminKey, JSON.stringify(adminData));
      admin.emit('refresh admin', adminData);
      console.log('update admin: ' + JSON.stringify(adminData));
    });
  });
};
