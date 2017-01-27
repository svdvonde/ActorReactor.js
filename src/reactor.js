/**
 * Created by samva on 24/01/2017.
 */
/**
 * Created by samva on 23/01/2017.
 */
const subscribers_1 = require("./subscribers");
let spider = require('spiders.js/src/spiders');
class Reactor extends spider.Actor {
    constructor(inputSources) {
        super();
        this.subscriberManager = new subscribers_1.SubscriberManager();
        this.RxSubjects = [];
        this.signalSources = inputSources;
    }
    init() {
        // typeof importScripts checks that this code runs in the scope of a web worker.
        // I mean, the fact that this is a reactor means that it does, but nevertheless if we do not include this check
        // it will complain that importScripts is undefined
        if (this.isBrowser())
            importScripts("http://localhost:63342/ActorReactor.js/scripts/Rx.min.js");
        else
            this.RxJS = require('@reactivex/rxjs');
        for (let signalReference of this.signalSources) {
            let source = signalReference[0];
            let output = signalReference[1];
            if (this.isBrowser())
                var rxSubject = new Rx.Subject();
            else
                var rxSubject = new this.RxJS.Subject();
            this.RxSubjects.push(rxSubject);
            let identifierPromise = source.addSubscriber(output, this);
            identifierPromise.then((subscriptionIdentifier) => {
                this[subscriptionIdentifier] = (value) => { rxSubject.next(value); };
            });
        }
        if ("react" in this)
            this["react"].apply(this, this.RxSubjects);
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
    isBrowser() {
        return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
    }
}
exports.Reactor = Reactor;
//# sourceMappingURL=reactor.js.map