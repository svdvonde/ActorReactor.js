/**
 * Created by samva on 23/01/2017.
 */

import {Actor} from "./actor";
import {Reactor} from "./reactor";
import {isBrowser} from "./utilities"
import {SpiderLib, FarRef} from "spiders.js/src/spiders"
import {SubscriberManager} from "./subscribers";
let spider:SpiderLib = require('spiders.js/src/spiders');

export type SignalReference = [ FarRef, string ];

abstract class ActorReactorApplication extends spider.Application {

    // Do not provide a type signature for reactorClass. If we say the type is "Reactor", then it will complain that we cannot create an instance of an abstract class
    // In reality the passed class will be a non-abstract extension of the Reactor class
    spawnReactor(reactorClass, sources : SignalReference[], port? : number) : FarRef {
        return this.spawnActor(reactorClass, sources, port);
    }
}

abstract class ActorReactorClientApplication extends ActorReactorApplication {

    subscriberManager : SubscriberManager;

    constructor() {
        super();
        this.subscriberManager = new SubscriberManager();
    }

    addSubscriber(key : string, subscriber: FarRef) : string {
        return this.subscriberManager.addSubscriber(key, subscriber);
    }
}

if (isBrowser())
    exports.Application = ActorReactorClientApplication;
else
    exports.Application = ActorReactorApplication;

exports.Actor = Actor;
exports.Reactor = Reactor;