/**
 * Created by samva on 23/01/2017.
 */
const subscribers_1 = require("./subscribers");
const subscriptions_1 = require("./subscriptions");
var spiders = require('spiders.js/src/spiders');
class Actor extends spiders.Actor {
    constructor() {
        super();
        this.subscriberManager = new subscribers_1.SubscriberManager();
        this.subscriptionManager = new subscriptions_1.SubscriptionManager();
    }
    addSubscriber(key, subscriber) {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }
    reactTo(source, output, handler) {
        let subscriptionIdentifier = source.addSubscriber(output, this);
        this.subscriptionManager.addHandler(subscriptionIdentifier, handler);
    }
    broadcast(key, value) {
        let subscriptions = this.subscriberManager.getSubscribers(key);
        for (let subscription of subscriptions) {
            let subscriber = subscription.reference;
            let subscriptionIdentifier = subscription.uuid;
            subscriber.receiveBroadcast(this, subscriptionIdentifier, value);
        }
    }
    receiveBroadcast(source, subscriptionIdentifier, value) {
        let handler = this.subscriptionManager.getHandler(subscriptionIdentifier);
        console.log("received value: " + value);
    }
}
exports.Actor = Actor;
//# sourceMappingURL=actor.js.map