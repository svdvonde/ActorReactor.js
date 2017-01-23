/**
 * Created by samva on 23/01/2017.
 */

import {Actor} from "./actor";


var spiders = require('spiders.js/src/spiders');

type Class = { new(...args: any[]): any; };


abstract class Application extends spiders.Application {
    Actor   : Class;
    Reactor : Class;

    constructor() {
        super();
        this.Actor = Actor as Class;
    }
}

exports.Application = Application;