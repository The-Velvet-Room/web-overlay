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
router.get('/overlays/admin', function(req, res) {
  res.render('overlays/admin', { title: 'Overlay Admin' });
});

/* GET home page. */
router.get('/overlays/scores', function(req, res) {
  res.render('overlays/scores', { title: 'Scores' });
});

/* GET home page. */
router.get('/overlays/grimetime/game4by3', function(req, res) {
  res.render('overlays/grimetime/game4by3', { title: 'Overlay', layout: false });
});

/* GET commentators. */
router.get('/overlays/commentators', function(req, res) {
  res.render('overlays/commentators', { title: 'Overlay', layout: false });
});

module.exports = router;
