/**
 * Created by samva on 23/01/2017.
 */
const actor_1 = require("./actor");
const reactor_1 = require("./reactor");
let spider = require('spiders.js/src/spiders');
class Application extends spider.Application {
    constructor() {
        super();
    }
    // Do not provide a type signature for reactorClass. If we say the type is "Reactor", then it will complain that we cannot create an instance of an abstract class
    // In reality the passed class will be a non-abstract extension of the Reactor class
    spawnReactor(reactorClass, sources, port) {
        return this.spawnActor(reactorClass, sources, port);
    }
}
exports.Application = Application;
exports.Actor = actor_1.Actor;
exports.Reactor = reactor_1.Reactor;
//# sourceMappingURL=application.js.map