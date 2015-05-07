var tickerData = {
  announcements: [
    "We will be taking an hour break for lunch at 1:00 PM CDT. We will return promptly at 2:00. Thank you for your understanding!",
    "Finals of all games will be saved for the end of the day."  
  ],
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
  media: [
    {
      name: 'Twitch',
      icon: 'something',
      url: 'twitch.tv/Camtendo'
    },
    {
      name: 'Facebook',
      icon: 'something',
      url: 'facebook.com/thevelvetroomsmash'
    },
    {
      name: 'Youtube',
      icon: 'something',
      url: 'www.youtube.com/user/Camtendo'
    },
    {
      name: 'Twitter',
      icon: 'something',
      url: '@TVRSmash'
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
    },
    {
      key: 'Current Viewers',
      value: '1337'
    }
  ]
};

var ticker = {
  tab1: 'announcements',
  tab2: 'results',
  tab3: 'media',
  tab4: 'info',
};

var mainTimeline = new TimelineMax({ paused: true, repeat: -1 });

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

function selectTab(label) {
  mainTimeline.play(label);
}

function updateTicker() {
  mainTimeline.clear();
  mainTimeline.add(createTabTimeline(ticker.tab1, 'scroll'), ticker.tab1);
  mainTimeline.add(createTabTimeline(ticker.tab2, 'scroll'), ticker.tab2);
  mainTimeline.add(createTabTimeline(ticker.tab3, 'scroll'), ticker.tab3);
  mainTimeline.add(createTabTimeline(ticker.tab4, 'scroll'), ticker.tab4);
}

function createTabTimeline(label, tlType) {
  if (tlType === 'scroll') {
    return animateScrollDisplay(label);
  }
}

function animateScrollDisplay(label) {
  var tl = new TimelineMax();
  var display = document.querySelector('#ticker-display .display.' + label);
  display.innerHTML = '';
  
  var totalWidth = 0;
  var bigWidth = 0;
  var minWidth = document.querySelector('#ticker-display').offsetWidth;

  // Add the tab intro to the timeline
  tl.add(animateTabIn(label));
  
  function addToDisplay() {
    tickerData[label].forEach(function(o) {
      var e = createScrollElement(createScrollText(o, label));
      display.appendChild(e);
      e.style.left = totalWidth + 'px';
      
      var width = e.offsetWidth;
      totalWidth += width;
      bigWidth = width > bigWidth ? width : bigWidth;
    });
  }
  
  // In order to have data constantly scrolling, we may have to duplicate elements
  do {
    addToDisplay();
  } while (display.children.length < 2 || (totalWidth-bigWidth) < minWidth);
  
  // Add the scrolling animations for each element
  var elements = [].slice.call(display.children);
  elements.forEach(function(e, i) {
    var width = e.offsetWidth;
    var speed = 500;
    
    tl.to(display, width/speed, { marginLeft: '-=' + width + 'px', ease: Linear.easeNone })
    for (var j=0; j<elements.length; j++) {
      if (j !== i) {
        var w = elements[i].offsetWidth;
        tl.set(elements[j], { left: '-=' + w + 'px' });
      } 
    }
        
    tl.set(e, { left: (totalWidth-width) + 'px' })
      .set(display, { marginLeft: 0 });
  });
  
  // Add the tab outro to the timeline
  tl.add(animateTabOut(label));
  return tl;
}

function createScrollText(o, label) {  
  if (label === ticker.tab1) {
    return o;
  }
  
  if (label === ticker.tab2) {
    return o.winner + ' ' + o.wScore + '-' + o.lScore + ' ' + o.loser;
  }
  
  if (label === ticker.tab3) {
    return o.name + ': ' + o.url;
  }
  
  if (label === ticker.tab4) {
    return o.key + ': ' + o.value;
  }
}

function createScrollElement(str) {
  var e = document.createElement('div');
  e.innerText = str; 
  e.className = 'text scroll';

  return e;
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
    tl.staggerTo(tabs, .5, { left: '-=' + tabWidth + 'px'}, .1)
    
    // Slide all unused tabs out and show the display
    tabs.shift();
    tl.staggerTo(tabs, .5, { bottom: '-' + tabFullHeight +'px' }, .1)
      .to(display, 1.5, { right: '-1920px' }); 
  } else {
    // Shift the tabs one more time, so the current tab goes to the end
    var currentTab = tabs.shift();
    tabs.push(currentTab);
    
    // Reset the tab positions
    tl.to(display, .5, { right: '1920px' })
      .to(currentTab, .5, { left: '-=100px', opacity: 0 })
      .set(currentTab, { 
        left: '+=' + (100+tabWidth*tabs.length) + 'px', 
        bottom: '-' + tabFullHeight + 'px', 
        opacity: 1
      })
      .staggerTo(tabs, .5, { bottom: '0px' }, .1);
  }
  
  return tl;
}