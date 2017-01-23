/**
 * Created by samva on 23/01/2017.
 */

import {SubscriberManager} from "./subscribers";
import {SubscriptionManager} from "./subscriptions";


var spiders = require('spiders.js/src/spiders');


export abstract class Actor extends spiders.Actor {
    subscriberManager : SubscriberManager;
    subscriptionManager : SubscriptionManager;

    constructor() {
        super();
        this.subscriberManager = new SubscriberManager();
        this.subscriptionManager = new SubscriptionManager();
    }

    addSubscriber(key : string, subscriber: Actor) {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }

    reactTo(source: Actor, output: string, handler: Function) {
        let subscriptionIdentifier = source.addSubscriber(output, this);
        this.subscriptionManager.addHandler(subscriptionIdentifier, handler);
    }

    broadcast(key: string, value: any) {
        let subscriptions = this.subscriberManager.getSubscribers(key);
        for (let subscription of subscriptions) {
            let subscriber = subscription.reference;
            let subscriptionIdentifier = subscription.uuid;
            subscriber.receiveBroadcast(this, subscriptionIdentifier, value);
        }
    }

    receiveBroadcast(source: Actor, subscriptionIdentifier: string, value: any) {
        let handler = this.subscriptionManager.getHandler(subscriptionIdentifier);
        console.log("received value: " + value);
    }
}