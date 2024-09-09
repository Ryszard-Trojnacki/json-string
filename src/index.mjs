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
 * Find previous quote in JSON string.
 * @param {string} str JSON string to search
 * @param {number} start search start position
 * @return {number} position of previous quote or -1 if not found
 */
function prevOfQuote(str, start) {
    for(let i=start; i>=0; i--) {
        if(str[i]==='"') {
            if(i>0 && str[i-1]==='\\') continue;    // Escaped quote
            return i;
        }
    }
    return -1;
}

/**
 * Check if character at position is quote.
 * @param {string} str JSON string to search
 * @param {number} pos position to check
 * @return {boolean}
 */
function isQuote(str, pos) {
    if(pos<0 || pos>=str.length) return false;
    return str[pos]==='"' && (pos===0 || str[pos-1]!=='\\');
}

/**
 * Find next quote in JSON string.
 * @param {string} str JSON string to search
 * @param {number} start search start position
 * @return {number} position of next quote or -1 if not found
 */
function nextOfQuote(str, start) {
    for(let i=start; i<str.length; i++) {
        if(str[i]==='"') {
            if(i>0 && str[i-1]==='\\') continue;    // Escaped quote
            return i;
        }
    }
    return -1;
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

    let stack=[];
    let res=[];
    let last=0;

    for(let i=0;i<str.length;++i) {
        const c=str[i];
        if(c===JSON_START) {
            if(stack.length===0) {
                if(i>last) res.push(str.substring(last, i));  // Text before JSON object
            }
            stack.push(i);  // Remember start position of JSON object
        } else if(c===JSON_END) {
            if(stack.length===0) {
                throw new Error("JSON_END without JSON_START at position: "+i);
            }
            const start=stack.pop();
            const root=stack.length===0;
            const jsonStr=str.substring(start+1, i);
            try {
                const json=JSON.parse(jsonStr);
                if(root) {  // Root object add to result
                    res.push(json);
                    last=i+1;
                }
                else {  // Nested object, replace JSON in parent object
                    const endQuote=nextOfQuote(str, i);
                    if(endQuote>=0) str=str.substring(0, endQuote+1)+']'+str.substring(endQuote+1);

                    const nested=JSON.stringify(json);

                    str=str.substring(0, start)+'\", '+nested+', \"'+str.substring(i+1);
                    let end=start-1+3+nested.length+3;

                    const startQuote=prevOfQuote(str, start-1);
                    if(startQuote>=0) {
                        const empty=isQuote(str, startQuote) && isQuote(str, startQuote+1);

                        str=str.substring(0, startQuote)+'[' +str.substring(startQuote+(empty?4:0));
                        end+=1-(empty?4:0);
                    }

                    if(isQuote(str, end) && isQuote(str, end+1)) {
                        str=str.substring(0, end-2)+str.substring(end+2);
                        end-=4;
                    }

                    i=start+1;    // Restart parsing from start of nested object
                }
            }catch (e) {
                throw new Error("Error parsing JSON: "+jsonStr, { cause: e });
            }
        }
    }
    if(res.length===0) return str;  // only text
    if(last+1<str.length) res.push(str.substring(last));    // Text after last object
    if(res.length===1) return res[0];   // Single object
    return res;
}