/**
 * Created by samva on 23/01/2017.
 */

import {Actor} from "./actor";
import {Reactor} from "./reactor";
import {Observable} from "@reactivex/rxjs"
import {SpiderLib, FarRef} from "spiders.js/src/spiders"
import {SubscriberManager} from "./subscribers";
let spider:SpiderLib = require('spiders.js/src/spiders');

export type SignalReference = [ FarRef, ExportReference ];
export type ExportReference = string;

abstract class ActorReactorApplication extends spider.Application {

    // Do not provide a type signature for reactorClass. If we say the type is "Reactor", then it will complain that we cannot create an instance of an abstract class
    // In reality the passed class will be a non-abstract extension of the Reactor class
    spawnReactor(reactorClass, sources : SignalReference[], port? : number) : FarRef {
        return this.spawnActor(reactorClass, sources, port);
    }

    static isBrowser() : boolean {
        return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
    }
}

abstract class ActorReactorClientApplication extends ActorReactorApplication {

    subscriberManager : SubscriberManager;

    constructor() {
        super();
        this.subscriberManager = new SubscriberManager();

        let actorThis = this;
        Rx.Observable.prototype.broadcastAs = function(exportReference : ExportReference) {
            actorThis.broadcast(this, exportReference);
            return this; // return observable for further chaining
        }
    }

    addSubscriber(exportReference : ExportReference, subscriber: FarRef) : string {
        return this.subscriberManager.addSubscriber(exportReference, subscriber);
    }

    broadcast(observable : Observable<any>, exportReference: ExportReference) : void {
        observable.subscribe((value : any) => {
            let subscriptions = this.subscriberManager.getSubscribers(exportReference);
            subscriptions.forEach(
                (subscription) => {
                    let subscriber = subscription.getReference();
                    let subscriptionIdentifier = subscription.getUUID();
                    subscriber.receiveBroadcast(this, subscriptionIdentifier, [value]);
                }
            );
        });
    }
}

if (ActorReactorApplication.isBrowser())
    exports.Application = ActorReactorClientApplication;
else
    exports.Application = ActorReactorApplication;

exports.Actor = Actor;
exports.Reactor = Reactor;