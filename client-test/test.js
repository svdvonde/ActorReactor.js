
var actorreactor = require('../src/application');

class testApp extends actorreactor.Application {

    init() {
        const example = Rx.Observable.fromEvent(window.document.getElementById('example'), 'keyup')
            .map(i => i.currentTarget.value)
            .debounceTime(500) //wait .5s between keyups to emit current value and throw away all other values
            .broadcastAs("textInput");
    }
}

class CharacterCounter extends actorreactor.Reactor {
    react(input) {
        input.map(str => str.length).broadcastAs("length");
    }
}

class Printer extends actorreactor.Actor {
    print(value) {
        console.log("PRINT: " + value);
    }
}

let application = new testApp();
let characterCounter = application.spawnReactor(CharacterCounter, [[application, "textInput"]]);
let printer  = application.spawnActor(Printer, [], 8081);

printer.reactTo([application, "textInput"], "print");
printer.reactTo([characterCounter, "length"], "print");


application.init();