module.exports = function (io) {

  require('./overlay')(io);
  require('./pardonthesmash')(io);
  require('./twitch')(io);
  require('./challonge')(io);
  require('./arcade')(io);
};
