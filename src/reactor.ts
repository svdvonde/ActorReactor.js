/**
 * Created by samva on 24/01/2017.
 */

/**
 * Created by samva on 23/01/2017.
 */

import {SubscriberManager} from "./subscribers";
import {SpiderLib, FarRef} from "spiders.js/src/spiders"
import {Observable} from "@reactivex/rxjs"
import {SignalReference} from "./application";
import {isBrowser} from "./utilities"


let spider:SpiderLib = require('spiders.js/src/spiders');

export abstract class Reactor extends spider.Actor {
    subscriberManager : SubscriberManager;
    signalSources : SignalReference[];

    RxJS; // no type signature because this is the entire library

    constructor(... inputSources : SignalReference[]) {
        super();

        this.subscriberManager = new SubscriberManager();
        this.signalSources = inputSources;
    }

    init() {
        if (isBrowser())
            importScripts("http://localhost:63342/ActorReactor.js/scripts/Rx.umd.js");
        else
            this.RxJS = require('@reactivex/rxjs');

        let RxSubjects = [];

        for(let signalReference of this.signalSources) {

            let source = signalReference[0];
            let output = signalReference[1];

            if (isBrowser())
                // Rx will be imported by the importScripts statement that loads the Rx library
                var rxSubject = new Rx.Subject();
            else
                var rxSubject = new this.RxJS.Subject();

            RxSubjects.push(rxSubject);

            source.addSubscriber(output, this).then(
                (subscriptionIdentifier) => {
                    this[subscriptionIdentifier] = function (value: any) { rxSubject.next(value); };
                });
        }

        if ("react" in this)
            this["react"].apply(this, RxSubjects);
        else
            throw new Error("Reactor will not do anything because the 'react' method is not implemented");
    }


    addSubscriber(key : string, subscriber: FarRef) : string {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }


    broadcast(observable : Observable<any>, key: string) : void {
        observable.subscribe((value : any) => {
            let subscriptions = this.subscriberManager.getSubscribers(key);
            subscriptions.forEach(
                (subscription) => {
                    let subscriber = subscription.getReference();
                    let subscriptionIdentifier = subscription.getUUID();
                    subscriber.receiveBroadcast(this, subscriptionIdentifier, [value]);
                }
            );
        });
    }


    receiveBroadcast(source : FarRef, subscriptionIdentifier : string, values : any[]) : void {
        if (subscriptionIdentifier in this)
            this[subscriptionIdentifier](values);
        else
            throw new Error("Reactor received broadcasted value to which it has no subscription... Ignoring the broadcast.");
    }

}