var characterLeft = null;
var characterRight = null;
var portLeft = null;
var portRight = null;
var stateLeft = null;
var stateRight = null;

//array of character names
var characters =['bowser','bowser-jr','captain-falcon','charizard','dark-pit','king-dedede',
'diddy-kong','donkey-kong','dr-mario','duck-hunt-dog','falco','fox','ganondorf',
'mr-game-and-watch','greninja','ice-climbers','ike','ivysaur','jigglypuff','kirby','link',
'little-mac','lucario', 'lucas','lucina','luigi','mario','marth','megaman','metaknight',
'mewtwo','mii','ness','olimar','pacman','palutena','peach','pichu','pikachu','pit','rob',
'robin','rosalina','roy','samus','sheik','shulk', 'snake','squirtle','sonic','toon-link',
'villager','wario','wii-fit-trainer','wolf','yoshi','young-link','zelda','zero-suit-samus'];

var portColors = ['red','blue','yellow','green'];

var usStates = ['ALABAMA','ALASKA','ARIZONA','ARKANSAS','CALIFORNIA','COLORADO','CONNECTICUT',
    'DELAWARE','FLORIDA','GEORGIA','HAWAII','IDAHO','ILLINOIS','INDIANA',
    'IOWA','KANSAS','KENTUCKY','LOUISIANA','MAINE','MARYLAND','MASSACHUSETTS','MICHIGAN',
    'MINNESOTA','MISSISSIPPI','MISSOURI','MONTANA','NEBRASKA','NEVADA','NEW HAMPSHIRE',
    'NEW JERSEY','NEW MEXICO','NEW YORK','NORTH CAROLINA','NORTH DAKOTA','OHIO','OKLAHOMA',
    'OREGON','PENNSYLVANIA','RHODE ISLAND','SOUTH CAROLINA','SOUTH DAKOTA','TENNESSEE',
    'TEXAS','UTAH','VERMONT','VIRGINIA','WASHINGTON','WEST VIRGINIA','WISCONSIN','WYOMING', 'DC'];

var usStatesKeys = ['B','A','D','C','E','F','G','H','I','J','K','M','N','O','L','P','Q','R','U','T',
    'S','V','W','Y','X','Z','c','g','d','e','f','h','a','b','i','j','k','l','m','n','o','p','q','r',
    't','s','u','w','v','x','y'];

//Pass in either 'Left' or 'Right'
function createCharacterList(direction) {
    var selectList = document.createElement('select');
    selectList.id = 'charList'+direction;
    document.getElementById('charList'+direction+'Placeholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    characters.forEach(function(character){
        var option = document.createElement('option');
        option.text = character;
        option.value = character;
        selectList.appendChild(option);
    });

    $('#charList'+direction).change(function(){
        var selectedOption = $('#charList'+direction+' option:selected');

        if(direction == 'Left') {
            characterLeft = selectedOption.val();
        }
        else {
            characterRight = selectedOption.val();
        }
        sendUpdate();
    });
}

createCharacterList('Left');
createCharacterList('Right');

//Pass in either 'Left' or 'Right'
function createPortList(direction) {
    var selectList = document.createElement('select');
    selectList.id = 'port'+direction;
    document.getElementById('port'+direction+'Placeholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    for (var i=0; i < portColors.length; i++) {
        var option = document.createElement('option');
        option.text = i+1;
        option.value = portColors[i];
        selectList.appendChild(option);
    };

    $('#port'+direction).change(function(){
        var selectedOption = $('#port'+direction+' option:selected');

        if(direction == 'Left') {
            portLeft = selectedOption.val();
        }
        else {
            portRight = selectedOption.val();
        }
        sendUpdate();
    });
}

createPortList('Left');
createPortList('Right');

