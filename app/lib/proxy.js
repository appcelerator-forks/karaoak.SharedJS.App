//Private instance
var inited = false;

var init = function(props) {
    for(var propertyName in props) {
        exports[propertyName] = (propertyName == "_") ? require(props[propertyName])._ : require(props[propertyName]);
    }
    inited = true;
};

//Accessor for single instance
exports.getInstance = function(props) {
    if (false === inited) {
        init(props);
    }
};