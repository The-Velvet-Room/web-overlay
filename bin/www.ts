var pmx = require('pmx').init();
var debug = require('debug')('web-overlay');
var app = require('../app');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
require('../sockets')(io);

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
