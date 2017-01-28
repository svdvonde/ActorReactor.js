/**
 * Created by samva on 23/01/2017.
 */
const actor_1 = require("./actor");
const reactor_1 = require("./reactor");
const utilities_1 = require("./utilities");
const subscribers_1 = require("./subscribers");
let spider = require('spiders.js/src/spiders');
class ActorReactorApplication extends spider.Application {
    // Do not provide a type signature for reactorClass. If we say the type is "Reactor", then it will complain that we cannot create an instance of an abstract class
    // In reality the passed class will be a non-abstract extension of the Reactor class
    spawnReactor(reactorClass, sources, port) {
        return this.spawnActor(reactorClass, sources, port);
    }
}
class ActorReactorClientApplication extends ActorReactorApplication {
    constructor() {
        super();
        this.subscriberManager = new subscribers_1.SubscriberManager();
    }
    addSubscriber(key, subscriber) {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }
}
if (utilities_1.isBrowser())
    exports.Application = ActorReactorClientApplication;
else
    exports.Application = ActorReactorApplication;
exports.Actor = actor_1.Actor;
exports.Reactor = reactor_1.Reactor;
//# sourceMappingURL=application.js.map