/**
 * Created by samva on 23/01/2017.
 */
class SubscriptionManager {
    constructor() {
        this.subscriptionMap = {};
    }
    getHandler(subscriptionIdentifier) {
        return this.subscriptionMap[subscriptionIdentifier];
    }
    addHandler(subscriptionIdentifier, handler) {
        this.subscriptionMap[subscriptionIdentifier] = handler;
    }
    removeHandler(subscriptionIdentifier) {
        delete this.subscriptionMap[subscriptionIdentifier];
    }
}
exports.SubscriptionManager = SubscriptionManager;
//# sourceMappingURL=subscriptions.js.map