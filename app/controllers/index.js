var User = require('core/models/humans/User'),
    Dog = require('core/models/animals/Dog'),
    Cat = require('core/models/animals/Cat'),
    Donkey = require('core/models/animals/Donkey'),
    dispatcher = require('core/dispatcher'),
    log = require('logger'),
    state = require('core/state'),
    audioplayer = require('core/audioplayer');

var user = new User(),
    dog = new Dog(),
    cat = new Cat(),
    donkey = new Donkey();

function userClick(e) {
    alert(user.sayHello());
}

function dogClick(e) {
    alert(dog.sayHello());
}

function catClick(e) {
    alert(cat.sayHello());
}

function donkeyClick(e) {
    alert(donkey.sayHello());
}

function togglePlayPause(e) {
    if(state.getPlayback() != state.PLAYBACK_PLAY) {
        //Stop audio...
        audioplayer.play();
        $.playbackControl.title = "PAUSE";
    } else if(state.getPlayback() == state.PLAYBACK_PLAY) {
        audioplayer.stop();
        $.playbackControl.title = "PLAY";
    }
};

dispatcher.on('log', function(data) {
    log(data.msg);
});

var changeWindowBackgroundColor = function(color) {
    $.tab1.backgroundColor = color;
    $.tab2.backgroundColor = color;
};

dispatcher.on('STATE_EMERGENCY', function() {
    changeWindowBackgroundColor('red');
});

dispatcher.on('STATE_ALERTED', function() {
    changeWindowBackgroundColor('orange');
});

dispatcher.on('STATE_NORMAL', function() {
    changeWindowBackgroundColor('white');
});

$.index.open();