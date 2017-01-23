/**
 * Created by samva on 23/01/2017.
 */


export class SubscriptionManager {
    subscriptionMap : { [subscriptionIdentifier: string]: Function };

    constructor() {
        this.subscriptionMap = { };
    }


    getHandler(subscriptionIdentifier : string) {
        return this.subscriptionMap[subscriptionIdentifier];
    }

    addHandler(subscriptionIdentifier : string, handler : Function) {
        this.subscriptionMap[subscriptionIdentifier] = handler;
    }

    removeHandler(subscriptionIdentifier : string) {
        delete this.subscriptionMap[subscriptionIdentifier];
    }
}