//Pass in either 'Left' or 'Right'
function createStateList(direction) {
    var selectList = document.createElement('select');
    selectList.id = 'state'+direction;
    document.getElementById('state'+direction+'Placeholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    for (var i=0; i < usStates.length; i++) {
        var option = document.createElement('option');
        option.text = usStates[i];
        option.value = usStatesKeys[i];
        selectList.appendChild(option);
    };

    $('#state'+direction).change(function(){
        var selectedOption = $('#state'+direction+' option:selected');

        if(direction == 'Left') {
            stateLeft = selectedOption.val();
        }
        else {
            stateRight = selectedOption.val();
        }
        sendUpdate();
    });
}

createStateList('Left');
createStateList('Right');

//Populate existing information if it exists
function populateDropdowns(direction) {
    //Port
    if(this['port'+direction]) {
        var portList = document.getElementById('port'+direction);       
        for (var i = 0; i < portList.options.length; i++) {
            if(portList.options[i].value == this['port'+direction]) {
                portList.options[i].selected = true;
                break;
            }        
        }
    }
    
    //Character
    if(this['character'+direction]) {
        var characterList = document.getElementById('charList'+direction);       
        for (var i = 0; i < characterList.options.length; i++) {
            if(characterList.options[i].value == this['character'+direction]) {
                characterList.options[i].selected = true;
                break;
            }        
        }
    }
    
    //State
    if(this['state'+direction] && this['state'] != ' ') {
        var stateList = document.getElementById('state'+direction);       
        for (var i = 0; i < stateList.options.length; i++) {
            if(stateList.options[i].value == this['state'+direction]) {
                stateList.options[i].selected = true;
                break;
            }        
        }
    }
}

var socket = io('/overlay');

socket.on('update overlay', function(data) {
    document.getElementById('lplayer').value = data.lplayer || '';
    document.getElementById('rplayer').value = data.rplayer || '';
    document.getElementById('title').value = data.title || '';
    document.getElementById('tourneyInfo').value = data.tourneyInfo || '';
    document.getElementById('commentators').value = data.commentators || '';
    document.getElementById('twitter').value = data.twitter || '';
    document.getElementById('lscore').value = data.lscore || 0;
    document.getElementById('rscore').value = data.rscore || 0;
    characterLeft = data.lCharacter || null;
    characterRight = data.rCharacter || null;
    portLeft = data.portLeft || null;
    portRight = data.portRight || null;
    stateLeft = data.stateLeft || null;
    stateRight = data.stateRight || null;

    if(data.readyStatus) {
        document.getElementById('ready-radio-false').checked = false;
        document.getElementById('ready-radio-true').checked = true;
    }
    else {
        document.getElementById('ready-radio-false').checked = true;
        document.getElementById('ready-radio-true').checked = false;
    }
    
    populateDropdowns('Left');
    populateDropdowns('Right');
});

var twitchSocket = io('/twitch');
var twitchGame = null;
var twitchStatus = null;
var twitchUsername = null;
var currentTwitchUsername = null;

twitchSocket.on('send twitch data', function(data) {
    twitchUsername = data.twitchUsername;
    document.getElementById('twitchUsername').value = data.twitchUsername || '';
    twitchStatus = data.twitchStatus;
    document.getElementById('twitchStatus').value = data.twitchStatus || '';
    twitchGame = data.twitchGame;
    document.getElementById('twitchGame').value = data.twitchGame || '';
    document.getElementById('twitchFollowers').value = data.twitchFollowers || 0;
    document.getElementById('twitchLastFollower').value = data.twitchLastFollower || '';
    document.getElementById('twitchViewers').value = data.twitchViewers || 'offline';
    document.getElementById('twitchPeakViewers').value = data.twitchPeakViewers || 'offline';

    if(currentTwitchUsername && data.twitchUsername != currentTwitchUsername) {
            var chatFrame = document.getElementById('chat-frame');
            document.getElementById('twitch-chat-placeholder').removeChild(chatFrame);
            currentTwitchUsername = null;
            console.log('Username changed');
        }

        if(data.twitchUsername && !currentTwitchUsername) {
            currentTwitchUsername = data.twitchUsername;
            var ifrm = document.createElement('iframe');
            ifrm.id = 'chat-frame';
            ifrm.setAttribute('src', 'http://www.twitch.tv/'+data.twitchUsername+'/chat?popout=');
            ifrm.style.width = '600px';
            ifrm.style.height = '400px';
            document.getElementById('twitch-chat-placeholder').appendChild(ifrm);
      }

    if (data.twitchUsername) {
        animateTwitchData(true);
    }
});

