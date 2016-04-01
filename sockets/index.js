module.exports = function (io) {

  require('./overlay')(io);
  require('./pardonthesmash')(io);
  require('./twitch')(io);
  require('./bracket')(io);
  require('./arcade')(io);
  require('./users')(io);
};
