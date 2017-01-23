

var actorreactor = require('../src/application');


class testApp extends actorreactor.Application {

}
var app = new testApp();

class outputProducer extends app.Actor {
    produceOutput() {
        this.broadcast("exampleOutput", Math.random())
    }
}

class outputReceiver extends app.Actor {

    init(someActor) {
        this.reactTo(someActor, "exampleOutput", this.print);
    }

    print(value) {
        console.log(value);
    }
}

var outputActor = app.spawnActor(outputProducer);
var printActor  = app.spawnActor(outputReceiver,[],8082);
actor.produceOutput();