twitchSocket.on('update twitch followers', function(data) {
    document.getElementById('twitchFollowers').value = data.followers || 0;
    document.getElementById('twitchLastFollower').value = data.lastFollower || '';

    animateTwitchData(true);
});

twitchSocket.on('update twitch viewers', function(data) {
    document.getElementById('twitchViewers').value = data.viewers || 'offline';
    document.getElementById('twitchPeakViewers').value = data.peakViewers || 'offline';

    animateTwitchData(true);
});

twitchSocket.on('update twitch channel info', function(data) {
    twitchStatus = data.status;
    document.getElementById('twitchStatus').value = data.status || '';
    twitchGame = data.game;
    document.getElementById('twitchGame').value = data.game || '';
    twitchUsername = data.username;
    document.getElementById('twitchUsername').value = data.username || '';

    animateTwitchData(true);
});

function animateTwitchData(shouldShow) {
    if (shouldShow) {
        $('.requires-twitch').show(200);
    } else {
        $('.requires-twitch').hide(200);
    }
}

var challongeSocket = io('/challonge');
var challongeMatches = [];
var challongeUrl;

challongeSocket.on('update challonge', function(data){
    if (data.challongeUrl && (data.challongeUrl !== challongeUrl || document.getElementById('challongeBracket') === null)) {
        document.getElementById('challongeUrl').value = data.challongeUrl || '';
        document.getElementById('challongeApiHash').value = data.challongeApiHash || '';
        challongeUrl = data.challongeUrl;
        embedChallongeBracket(challongeUrl);
    }

    if (data.upcomingMatches) {
        challongeMatches = data.upcomingMatches;
        createMatchList(data.players);
    }

    if (!data.challongeUrl) {
        document.getElementById('challongeUrl').value = data.challongeUrl || '';
        document.getElementById('challongeApiHash').value = data.challongeApiHash || '';
        challongeUrl = '';
        $('#challongeEmbedPlaceholder').empty();
        $('#challongeMatchListPlaceholder').empty();
    }
});

function plusOneLeft() {
    var numVal = parseInt(document.getElementById('lscore').value);
    document.getElementById('lscore').value = numVal + 1;
    sendUpdate();
}

function minusOneLeft() {
    var numVal = parseInt(document.getElementById('lscore').value);
    document.getElementById('lscore').value = numVal - 1;
    sendUpdate();
}

function plusOneRight() {
    var numVal = parseInt(document.getElementById('rscore').value);
    document.getElementById('rscore').value = numVal + 1;
    sendUpdate();
}

function minusOneRight() {
    var numVal = parseInt(document.getElementById('rscore').value);
    document.getElementById('rscore').value = numVal - 1;
    sendUpdate();
}

function swapNames() {
    var tempPlayer = document.getElementById('lplayer').value;
    document.getElementById('lplayer').value = document.getElementById('rplayer').value;
    document.getElementById('rplayer').value = tempPlayer;
    sendUpdate();
}

function swapAll() {
    var tempPlayer = document.getElementById('lplayer').value;
    document.getElementById('lplayer').value = document.getElementById('rplayer').value;
    document.getElementById('rplayer').value = tempPlayer;
    
    var tempScore = document.getElementById('lscore').value;
    document.getElementById('lscore').value = document.getElementById('rscore').value;
    document.getElementById('rscore').value = tempScore;
    
    var tempCharacter = window.characterLeft;
    window.characterLeft = window.characterRight;
    window.characterLeft = tempCharacter;
    
    var tempPort = window.portLeft;
    window.portLeft = window.portRight;
    window.portRight = tempPort;
    
    var tempState = window.stateLeft;
    window.stateLeft = window.stateRight;
    window.stateRight = tempState;
    
    sendUpdate('Information swapped.');
}

