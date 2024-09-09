# json-string
Library for passing JSON structures in plain string.

This library was created for the purpose of creating 
JSON [Converter](https://docs.asciidoctor.org/asciidoctorj/latest/write-converter/) 
for [AsciiDoctorJ](https://asciidoctor.org/docs/asciidoctorj/).
By default, AsciiDoctorJ works with plain text (`string`) and does not support
other types are not supported by converters.

The idea is to espace JSON string with non-printable characters (start: `\0`, end:`\u0001`)
and then parse it back to JSON object.

This library provides two methods:
- `parse`,
- `stringify`.

## Installation
```shell
npm install json-string
```

## Usage
```javascript
const { parse, stringify } = require('json-string');

const str='Plain string' + stringify({a: 1, b: '2', c: [3, 4, 5]}) + '. More text';

console.log(str);
// Plain string{"a":1,"b":"2","c":[3,4,5]}. More text
console.log(parse(str));
// [ 'Plain string', { a: 1, b: '2', c: [ 3, 4, 5 ] }, '. More text' ]
```