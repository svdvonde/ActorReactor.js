/**
 * Created by samva on 23/01/2017.
 */
const actor_1 = require("./actor");
var spiders = require('spiders.js/src/spiders');
class Application extends spiders.Application {
    constructor() {
        super();
        this.Actor = actor_1.Actor;
    }
}
exports.Application = Application;
//# sourceMappingURL=application.js.map