var tickerData = {
  announcements: [
    "We will be taking an hour break for lunch at 1:00 PM CDT. We will return promptly at 2:00. Thank you for your understanding!",
    "Finals of all games will be saved for the end of the day."  
  ],
  game: 'Melee',
  results: [
//    {
//      winner: 'Noah',
//      loser: 'JBM',
//      wScore: 3,
//      lScore: 0
//    },
//    {
//      winner: 'Echo',
//      loser: 'MegaRobMan',
//      wScore: 3,
//      lScore: 1
//    },
    {
      winner: 'Tyser',
      loser: 'Darkrain',
      wScore: 3,
      lScore: 0
    }
  ],
  media: [
    {
      icon: '',
      url: ''
    }
  ],
  info: [
    {
      key: 'Max Viewers',
      value: 123
    },
    {
      key: 'Latest Follower',
      value: 'mike_hawk'
    }
  ]
};

var mainTimeline = new TimelineMax({ paused: true });

function go() {
  updateResults();
  mainTimeline.resume();
}

//function updateLabel(label) {
//  switch(label) {
//    case 'announcement'
//  }
//}

function updateResults() {
  var tl = new TimelineMax();
  var resultList = document.querySelector('#ticker-display .announcements');
  clearLabel("announcements");
  resultList.innerHTML = '';
  TweenMax.set(resultList, { marginLeft: 0 });

  var speed = 50;
  tl.add(animateTabIn('announcements'));
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
  
  tl.add(animateTabOut('announcements'));
  mainTimeline.add(tl, 'announcements');
}

function createResult(o) {
  var e = document.createElement('div');
  e.innerText = o.winner + ' ' + o.wScore + '-' + o.lScore + ' ' + o.loser;
  e.className = 'text';

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

function animateTabIn(label) {
  return animateTab('in', label);
}

function animateTabOut(label) {
  return animateTab('out', label);
}

function animateTab(state, label) {
  var tl = new TimelineMax();
  var tabs = [].slice.call(document.getElementById('ticker-tabs').children);
  var tabWidth = tabs[0].clientWidth;
  var tabFullHeight = tabs[0].offsetHeight;
  var i = tabs.map(function (e) { return e.classList.contains(label); }).indexOf(true);
  var display = document.querySelector('#ticker-display .display.' + label);
  
  // Reorder the array to match the current state of the ticker tabs
  for (var j=0; j<i; j++) {
    var temp = tabs.shift();
    tabs.push(temp);
  }
  
  if (state === 'in') {
    // Slide all tabs to the left
    tl.staggerTo(tabs, .5, { left: '-=' + tabWidth.toString() + 'px'}, .1)
    
    // Slide all unused tabs out and show the display
    tabs.shift();
    tl.staggerTo(tabs, .5, { bottom: '-' + tabFullHeight.toString() +'px' }, .1)
      .to(display, 1.5, { right: '-1920px' }); 
  } else {
    // Shift the tabs one more time, so the current tab goes to the end
    var currentTab = tabs.shift();
    tabs.push(currentTab);
    
    // Reset the tab positions
    tl.to(display, .5, { right: '1920px' })
      .to(currentTab, .5, { left: '-=100px', opacity: 0 })
      .set(currentTab, { 
        left: '+=' + (100+tabWidth*tabs.length).toString() + 'px', 
        bottom: '-' + tabFullHeight.toString() + 'px', 
        opacity: 1
      })
      .staggerTo(tabs, .5, { bottom: '0px' }, .1);
  }
  
  return tl;
}