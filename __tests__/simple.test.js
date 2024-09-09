import { parse, stringify } from '../src/index.mjs'

test('passTroughTextTest', () => {
    expect(parse('')).toBe('');
    expect(parse('abc')).toBe('abc');
    expect(parse('abc\ndef')).toBe('abc\ndef');
    expect(parse('   abc\n\tdef')).toBe('   abc\n\tdef');
});

test('stringifyParseTest', () => {
    expect(parse(stringify('abc'))).toBe('abc');
    expect(parse(stringify('abc\ndef'))).toBe('abc\ndef');
    expect(parse(stringify(1234))).toBe(1234);
    expect(parse(stringify(-1234.04))).toBe(-1234.04);
    expect(parse(stringify(true))).toBe(true);
    expect(parse(stringify(false))).toBe(false);
    expect(parse(stringify(null))).toBe(null);
    expect(parse(stringify([]))).toStrictEqual([]);
    expect(parse(stringify([1,2,3]))).toStrictEqual([1,2,3]);
    expect(parse(stringify({a:1,b:2}))).toStrictEqual({a:1,b:2});
    expect(parse(stringify({a:1,b:[1,2]}))).toStrictEqual({a:1,b:[1,2]});
})

test('combinedTest', () => {
    let str='Some text'+stringify({ x: 10, y: 100 })+'. More text';
    let res=parse(str);
    expect(res.length).toBe(3);
    expect(res[0]).toBe('Some text');
    expect(res[1]).toStrictEqual({ x: 10, y: 100 });
    expect(res[2]).toBe('. More text');

    str='Some text'+stringify({ x: 10, y: 100 });
    res=parse(str);
    expect(res.length).toBe(2);
    expect(res[0]).toBe('Some text');
    expect(res[1]).toStrictEqual({ x: 10, y: 100 });

    str=stringify({ x: 10, y: 100 })+'. More text';
    res=parse(str);
    expect(res.length).toBe(2);
    expect(res[0]).toStrictEqual({ x: 10, y: 100 });
    expect(res[1]).toBe('. More text');
})

test('parseNotStringTest', () => {
    expect(parse(null)).toBe(null);
    expect(parse(undefined)).toBe(undefined);
    expect(parse(123)).toBe(123);
    expect(parse(true)).toBe(true);
    expect(parse(false)).toBe(false);
    expect(parse([])).toStrictEqual([]);
    expect(parse([1,2,3])).toStrictEqual([1,2,3]);
    expect(parse({a:1,b:2})).toStrictEqual({a:1,b:2});
    expect(parse({a:1,b:[1,2]})).toStrictEqual({a:1,b:[1,2]});
});

test('complexTest', () => {
    const point={ x: 10, y: 100 };
    const str1=stringify(point);
    const obj={ pos: parse(str1), t: 'Point' };
    const str2='Prefix '+stringify(obj)+' sep '+stringify(point)+'end';
    const res=parse(str2);
    expect(res.length).toBe(5);
    expect(res[0]).toBe('Prefix ');
    expect(res[1]).toStrictEqual(obj);
    expect(res[2]).toStrictEqual(' sep ');
    expect(res[3]).toStrictEqual(point);
    expect(res[4]).toStrictEqual('end');
});

test('logTest', () => {
    const str='Plain string' + stringify({a: 1, b: '2', c: [3, 4, 5]}) + '. More text';

    console.log(str);
    const res=parse(str);
    console.log(res);
    expect(res.length).toBe(3);
    expect(res[0]).toBe('Plain string');
    expect(res[1]).toStrictEqual({a: 1, b: '2', c: [3, 4, 5]});
    expect(res[2]).toBe('. More text');

})