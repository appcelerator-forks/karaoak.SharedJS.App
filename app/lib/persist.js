var log = require('logger');

exports.set = function(key, value) {
    log('persist.store: ' + key + ':' + value);
    Ti.App.Properties.setString(key, value);
};

exports.get = function(key) {
    var value = Ti.App.Properties.getString(key, false);
    log('persist.get: ' + key + ':' + value);
    return value;
};

exports.unset = function(key) {
    log('persist.remove: ' + key);
    Ti.App.Properties.removeProperty(key);
};