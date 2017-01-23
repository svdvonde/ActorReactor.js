/**
 * Created by samva on 23/01/2017.
 */

import {Actor} from "./actor";

var uuid = require('node-uuid');

export class Subscriber {
    uuid: string;
    reference: Actor;

    constructor(uuid: string, actor: Actor) {
        this.uuid = uuid;
        this.reference = actor;
    }
}

export class SubscriberManager {
    subscriberMap : { [output: string]: Subscriber[] };

    constructor() {
        this.subscriberMap = { };
    }

    getSubscribers(key : string) {
        if (key in this.subscriberMap)
            return this.subscriberMap[key];
        else
            return [];
    }

    setSubscribers(key: string, subscribers: Subscriber[]) {
        this.subscriberMap[key] = subscribers;
    }

    addSubscriber(key : string, subscriber : Actor) {
        let subscribers = this.getSubscribers(key);
        let subscriptionIdentifier = uuid.v4();
        subscribers.push(new Subscriber(subscriptionIdentifier, subscriber));
        return subscriptionIdentifier;
    }

    removeSubscriber(key: string, subscriptionIdentifier: string) {
        let subscribers = this.getSubscribers(key);
        let newSubscribers = subscribers.filter(x => x.uuid !== subscriptionIdentifier);
        this.setSubscribers(key, newSubscribers);
    }
}