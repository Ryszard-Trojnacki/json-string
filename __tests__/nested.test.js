import { parse, stringify } from '../src/index.mjs'

test('simpleNestedTest', () => {
    const point={ x: 10, y: 100 };
    const obj={ type: 'Point', value: `Prefix $point Suffix` };
    const str=stringify(obj);
    const strPoint=stringify(point);
    const final=str.replace('$point', strPoint);    // AsciiDoctor does such replacement
    console.log("Str: ", JSON.stringify(final));
    console.log("Parsed: ", parse(final));
    expect(parse(final)).toStrictEqual({
        type: 'Point',
        value: [ 'Prefix ', point, ' Suffix' ]
    });
})

test('lastNestedTest', () => {
    const point={ x: 10, y: 100 };
    const obj={ type: 'Point', value: `Prefix $point` };
    const str=stringify(obj);
    const strPoint=stringify(point);
    const final=str.replace('$point', strPoint);    // AsciiDoctor does such replacement
    console.log("Str: ", JSON.stringify(final));
    console.log("Parsed: ", parse(final));
    expect(parse(final)).toStrictEqual({
        type: 'Point',
        value: [ 'Prefix ', point ]
    });
});

test('firstNestedTest', () => {
    const point={ x: 10, y: 100 };
    const obj={ type: 'Point', value: `$point Suffix` };
    const str=stringify(obj);
    const strPoint=stringify(point);
    const final=str.replace('$point', strPoint);    // AsciiDoctor does such replacement
    console.log("Str: ", JSON.stringify(final));
    console.log("Parsed: ", parse(final));
    expect(parse(final)).toStrictEqual({
        type: 'Point',
        value: [ point, ' Suffix' ]
    });

});

test('nestedTest', () => {
    const point={ x: 10, y: 100 };
    const obj={ type: 'Point', value: `Prefix $point Suffix` };
    const parentObj={ type: 'Parent', value: 'Before $obj+after' };

    let str="A: "+stringify(parentObj)+", B: null";
    str=str.replace('$obj', stringify(obj));
    str=str.replace('$point', stringify(point));
    console.log("NestedStr: ", str);
    console.log("Parsed: ", JSON.stringify(parse(str), null, 2));

    expect(parse(str)).toStrictEqual([
        "A: ",
        {
            type: 'Parent',
            value: [
                'Before ',
                {
                    type: 'Point',
                    value: ['Prefix ', point, ' Suffix']
                },
                '+after'
            ]
        },
        ", B: null"
    ]);

});