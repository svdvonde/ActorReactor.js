/**
 * Created by samva on 23/01/2017.
 */
var uuid = require('node-uuid');
class Subscriber {
    constructor(uuid, actor) {
        this.uuid = uuid;
        this.reference = actor;
    }
}
exports.Subscriber = Subscriber;
class SubscriberManager {
    constructor() {
        this.subscriberMap = {};
    }
    getSubscribers(key) {
        if (key in this.subscriberMap)
            return this.subscriberMap[key];
        else
            return [];
    }
    setSubscribers(key, subscribers) {
        this.subscriberMap[key] = subscribers;
    }
    addSubscriber(key, subscriber) {
        let subscribers = this.getSubscribers(key);
        let subscriptionIdentifier = uuid.v4();
        subscribers.push(new Subscriber(subscriptionIdentifier, subscriber));
        return subscriptionIdentifier;
    }
    removeSubscriber(key, subscriptionIdentifier) {
        let subscribers = this.getSubscribers(key);
        let newSubscribers = subscribers.filter(x => x.uuid !== subscriptionIdentifier);
        this.setSubscribers(key, newSubscribers);
    }
}
exports.SubscriberManager = SubscriberManager;
//# sourceMappingURL=subscribers.js.map