var Dog = require('core/models/animals/Dog');

var dog = new Dog();

function doClick(e) {
    alert(dog.sayHello());
}

function openWin2(e) {
    var win2 = Alloy.createController('win2');
    win2.getView().open();
}

$.index.open();