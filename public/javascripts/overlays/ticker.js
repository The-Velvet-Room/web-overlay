var TweenMax = require('/../../gsap');

var data = {
  game: 'Melee',
  results: [
    {
      winner: 'Noah',
      loser: 'JBM',
      wScore: 3,
      lScore: 0
    },
    {
      winner: 'Echo',
      loser: 'MegaRobMan',
      wScore: 3,
      lScore: 1
    }
  ]
};

var ticker = {};

function updateResults() {
  var tl = new TimelineMax(paused: true);
  var resultList = document.getElementById('resultList');
  resultList.innerHTML = '';

  var speed = 50;
  data.results.forEach(function(o) {
    var e = createResult(o);
    var width = e.offsetWidth;
    resultList.appendChild(e);

    tl.to(resultList, 
      width/speed, 
      { marginLeft: -width, ease: Linear.easeNone }, 
      onComplete: cycleResult, 
      onCompleteParams: [e, resultList]);
  });
}

function cycleResult(element, parent) {
  parent.appendChild(element);
}

function playResults() {

}

function createScoreTimeline(el) {

}

function createResult(o) {
  var e = document.createElement('div');
  e.innerText = o.winner + ' ' + o.wScore + '-' + o.lScore + ' ' + o.loser;
  e.className = 'tickerScore';

  return e;
}