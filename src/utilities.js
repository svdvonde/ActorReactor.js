/**
 * Created by sam on 28/01/2017.
 */
function isBrowser() {
    return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
}
exports.isBrowser = isBrowser;
//# sourceMappingURL=utilities.js.map