function zeroScores() {
    document.getElementById('lscore').value = 0;
    document.getElementById('rscore').value = 0;

    //There's high probability that we are still typing information
    //when scores are zeroed
    document.getElementById('ready-radio-false').checked = true;
    document.getElementById('ready-radio-true').checked = false;
    sendUpdate();
}

function sendUpdate(infoMessage) {
    var data = {
        'lplayer': document.getElementById('lplayer').value,
        'rplayer': document.getElementById('rplayer').value,
        'title': document.getElementById('title').value,
        'tourneyInfo': document.getElementById('tourneyInfo').value,
        'lscore': document.getElementById('lscore').value,
        'rscore': document.getElementById('rscore').value,
        'commentators': document.getElementById('commentators').value,
        'twitter': document.getElementById('twitter').value,
        'lCharacter': window.characterLeft || null,
        'rCharacter': window.characterRight || null,
        'readyStatus': document.getElementById('ready-radio-true').checked,
        'portLeft': window.portLeft,
        'portRight': window.portRight,
        'stateLeft': window.stateLeft,
        'stateRight': window.stateRight
    };
    socket.emit('update overlay', data);
    
    if(infoMessage) {
        toastNotify(infoMessage);
    }
    else {
      toastNotify('Overlay data updated.');
    }   
}

function changeLayout() {
    var layout = document.getElementsByClassName('selectedLayout')[0];
    var data = {
        'layout': layout ? layout.value : 'empty-layout',
        'background': document.getElementById('layout-background').value
    };

    obs.setCurrentScene(data.layout);
    socket.emit('change layout', data);
    toastNotify('Layout updated.');
}

function obsConnect() {
    var address = document.getElementById('obs-address').value;
    var password = document.getElementById('obs-password').value;
    remoteConnect(address, password);
}

// 0: Reset, 1: Update, 2: Play, -1: Init
function playMatchIntro(flag) {
    var data = {
        'flag': flag,
        'lplayer': document.getElementById('lplayer').value,
        'rplayer': document.getElementById('rplayer').value,
        'tourneyInfo': document.getElementById('tourneyInfo').value,
        'lCharacter': window.characterLeft || null,
        'rCharacter': window.characterRight || null
    };

    socket.emit('play intro', data);
    
    // Set the same button to play the next step of the intro.
    var btn = $('#play-intro-btn');
    if (flag === 0) {
        btn.text('Update Intro');
        btn.css('background-color', 'yellow');
        toastNotify('Transition area reset.');

        btn.one('click', function() { 
            playMatchIntro(1);
        }); 
    } else if (flag === 1) {
        btn.attr('disabled', true);
        setTimeout(function () {
            btn.attr('disabled', false);
            btn.text('Play Intro');
            btn.css('background-color', 'green');
            toastNotify('Match intro data updated.');
        }, 2000); 

        btn.one('click', function() { 
            playMatchIntro(2);       
        });
    } else {
        toastNotify('Playing character intro.');
        btn.attr('disabled', true);
        setTimeout(function () {
            btn.attr('disabled', false);
            btn.text('Reset Intro');
            btn.css('background-color', 'red');
            toastNotify('Character intro complete.');
        }, 4000);

        btn.one('click', function() {      
            playMatchIntro(0);
        });
    }  
}

function sendTwitchUpdate() {
    var user = document.getElementById('twitchUsername').value;
    if (twitchUsername !== user) {
        twitchSocket.emit('update twitch user', user);
    } else {
        var data = {
            'status': document.getElementById('twitchStatus').value,
            'game': document.getElementById('twitchGame').value
        };
        twitchSocket.emit('update twitch channel info', data);
    }

    if(currentTwitchUsername && user != currentTwitchUsername) {
        var chatFrame = document.getElementById('chat-frame');
        document.getElementById('twitch-chat-placeholder').removeChild(chatFrame);
        currentTwitchUsername = null;
        console.log('Username changed');
    }

    if(user && !currentTwitchUsername) {
        currentTwitchUsername = user;
        var ifrm = document.createElement('iframe');
        ifrm.id = 'chat-frame';
        ifrm.setAttribute('src', 'http://www.twitch.tv/'+user+'/chat?popout=');
        ifrm.style.width = '800px';
        ifrm.style.height = '400px';
        document.getElementById('twitch-chat-placeholder').appendChild(ifrm);
      }

    toastNotify();
}

