/**
 * Created by samva on 24/01/2017.
 */
/**
 * Created by samva on 23/01/2017.
 */
const subscribers_1 = require("./subscribers");
const utilities_1 = require("./utilities");
let spider = require('spiders.js/src/spiders');
class Reactor extends spider.Actor {
    constructor(...inputSources) {
        super();
        this.subscriberManager = new subscribers_1.SubscriberManager();
        this.signalSources = inputSources;
    }
    init() {
        if (utilities_1.isBrowser())
            importScripts("http://localhost:63342/ActorReactor.js/scripts/Rx.umd.js");
        else
            this.RxJS = require('@reactivex/rxjs');
        let RxSubjects = [];
        for (let signalReference of this.signalSources) {
            let source = signalReference[0];
            let output = signalReference[1];
            if (utilities_1.isBrowser())
                // Rx will be imported by the importScripts statement that loads the Rx library
                var rxSubject = new Rx.Subject();
            else
                var rxSubject = new this.RxJS.Subject();
            RxSubjects.push(rxSubject);
            source.addSubscriber(output, this).then((subscriptionIdentifier) => {
                this[subscriptionIdentifier] = function (value) { rxSubject.next(value); };
            });
        }
        if ("react" in this)
            this["react"].apply(this, RxSubjects);
        else
            throw new Error("Reactor will not do anything because the 'react' method is not implemented");
    }
    addSubscriber(key, subscriber) {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }
    broadcast(observable, key) {
        observable.subscribe((value) => {
            let subscriptions = this.subscriberManager.getSubscribers(key);
            subscriptions.forEach((subscription) => {
                let subscriber = subscription.getReference();
                let subscriptionIdentifier = subscription.getUUID();
                subscriber.receiveBroadcast(this, subscriptionIdentifier, [value]);
            });
        });
    }
    receiveBroadcast(source, subscriptionIdentifier, values) {
        if (subscriptionIdentifier in this)
            this[subscriptionIdentifier](values);
        else
            throw new Error("Reactor received broadcasted value to which it has no subscription... Ignoring the broadcast.");
    }
}
exports.Reactor = Reactor;
//# sourceMappingURL=reactor.js.map