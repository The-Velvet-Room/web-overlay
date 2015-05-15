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
      lScore: 0,
      wRank: 1,
      lRank: 5
    },
    {
      winner: 'Echo',
      loser: 'MegaRobMan',
      wScore: 3,
      lScore: 1,
      wRank: 2,
      lRank: 6
    },
    {
      winner: 'Tyser',
      loser: 'Darkrain',
      wScore: 3,
      lScore: 0,
      wRank: 3,
      lRank: 4
    }
  ],
  media: [
    {
      name: 'Twitch',
      icon: '',
      color: 'blueviolet',
      text: ['twitch.tv/Camtendo']
    },
    {
      name: 'Facebook',
      icon: '',
      color: 'blue',
      text: ['facebook.com/thevelvetroomsmash']
    },
    {
      name: 'Youtube',
      icon: '',
      color: 'red',
      text: ['www.youtube.com/user/Camtendo']
    },
    {
      name: 'Twitter',
      icon: '',
      color: 'dodgerblue',
      text: ['@TVRSmash', '@nswartz1990', '@Camtendo', '@daguenther', '@EchoRKO']
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
  speed: 150,
  duration: '+=2'
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
  mainTimeline.play(label + 'In');
}

function updateTicker() {
  mainTimeline.progress(1);
  mainTimeline.clear();
  createTabTimeline(ticker.tab1, 'scroll');
  createTabTimeline(ticker.tab2, 'score');
  createTabTimeline(ticker.tab3, 'badge');
  createTabTimeline(ticker.tab4, 'scroll');
}

function createTabTimeline(label, tlType) {
  mainTimeline.add(animateTabIn(label), label + 'In');  
  if (tlType === 'scroll') {
    mainTimeline.add(animateScrollDisplay(label), label);
  } else if (tlType === 'score') {
    mainTimeline.add(animateScoreDisplay(label), label);
  } else if (tlType === 'badge') {
    mainTimeline.add(animateBadgeDisplay(label), label);
  }
  
  mainTimeline.add(animateTabOut(label), label + 'Out');
}

function animateBadgeDisplay(label) {
  var tl = new TimelineMax();
  var display = document.querySelector('#ticker-display .display.' + label);
  display.innerHTML = '';
    
  tickerData[label].forEach(function(o) {
    var badgeCont = document.createElement('div');
    display.appendChild(badgeCont);
    badgeCont.className = 'badgeContainer';  
    
    var e = createBadgeElement(o);
    badgeCont.appendChild(e);
    e.style.left = -e.scrollWidth + 'px';
    
    o.text.forEach(function(str) {
      var msg = document.createElement('div');
      badgeCont.appendChild(msg);
      msg.className = 'text badgeMsg';
      msg.innerText = str;
      msg.style.top = e.clientHeight + 'px';
      msg.style.left = e.clientWidth + 'px';
    });
  });
     
  // Add the scrolling animations for each element
  var badgeConts = [].slice.call(display.children);
  badgeConts.forEach(function(bc) {   
    // Show the badge
    var b = getChildrenByClass(bc, 'badge')[0];
    tl.to(b, b.offsetWidth/ticker.speed, {left: '0px'});
    
    var height = b.clientHeight;
    var msgs = getChildrenByClass(bc, 'badgeMsg');
    msgs.forEach(function(m, i, a) {
      var prev = a[i-1] ? a[i-1] : null;
      if (prev) {
        tl.to([prev, m], height/ticker.speed, {top: '-=' + height + 'px'}, ticker.duration);
      } else {
        tl.to(m, height/ticker.speed, {top: '-=' + height + 'px'});
      }
      
      if (i === a.length-1)
        tl.to(m, height/ticker.speed, {top: '-=' + height + 'px'}, ticker.duration);
    });
    
    tl.to(b, b.clientWidth/ticker.speed, {left: -b.clientWidth + 'px'});
  });

  return tl;
}

function createBadgeElement(o) {
  var e = document.createElement('div');
  e.className = 'text badge';
  e.style.backgroundColor = o.color;
  
  if (o.icon) {
    var icon = document.createElement('img');
    e.appendChild(icon);
    icon.src = o.icon;  
  }
  
  var name = document.createElement('div');
  e.appendChild(name);  
  name.innerText = o.name;
  
  return e;
}

function animateScoreDisplay(label) {
  var tl = new TimelineMax();
  var display = document.querySelector('#ticker-display .display.' + label);
  display.innerHTML = '';
  
  // Add a vertical scrolling section to the display
  var vertical = document.createElement('div');
  display.appendChild(vertical);
  vertical.className = 'vertical';
  
  var totalHeight = 0;
  tickerData[label].forEach(function(o) {
    var e = createScoreElement(createScoreText(o, label));
    vertical.appendChild(e);
    e.style.top = totalHeight + 'px';
    
    var height = e.clientHeight;
    totalHeight += height;
  });
    
  // Add the scrolling animations for each element
  var elements = [].slice.call(vertical.children);
  elements.forEach(function(e, i) {
    var height = e.clientHeight;    
    tl.to(vertical, height/ticker.speed, {marginTop: '-=' + height + 'px'}, ticker.duration);
  });

  return tl;
}

function createScoreElement(str) {
  var e = document.createElement('div');
  e.innerText = str; 
  e.className = 'text score';

  return e;
}

function createScoreText(o, label) {  
  if (label === ticker.tab1) {
    return o;
  }
  
  if (label === ticker.tab2) {
    return o.wRank + ' ' + o.winner + ' ' + o.wScore + '    ' 
    + o.lRank + ' ' + o.loser + ' ' + o.lScore;
  }
  
  if (label === ticker.tab3) {
    return o.name + ': ' + o.url;
  }
  
  if (label === ticker.tab4) {
    return o.key + ': ' + o.value;
  }
}

function animateScrollDisplay(label) {
  var tl = new TimelineMax();
  var display = document.querySelector('#ticker-display .display.' + label);
  display.innerHTML = '';
  
  var totalWidth = 0;
  var bigWidth = 0;
  var minWidth = document.querySelector('#ticker-display').offsetWidth;

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
    
    tl.to(display, width/ticker.speed, {marginLeft: '-=' + width + 'px', ease: Linear.easeNone});
    for (var j=0; j<elements.length; j++) {
      if (j !== i) {
        var w = elements[i].offsetWidth;
        tl.set(elements[j], {left: '-=' + w + 'px'});
      } 
    }
        
    tl.set(e, {left: (totalWidth-width) + 'px'})
      .set(display, {marginLeft: 0});
  });

  return tl;
}

