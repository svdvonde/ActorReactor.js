/**
 * Created by samva on 23/01/2017.
 */
const actor_1 = require("./actor");
const reactor_1 = require("./reactor");
const subscribers_1 = require("./subscribers");
let spider = require('spiders.js/src/spiders');
class ActorReactorApplication extends spider.Application {
    // Do not provide a type signature for reactorClass. If we say the type is "Reactor", then it will complain that we cannot create an instance of an abstract class
    // In reality the passed class will be a non-abstract extension of the Reactor class
    spawnReactor(reactorClass, sources, port) {
        return this.spawnActor(reactorClass, sources, port);
    }
    static isBrowser() {
        return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
    }
}
class ActorReactorClientApplication extends ActorReactorApplication {
    constructor() {
        super();
        this.subscriberManager = new subscribers_1.SubscriberManager();
        let actorThis = this;
        Rx.Observable.prototype.broadcastAs = function (exportReference) {
            actorThis.broadcast(this, exportReference);
            return this; // return observable for further chaining
        };
    }
    addSubscriber(exportReference, subscriber) {
        return this.subscriberManager.addSubscriber(exportReference, subscriber);
    }
    broadcast(observable, exportReference) {
        observable.subscribe((value) => {
            let subscriptions = this.subscriberManager.getSubscribers(exportReference);
            subscriptions.forEach((subscription) => {
                let subscriber = subscription.getReference();
                let subscriptionIdentifier = subscription.getUUID();
                subscriber.receiveBroadcast(this, subscriptionIdentifier, [value]);
            });
        });
    }
}
if (ActorReactorApplication.isBrowser())
    exports.Application = ActorReactorClientApplication;
else
    exports.Application = ActorReactorApplication;
exports.Actor = actor_1.Actor;
exports.Reactor = reactor_1.Reactor;
//# sourceMappingURL=application.js.map