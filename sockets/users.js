var config = require('../config');
var request = require('request');
var redis = require('redis');
var pmx = require('pmx');

var client = redis.createClient();
var redisKey = 'web-overlay-users';

module.exports = function(io) {
    var userList = [];

    // Load existing challonge data
    client.get(redisKey, function (err, reply) {
        if (err) {
            console.log(err);
        } else if (reply) {
            userList = JSON.parse(reply);
        }
    });

    var usersIO = io.of('/users');

    usersIO.on('connection', function(socket) {
        // Log the new connection
        console.log('users socket connected: ' + socket.handshake.address + ' -> ' + socket.request.headers.referer);
        connectedSockets++;
        socket.emit('refresh users', userList);

        socket.on('disconnect', function() {
            console.log('users socket disconnected: ' + socket.handshake.address);
            connectedSockets--;
            if (connectedSockets <= 0) {
                connectedSockets = 0;
            }
        });

        socket.on('create user', function(newUser) {
            //Generate new id from Datestring
            newUser.id = new Date().valueOf();
            userList.push(newUser);

            client.set(redisKey, JSON.stringify(userList));

            socket.emit('refresh users', userList);
        });

        socket.on('update user', function(updatedUser) {
            //Get current version of user and remove it
            var currentUser = getUserById(updatedUser.id);
            removeUser(currentUser);

            //Push the new version of the user
            userList.push(updatedUser);
            client.set(redisKey, JSON.stringify(userList));

            //Notify clients
            socket.emit('refresh users', userList);
        });

        socket.on('delete user', function(userToDelete) {
            removeUser(userToDelete);
            client.set(redisKey, JSON.stringify(userList));
            socket.emit('refresh users', userList);
        });

        //This should be in all clients of this socket too
        socket.on('refresh users', function(newList) {
            userList = newList;
        });

        function removeUser(user) {
            var removeIndex = userList.map(function(item) {
                return item.id; 
             }).indexOf(user.id);

            removeIndex > -1 && userList.splice(removeIndex, 1);
        }

        function getUserById(id) {
            return userList.filter(function(obj) {
                return obj.id === id;
            })[0];
        }
    });
};