function createScrollElement(str) {
  var e = document.createElement('div');
  e.innerText = str; 
  e.className = 'text scroll';

  return e;
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
    tl.staggerTo(tabs, .5, {left: '-=' + tabWidth + 'px'}, .1);
    
    // Slide all unused tabs out and show the display
    tabs.shift();
    tl.staggerTo(tabs, .5, {bottom: '-' + tabFullHeight +'px'}, .1)
      .to(display, 1.5, { right: '-1920px' }); 
  } else {
    // Shift the tabs one more time, so the current tab goes to the end
    var currentTab = tabs.shift();
    tabs.push(currentTab);
    
    // Reset the tab positions
    tl.to(display, 1.5, {right: '1920px'})
      .to(currentTab, .5, {left: '-=100px', opacity: 0})
      .set(currentTab, { 
        left: '+=' + (100+tabWidth*tabs.length) + 'px', 
        bottom: '-' + tabFullHeight + 'px', 
        opacity: 1
      })
      .staggerTo(tabs, .5, {bottom: '0px'}, .1);
  }
  
  return tl;
}

function getChildrenByClass(p, str) {
  var arr = [];
  for (var i=0; i<p.children.length; i++) {
    var e = p.children[i];
    var classes = e.className ? e.className.split(' ') : [];
    for(var j=0; j<classes.length; j++) {
      if (classes[j] === str) {
        arr.push(e);
        break;
      }
    }
  }
  
  return arr;
}
