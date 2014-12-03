var User = require('/core/models/User'),
    Dog = require('core/models/animals/Dog'),
    Cat = require('core/models/animals/Cat');

var cat = new Cat(),
    dog = new Dog();

function doClick(e) {
    alert(dog.sayHello());
}

function catClick(e) {
    alert(cat.sayHello());
}

function closeWin2(e) {
    $.win2.close();
}


