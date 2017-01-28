/**
 * Created by sam on 27/01/2017.
 */

let spider = require('spiders.js/src/spiders');



class testApp extends spider.Application{

}
var app = new testApp()

class referencedActor extends spider.Actor {
    getValue() {
        return 5;
    }
}

class referencingActor extends spider.Actor {
    constructor(actorReference) {
        super();
        this.ref = actorReference;
    }

    getValue(){
        return this.ref.getValue().then((v) => { return v; });
    }
}


var actor1 = app.spawnActor(referencedActor);
var actor2 = app.spawnActor(referencingActor, [actor1], 8081);

actor2.getValue().then((v) => { return v; });