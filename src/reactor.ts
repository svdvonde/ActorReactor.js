/**
 * Created by samva on 24/01/2017.
 */

/**
 * Created by samva on 23/01/2017.
 */

import {SubscriberManager} from "./subscribers";
import {SpiderLib, FarRef} from "spiders.js/src/spiders"
import {SignalReference} from "./application";
import {Observable} from "@reactivex/rxjs"

let spider:SpiderLib = require('spiders.js/src/spiders');

export abstract class Reactor extends spider.Actor {
    subscriberManager : SubscriberManager;
    signalSources : SignalReference[];


    RxJS; // no type signature because this is the entire library
    RxSubjects : any[];

    constructor(inputSources : SignalReference[]) {
        super();

        this.subscriberManager = new SubscriberManager();
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

        for(let signalReference of this.signalSources) {
            let source = signalReference[0];
            let output = signalReference[1];

            if (this.isBrowser())
                var rxSubject : any = new Rx.Subject();
            else
                var rxSubject : any = new this.RxJS.Subject();


            this.RxSubjects.push(rxSubject);

            let identifierPromise = source.addSubscriber(output, this);
            identifierPromise.then(
                (subscriptionIdentifier) => {
                    this[subscriptionIdentifier] = (value : any) => { rxSubject.next(value); };
                });
        }

        if ("react" in this)
            this["react"].apply(this, this.RxSubjects);
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


    private isBrowser() : boolean {
        return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
    }
}