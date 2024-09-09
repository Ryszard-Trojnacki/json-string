/**
 * @file JSON parse and stringify functions for combining in plan text
 * @author Ryszard Trojnacki
 * @license MIT
 */

/**
 * Start of JSON object in plain text.
 * @type {string}
 */
const JSON_START='\0';

/**
 * End of JSON object in plain text.
 * @type {string}
 */
const JSON_END='\u0001';

/**
 * Stringify an item to be included in plain text.
 *
 * This is just a wrapper around JSON.stringify with added start and end.
 * @param {any} item
 * @return {string}
 */
export function stringify(item) {
    return JSON_START+JSON.stringify(item)+JSON_END;
}

/**
 * Parse an item from plain text.
 * @param {any} str
 * @return {any}
 */
export function parse(str) {
    // If input is not string, then return it as is. We parse only strings.
    if(typeof(str)!=='string') return str;
    if(str.length<2) return str;

    let res=[];
    let end=-1; // Last end position
    for(;;) {
        const st=str.indexOf(JSON_START, end+1);
        if(st<0) break;
        const j=str.indexOf(JSON_END, st+1);
        if(j<0) break;  // Or throw error?
        if(end+1<st) res.push(str.substring(end+1, st));    // Text between objects
        res.push(JSON.parse(str.substring(st+1, j)));
        end=j;
    }
    if(res.length===0) return str;  // only text
    if(end+1<str.length) res.push(str.substring(end+1));    // Text after last object
    if(res.length===1) return res[0];   // Single object
    return res;
}