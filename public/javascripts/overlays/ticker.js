var tickerData = {
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
    },
    {
      winner: 'Majik',
      loser: 'Cue',
      wScore: 3,
      lScore: 2
    },
    {
      winner: 'Bee',
      loser: 'Doodler',
      wScore: 3,
      lScore: 1
    },
    {
      winner: 'Tyser',
      loser: 'Darkrain',
      wScore: 3,
      lScore: 0
    },
    {
      winner: 'Smeesh',
      loser: 'RFrizzle',
      wScore: 3,
      lScore: 1
    }
  ],
  announcement: "We will be taking an hour break for lunch at 1:00 PM CDT. We will return promptly at 2:00. Thank you for your understanding!"
};

var mainTimeline = new TimelineMax({ paused: true, repeat: -1 });

function go() {
  updateResults();
  mainTimeline.resume();
}

function updateResults() {
  var tl = new TimelineMax();
  var resultList = document.getElementById('ticker-display');
  resultList.innerHTML = '';

  var speed = 50;
  tickerData.results.forEach(function(o) {
    var e = createResult(o);
    resultList.appendChild(e);
    var width = e.offsetWidth;

    tl.to(resultList, 
          width/speed, 
          { marginLeft: '-=' + width.toString() + 'px', 
            ease: Linear.easeNone, 
            onComplete: cycleResult, 
            onCompleteParams: [e, resultList] 
          })
      .set(resultList, { marginLeft: 0 });
  });
  
  mainTimeline.add(tl);
}

function createResult(o) {
  var e = document.createElement('div');
  e.innerText = o.winner + ' ' + o.wScore + '-' + o.lScore + ' ' + o.loser;
  e.className = 'tickerResult tickerText';

  return e;
}

function cycleResult(element, parent) {
  parent.appendChild(element);
}

