var dataInitialized = false;
var characterLeft = null;
var characterRight = null;
var portLeft = null;
var portRight = null;
var stateLeft = null;
var stateRight = null;
var userList = null;

//Pass in either 'Left' or 'Right'
function createCharacterList(direction) {
    var selectList = document.createElement('select');
    selectList.id = 'charList'+direction;
    document.getElementById('charList'+direction+'Placeholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    characters.forEach(function(character) {
        var option = document.createElement('option');
        option.text = character;
        option.value = character;
        selectList.appendChild(option);
    });
    
    for (var i = 0; i < selectList.options.length; i++) {
        if(this['character'+direction]) {
            if(selectList.options[i].value == this['character'+direction]) {
                selectList.options[i].selected = true;
                break;      
            }
        }   
    }

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
        
        if(this['port'+direction]) {
            if(option.value == this['port'+direction]) {
                //i+1 to account for default option
                selectList.options[i+1].selected = true;    
            }
        }
    };

    $('#port'+direction).change(function(){
        var selectedOption = $('#port'+direction+' option:selected');
        var value =  selectedOption.val() == 'null' ? null : selectedOption.val();

        if (direction == 'Left') {
            portLeft = value
        } else {
            portRight = value
        }
        sendUpdate();
    });
}

//Pass in either 'Left' or 'Right'
function createStateList(direction) {
    var selectList = document.createElement('select');
    selectList.id = 'state'+direction;
    document.getElementById('state'+direction+'Placeholder').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'None';
    defaultOption.value = ' ';
    selectList.appendChild(defaultOption);

    for (var i=0; i < usStates.length; i++) {
        var option = document.createElement('option');
        option.text = usStates[i];
        option.value = usStatesKeys[i];
        selectList.appendChild(option);
        
        if(this['state'+direction] && this['state'] != ' ') {
            if(option.value == this['state'+direction]) {
                //i+1 to account for default option
                selectList.options[i+1].selected = true;  
            }
        }
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

function setDropdownByText(selector, text) {
    $(selector).filter(function() {
        return $(this).text() == text; 
    }).prop('selected', true);
}

//////////////////Users stuff////////////////////////////////////////
var usersSocket = io('/users');

usersSocket.on('refresh users', function(newList) {
    userList = newList;
    $('#users-edit').hide();
    createUserList(userList);
    createSelectizedInputs();
});

function createSelectizedInputs() {
    $('#commentators').selectize({
        labelField: 'gamertag',
        valueField: 'id',
        options: userList,
        searchField: ['clan', 'gamertag', 'firstName', 'lastName'],
        sortField: 'gamertag',
        create: true,
        maxItems: 1,
        render: {
        item: function(item, escape) {
            var fullGamertag = getFullGamertagForUser(item);
            return '<div>' +
                ('<span class="name">' + escape(fullGamertag) + '</span>') +
            '</div>';
        },
        option: function(item, escape) {
                var fullGamertag = getFullGamertagForUser(item);
                var caption = ''+item.firstName + ' ' + item.lastName || item.twitter;
                var label = fullGamertag;
                return '<div>' +
                    '<div class="label">' + escape(label) + '</div>' +
                    (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                '</div>';
            }
        },
        onChange: function(value) {
            var user = getUserById(value);

            if(user) {
                $('#twitter').val(user.twitter);
            }
            
            
            if(dataInitialized) {
                sendUpdate();
            }
        }
    });

    $('#commentators2').selectize({
        labelField: 'gamertag',
        valueField: 'id',
        options: userList,
        searchField: ['clan', 'gamertag', 'firstName', 'lastName'],
        sortField: 'gamertag',
        create: true,
        maxItems: 1,
        render: {
        item: function(item, escape) {
            var fullGamertag = getFullGamertagForUser(item);
            return '<div>' +
                ('<span class="name">' + escape(fullGamertag) + '</span>') +
            '</div>';
        },
        option: function(item, escape) {
                var fullGamertag = getFullGamertagForUser(item);
                var caption = ''+item.firstName + ' ' + item.lastName || item.twitter;
                var label = fullGamertag;
                return '<div>' +
                    '<div class="label">' + escape(label) + '</div>' +
                    (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                '</div>';
            }
        },
        onChange: function(value) {
            var user = getUserById(value);

            if(user) {
                $('#twitter2').val(user.twitter);
            }
            
            if(dataInitialized) {
                sendUpdate();
            }
        }
    });

    $('#lplayer').selectize({
        labelField: 'gamertag',
        valueField: 'id',
        options: userList,
        searchField: ['clan', 'gamertag', 'firstName', 'lastName'],
        sortField: 'gamertag',
        create: true,
        maxItems: 1,
        render: {
        item: function(item, escape) {
            var fullGamertag = getFullGamertagForUser(item);
            return '<div>' +
                ('<span class="name">' + escape(fullGamertag) + '</span>') +
            '</div>';
        },
        option: function(item, escape) {
                var fullGamertag = getFullGamertagForUser(item);
                var caption = ''+item.firstName + ' ' + item.lastName || item.twitter;
                var label = fullGamertag;
                return '<div>' +
                    '<div class="label">' + escape(label) + '</div>' +
                    (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                '</div>';
            }
        },
        onChange: function(value) {
            var user = getUserById(value);

            if(user) {
                setDropdownByText('#stateLeft option', user.state);
            }

            if(dataInitialized) {
                sendUpdate();
            }
        }
    });

    $('#rplayer').selectize({
        labelField: 'gamertag',
        valueField: 'id',
        options: userList,
        searchField: ['clan', 'gamertag', 'firstName', 'lastName'],
        sortField: 'gamertag',
        create: true,
        maxItems: 1,
        render: {
        item: function(item, escape) {
            var fullGamertag = getFullGamertagForUser(item);
            return '<div>' +
                ('<span class="name">' + escape(fullGamertag) + '</span>') +
            '</div>';
        },
        option: function(item, escape) {
                var fullGamertag = getFullGamertagForUser(item);
                var caption = ''+item.firstName + ' ' + item.lastName || item.twitter;
                var label = fullGamertag;
                return '<div>' +
                    '<div class="label">' + escape(label) + '</div>' +
                    (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                '</div>';
            }
        },
        onChange: function(value) {
            var user = getUserById(value);

            if(user) {
                setDropdownByText('#stateRight option', user.state);
            } 

            if(dataInitialized) {
                sendUpdate();
            }
        }
    });
}

function addUser() {
    var newUser = {
        firstName: $('#user-first-name').val() || '',
        lastName: $('#user-last-name').val() || '',
        gamertag: $('#user-gamertag').val() || '',
        clan: $('#user-clan').val() || '',
        twitter: $('#user-twitter').val() || '',
        city: $('#user-city').val() || '',
        state: $('#user-state').val() || '',
        facts: $('#user-facts').val() || '',
        characters: $('#user-characters').val() || '',
    }

    usersSocket.emit('create user', newUser);
    clearNewUserForm();
    toastNotify('User created!')
}

function getUpdatedUser() {
    var newUser = {
        id: $('#edit-user-id').val() || '',
        firstName: $('#edit-user-first-name').val() || '',
        lastName: $('#edit-user-last-name').val() || '',
        gamertag: $('#edit-user-gamertag').val() || '',
        clan: $('#edit-user-clan').val() || '',
        twitter: $('#edit-user-twitter').val() || '',
        city: $('#edit-user-city').val() || '',
        state: $('#edit-user-state').val() || '',
        facts: $('#edit-user-facts').val() || '',
        characters: $('#edit-user-characters').val() || '',
    }

    return newUser;
}

function updateUser() {
    var newUser = getUpdatedUser();
    usersSocket.emit('update user', newUser);
    toastNotify('User updated!');
    createUserList(userList);
}

function deleteUser() {
    var newUser = getUpdatedUser();
    usersSocket.emit('delete user', newUser);
    toastNotify('User delted!');
    createUserList(userList);
}

function createUserList(users) {
    var oldVal = null;
    var matchList = $('#all-users-list');
    if (matchList) {
        oldVal = matchList.val();
        matchList.remove();
    }

    var selectList = document.createElement('select');
    selectList.id = 'all-users-list';
    document.getElementById('user-list-target').appendChild(selectList);

    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select a user to edit';
    defaultOption.value = null;
    selectList.appendChild(defaultOption);

    users.forEach(function(user){
        var option = document.createElement('option');
        option.text = ''+user.firstName+' '+user.lastName+' <'+user.gamertag+'>';
        option.value = user.id;
        if (oldVal && option.value === oldVal) {
            option.selected = true;
        }
        selectList.appendChild(option);
    });

    $('#all-users-list').change(function() {
        var selectedOption = $('#all-users-list option:selected');
        var identifier = selectedOption.val();
        if (identifier) {
            var selectedUser = getUserById(identifier);

            if(selectedUser) {
                $('#users-edit').show();
                $('#edit-user-id').val(selectedUser.id);
                $('#edit-user-first-name').val(selectedUser.firstName || '');
                $('#edit-user-last-name').val(selectedUser.lastName || '');
                $('#edit-user-gamertag').val(selectedUser.gamertag || '');
                $('#edit-user-clan').val(selectedUser.clan || '');
                $('#edit-user-twitter').val(selectedUser.twitter || '');
                $('#edit-user-city').val(selectedUser.city || '');
                $('#edit-user-state').val(selectedUser.state || '');
                $('#edit-user-facts').val(selectedUser.facts || '');
                $('#edit-user-characters').val(selectedUser.characters || '');
            } 
        }
    });
}

function clearNewUserForm() {
    $('#user-first-name').val('');
    $('#user-last-name').val('');
    $('#user-gamertag').val('');
    $('#user-clan').val('');
    $('#user-twitter').val('');
    $('#user-city').val('');
    $('#user-state').val('');
    $('#user-facts').val('');
    $('#user-characters').val('');
}

function getIdFromFullGamertag(fullGamertag) {
    if(!fullGamertag) {
        return '';
    }

    return userList.filter(function(obj) {
        return getFullGamertagForUser(obj) == fullGamertag
    })[0].id;
}

function getUserById(id) {
    if(!id) {
        return '';
    }

    return userList.filter(function(obj) {
        //Typecasting is fine here
        return obj.id == id;
    })[0];
}

function getFullGamertagForUser(user) {
    if(!user) {
        return '';
    }

    if(user.clan) {
        return user.clan + ' | ' + user.gamertag;
    }

    return user.gamertag;
}

var socket = io('/overlay');

socket.on('update overlay', function(data) {

    if(isNumeric(data.lplayer)) {
        $('#lplayer')[0].selectize.setValue(getIdFromFullGamertag(data.lplayer));
    } else {
        $('#lplayer')[0].selectize.createItem(data.lplayer);
    }

    if(isNumeric(data.rplayer)) {
        $('#rplayer')[0].selectize.setValue(getIdFromFullGamertag(data.rplayer));
    } else {
        $('#rplayer')[0].selectize.createItem(data.rplayer);
    }

    if(isNumeric(data.commentators)) {
        $('#commentators')[0].selectize.setValue(getIdFromFullGamertag(data.commentators));
    } else {
        $('#commentators')[0].selectize.createItem(data.commentators);
    }

    if(isNumeric(data.commentators2)) {
        $('#commentators2')[0].selectize.setValue(getIdFromFullGamertag(data.commentators2));
    } else {
        $('#commentators2')[0].selectize.createItem(data.commentators2);
    }

    document.getElementById('title').value = data.title || '';
    document.getElementById('tourneyInfo').value = data.tourneyInfo || ''; 
    document.getElementById('twitter').value = data.twitter || '';
    document.getElementById('twitter2').value = data.twitter2 || '';
    document.getElementById('current-game').value = data.currentGame || '';
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
    
    if(!dataInitialized) {
        createStateList('Left');
        createStateList('Right');
        createCharacterList('Left');
        createCharacterList('Right');
        createPortList('Left');
        createPortList('Right');
        dataInitialized = true;

        var gameDictionary = CONSTANT_GAMES.map(function(x) {
            return {item: x};
        });

        $('#current-game').selectize({
            options: gameDictionary,
            labelField: 'item',
            valueField: 'item',
            create: true,
            maxItems: 1,
            onChange: function(value) {
                if(dataInitialized) {
                    sendUpdate();
                }
            },
            item: function(item, escape) {
                return '<div>' +
                    ('<span class="name">' + escape(item) + '</span>') +
                '</div>';
            },
            option: function(item, escape) {
                    return '<div>' +
                        '<div class="label">' + escape(item) + '</div>';
            },
        });
    }
    
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
    window.characterRight = tempCharacter;

    $('#charListLeft').val(window.characterLeft);
    $('#charListRight').val(window.characterRight);
    
    var tempPort = window.portLeft;
    window.portLeft = window.portRight;
    window.portRight = tempPort;
    $('#portLeft').val(window.portLeft);
    $('#portRight').val(window.portRight);
    
    var tempState = window.stateLeft;
    window.stateLeft = window.stateRight;
    window.stateRight = tempState;
    $('#stateLeft').val(window.stateLeft);
    $('#stateRight').val(window.stateRight);
    
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

//Fires the transition animation to all overlays
function fireTransition() {
    socket.emit('fire transition');
}

//Fires the an announcement for Elizabeth to read on appropriate overlays
function fireAnnouncement() {
    var newText = document.getElementById('announcement-text').value;
    socket.emit('fire announcement', newText);
}

function sendUpdate(infoMessage) {
    var comm1Value = document.getElementById('commentators').value;
    var commentator1 = isNumeric(comm1Value) ? getFullGamertagForUser(getUserById(comm1Value)) : comm1Value;

    var comm2Value = document.getElementById('commentators2').value;
    var commentator2 = isNumeric(comm2Value) ? getFullGamertagForUser(getUserById(comm2Value)) : comm2Value;

    var p1Value = document.getElementById('lplayer').value;
    var leftPlayer = isNumeric(p1Value) ? getFullGamertagForUser(getUserById(p1Value)) : p1Value;

    var p2Value = document.getElementById('rplayer').value;
    var rightPlayer = isNumeric(p2Value) ? getFullGamertagForUser(getUserById(p2Value)) : p2Value;

    var data = {
        'lplayer': leftPlayer,
        'rplayer': rightPlayer,
        'title': document.getElementById('title').value,
        'tourneyInfo': document.getElementById('tourneyInfo').value,
        'lscore': document.getElementById('lscore').value,
        'rscore': document.getElementById('rscore').value,
        'commentators':  commentator1,
        'commentators2': commentator2,
        'twitter': document.getElementById('twitter').value,
        'twitter2': document.getElementById('twitter2').value,
        'currentGame': document.getElementById('current-game').value,
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
function playMatchIntro(label) {
    socket.emit('play intro', label);
    toastNotify("Playing match intro at label: '" + label + "'.") 
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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

    $(".layoutButton").click(function () {
        $(".layoutButton").removeClass('selectedLayout');
        $(this).addClass('selectedLayout');
        changeLayout();
    });
});
