var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'TVR' });
});

/* GET home page. */
router.get('/overlay', function(req, res) {
  res.render('overlay/index', { title: 'Overlay', layout: false });
});

/* GET home page. */
router.get('/overlay/admin', function(req, res) {
  res.render('overlay/admin', { title: 'Overlay Admin' });
});

/* GET home page. */
router.get('/overlay/scores', function(req, res) {
  res.render('overlay/scores', { title: 'Scores' });
});

module.exports = router;
