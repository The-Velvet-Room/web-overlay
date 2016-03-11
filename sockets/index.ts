import arcade = require('./arcade');
import overlay = require('./overlay');
import pardonthesmash = require('./pardonthesmash');
import twitch = require('./twitch');
import challonge = require('./challonge');
import user = require('./user');
import admin = require('./admin');

export = function(io: SocketIO.Server) {
    arcade(io);
    overlay(io);
    pardonthesmash(io);
    twitch(io);
    challonge(io);
    user(io);
    admin(io);
};
