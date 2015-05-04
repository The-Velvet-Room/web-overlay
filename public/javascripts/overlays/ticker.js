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
      winner: 'Tyser',
      loser: 'Darkrain',
      wScore: 3,
      lScore: 0
    }
  ],
  announcement: "We will be taking an hour break for lunch at 1:00 PM CDT. We will return promptly at 2:00. Thank you for your understanding!"
};

var mainTimeline = new TimelineMax({ paused: true });

function go() {
  updateResults();
  animateIn('results');
  mainTimeline.resume();
}

//function updateLabel(label) {
//  switch(label) {
//    case 'announcement'
//  }
//}

function updateResults() {
  var tl = new TimelineMax();
  var resultList = document.getElementById('ticker-display');
  clearLabel("results");
  resultList.innerHTML = '';
  TweenMax.set(resultList, { marginLeft: 0 });

  var speed = 50;
  tl.add(animateIn('results'));
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
  
  tl.add(animateIn('results').reverse());
  mainTimeline.add(tl, 'results');
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

function clearLabel(label, tl) {
  if (!tl)
    tl = mainTimeline;
    
  var time = tl.getLabelTime(label);
  var tls = tl.getChildren(false, false, true);
  tls.forEach(function(t) {
    if (t.startTime() == time) {
      t.kill();
      tl.remove(t);
    }    
  });
}

function animateIn(label) {
  var tabs = [].slice.call(document.getElementById('tabs').children);
  var tl = new TimelineMax();
  
  // Store a reference to the current tab
  var i = tabs.map(function (e) { return e.id; }).indexOf(label);
  var current = tabs.splice(i, 1);
  
  // Animate out all the unused tabs then move the current tab
  tl.staggerTo(tabs, 1, { top: '50px', height: '0px', display: 'none'}, .3)
    .to(current, 1, { left: '100px', borderWidth: '0px' })
    .to('#ticker-display', 1.5, { right: '-1920px' }); 
  
  return tl;
}

function animateOut() {
  
}

