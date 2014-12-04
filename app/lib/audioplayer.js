var state = require('core/state'),
    log = require('logger');

var STATE_BUFFERING = 0,
    STATE_INITIALIZED = 1,
    STATE_PAUSED = 2,
    STATE_PLAYING = 3,
    STATE_STARTING = 4,
    STATE_STOPPED = 5,
    STATE_STOPPING = 6,
    STATE_WAITING_FOR_DATA = 7,
    STATE_WAITING_FOR_QUEUE = 8;

var REQUEST_STATE_PLAYING = 1,
    REQUEST_STATE_PAUSED = 2;

var _audio = null,
    _remote_url,
    _playable = false,
    _status;

var dispose = function() {
    if(_audio) {
        _audio.stop();
        removeEventListeners();
        if(OS_ANDROID) _audio.dispose();
        _audio = null,
        _remote_url = null,
        _playable = false;
    }
};

exports.init = function(remote_url) {
    _remote_url = remote_url;
    if(_audio) dispose();
    _audio = Ti.Media.createAudioPlayer({
        url: audioUrl,
        allowBackground: true
        //bufferSize: config.AUDIO_OBJECT_STREAMER_BUFFER_SIZE
    });
    addEventListeners();
    state.setPlayback(state.PLAYBACK_INITED);
};

exports.play = function() {
    _status = REQUEST_STATE_PLAYING;
    if(_audio) _audio.play();
    state.setPlayback(state.PLAYBACK_PLAY);
};

exports.pause = function() {
    _status = REQUEST_STATE_PAUSED;
    state.setPlayback(state.PLAYBACK_PAUSED);
};

exports.stop = function() {
    if(_audio) dispose();
    state.setPlayback(state.PLAYBACK_STOPPED);
};

var changeListener = function(e) {
    log('Ti AudioPlayer: [' + _remote_url + '] changeListener: audio.state: ' + e.state + " " + e.description);

    if(false == _playable) {
        if(e.state == STATE_INITIALIZED || e.state == STATE_PLAYING) {
            _playable = true;
            if(_status == REQUEST_STATE_PLAYING && e.state != STATE_PLAYING) {
                exports.play();
            }
        }
    }
    if(e.state == STATE_WAITING_FOR_DATA || e.state == STATE_WAITING_FOR_QUEUE ) { //Still preloading
        _playable = false; //Prevents auto start playing
    }
};

var progressListener = function(e) {
    //logger.debug('Time Played: ' + Math.round(e.progress) + ' milliseconds');
    //logger.debug('AudioObject_Android: ' + self.remote_url + ' p = ' + lastprogress);
    previousProgress = lastprogress;
    lastprogress = Math.round(e.progress);
};

var onComplete = function() {
    self.completed = true;
};