import { User } from '../client/models/User';

var config = require('../config');
var request = require('request');
var redis = require('redis');
var pmx = require('pmx');

var client = redis.createClient();
var redisKey = 'web-overlay-users';

export = function(io: SocketIO.Server) {
  var connectedSockets = 0;
  var userHash: Object = {};

  // Load existing challonge data
  client.get(redisKey, function (err, reply) {
    if (err) {
        console.log(err);
    } else if (reply) {
        userHash = JSON.parse(reply);
    }
  });

  var userIO = io.of('/user');

  userIO.on('connection', function(socket) {
    // Log the new connection
    console.log('user socket connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);
    connectedSockets++;
    socket.emit('refresh users', userHash);

    socket.on('disconnect', function() {
      console.log('users socket disconnected: ' + socket.handshake.address);
      connectedSockets--;
      if (connectedSockets <= 0) {
          connectedSockets = 0;
      }
    });

    socket.on('create user', function(newUser: User) {
      //Generate new id from Datestring
      newUser.id = new Date().valueOf().toString();
      userHash[newUser.id] = newUser;

      client.set(redisKey, JSON.stringify(userHash));

      socket.emit('refresh users', userHash);
    });

    socket.on('update user', (user: User) => {
      var existingUser = userHash[user.id];
      if (!existingUser) {
        user.id = new Date().valueOf().toString();
      }

      userHash[user.id] = user;
      client.set(redisKey, JSON.stringify(userHash));
      socket.emit('refresh users', userHash);
    });

    socket.on('delete user', function(userToDelete: User) {
      removeUser(userToDelete);
      client.set(redisKey, JSON.stringify(userHash));
      socket.emit('refresh users', userHash);
    });

    //This should be in all clients of this socket too
    socket.on('refresh users', function(newHash: Object) {
      userHash = newHash;
    });

    //This should be in all clients of this socket too
    socket.on('reset users', function () {
      userHash = {};
      client.set(redisKey, JSON.stringify(userHash));
      socket.emit('refresh users', userHash);
    });

    function removeUser(user: User) {
      if (userHash.hasOwnProperty(user.id)) {
        delete userHash[user.id];
      }
    }

    function getUserById(id: string) {
      return userHash[id];
    }
  });
};