function sendChallongeUpdate() {
    var url = document.getElementById('challongeUrl').value;
    var data = {
        'challongeUrl': document.getElementById('challongeUrl').value,
        'challongeApiHash': document.getElementById('challongeApiHash').value
    };
    challongeSocket.emit('update challonge', data);
    toastNotify();
}

function createMatchList(players) {
    var oldVal = null;
    var matchList = $('#challongeMatchList');
    if (matchList) {
        oldVal = matchList.val();
        matchList.remove();
    }

    var selectList = document.createElement('select');
    selectList.id = 'challongeMatchList';
    document.getElementById('challongeMatchListPlaceholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select a match to display';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    challongeMatches.forEach(function(match){
        var option = document.createElement('option');
        var playerOne = players[match.match.player1_id];
        var playerTwo = players[match.match.player2_id];
        option.text = match.match.identifier + ': ' + playerOne + ' vs. ' + playerTwo;
        option.value = match.match.identifier;
        if (oldVal && option.value === oldVal) {
            option.selected = true;
        }
        selectList.appendChild(option);
    });

    $('#challongeMatchList').change(function(){
        var selectedOption = $('#challongeMatchList option:selected');
        var identifier = selectedOption.val();
        if (selectedOption.val()) {
            console.log('Updating match...');
            var match = getMatchForIdentifier(identifier);
            var playerOne = players[match.match.player1_id];
            var playerTwo = players[match.match.player2_id];
            document.getElementById('lplayer').value = playerOne;
            document.getElementById('rplayer').value = playerTwo;
            sendUpdate();
        }
    });
}

function getMatchForIdentifier(identifier) {
    //Sublime Text autocompleted a backwards loop because they are fast
    for (var i = challongeMatches.length - 1; i >= 0; i--) {
        if (challongeMatches[i].match.identifier === identifier)
            return challongeMatches[i];
    }

    return null;
}

function toastNotify(toast) {
    // TODO: figure out how to make this an acknowledgment callback
    //var info = $('#info');
    //info.show();
    //info.fadeOut(1200);

    toastr.success(toast != null ? toast : 'Overlay updated!');
}

function embedChallongeBracket(url) {
    $('#challongeEmbedPlaceholder').empty();
    var embedded = document.createElement('iframe');
    embedded.id = 'challongeBracket';
    embedded.src = url + '/module';
    embedded.width = '100%';
    embedded.height = '500';
    embedded.frameboarder = '0';
    embedded.scrolling = 'auto';
    document.getElementById('challongeEmbedPlaceholder').appendChild(embedded);
}

function toggleNightMode() {
    var body = document.body;
    if (body.style.background === 'black') {
        body.style.color = 'black';
        body.style.background = 'white';
        return;
    }

    body.style.color = 'white';
    body.style.background = 'black';
}

$(function() {
    $('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');

        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).siblings().slideUp(200);
        $('.tabs ' + currentAttrValue).delay(200).slideDown(200);

        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
    $('#twitch-reset').click(function() {
        twitchSocket.emit('reset peak viewers');
    });
    $('#twitch-log-out').click(function() {
        twitchSocket.emit('log out');
    });

    $('#twitch-process-followers').click(function() {
        console.log('Follower processing requested...');
        twitchSocket.emit('process followers');
    });

    $('#challonge-clear-bracket').click(function() {
        challongeSocket.emit('clear bracket');
    });

    $("#flash-ready-button").click(function() {
        socket.emit('flash screen');
    });

    $("#play-intro-btn").one("click", function() {  
        playMatchIntro(0);
    });

    $(".layoutButton").click(function () {
        $(".layoutButton").removeClass('selectedLayout');
        $(this).addClass('selectedLayout');
        changeLayout();
    });
});
