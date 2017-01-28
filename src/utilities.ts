/**
 * Created by sam on 28/01/2017.
 */

export function isBrowser() : boolean {
    return !((typeof process === 'object') && (typeof process.versions === 'object') && (typeof process.versions.node !== 'undefined'));
}