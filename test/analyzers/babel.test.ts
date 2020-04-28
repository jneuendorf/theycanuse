import { Features } from '../../src/analyzers/types'
import { BabelAnalyzer } from '../../src/analyzers/babel'
import { instances as providers } from '../../src/providers'


const babelAnalyzer = new BabelAnalyzer(
    providers,
    // new Set<string>(['es6-number'])
)

function analyze(code: string): Promise<Features> {
    return babelAnalyzer.analyzeFeatures(code)
}

async function expectCodeUsesFeature(code: string, feature: string): Promise<void> {
    const browserSupport = await analyze(code)
    expect(browserSupport[feature]).not.toBeUndefined()
}
async function expectNotCodeUsesFeature(code: string, feature: string): Promise<void> {
    const browserSupport = await analyze(code)
    expect(browserSupport[feature]).toBeUndefined()
}



describe('BabelAnalyzer', () => {

    test('aac', async () => {
        await expectCodeUsesFeature(
            `const jsx = <audio controls src="/media/sound.aac"></audio>`,
            'aac'
        )
    })

    test('arrow-functions', async () => {
        await expectCodeUsesFeature(
            `const f = (a, b) => a + b`,
            'arrow-functions'
        )
    })

    test('async-functions', async () => {
        await expectCodeUsesFeature(
            `async function f() {}`,
            'async-functions'
        )
        await expectCodeUsesFeature(
            `g = async function () {}`,
            'async-functions'
        )
        await expectCodeUsesFeature(
            `const h = async () => {}`,
            'async-functions'
        )
    })

    test('async-iterations-and-generators', async () => {
        await expectCodeUsesFeature(
            `async function* asyncGenerator() {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'async-iterations-and-generators'
        )
        await expectCodeUsesFeature(
            `const asyncGenerator2 = async function* () {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'async-iterations-and-generators'
        )
        await expectCodeUsesFeature(
            `const asyncIterable = {
                [Symbol.asyncIterator]() {
                    return {
                        i: 0,
                        next() {
                            if (this.i < 3) {
                                return Promise.resolve({
                                    value: this.i++,
                                    done: false
                                });
                            }
                            return Promise.resolve({done: true});
                        }
                    };
                }
            };`,
            'async-iterations-and-generators'
        )
        await expectCodeUsesFeature(
            `(async function() {
                for await (let num of asyncIterable) {
                    console.log(num);
                }
            })();`,
            'async-iterations-and-generators'
        )
    })

    test('const', async () => {
        await expectCodeUsesFeature(
            `const a = 1`,
            'const'
        )
    })

    test('es6-class', async () => {
        await expectCodeUsesFeature(
            `class A {}`,
            'es6-class'
        )
        await expectCodeUsesFeature(
            `const a = class {}`,
            'es6-class'
        )
    })

    test('es6-generators', async () => {
        await expectCodeUsesFeature(
            `function* generator() {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'es6-generators'
        )
        await expectCodeUsesFeature(
            `const asyncGenerator2 = function* () {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'es6-generators'
        )
    })

    test('es6-module-dynamic-import', async () => {
        await expectCodeUsesFeature(
            `const lib = import('lib')`,
            'es6-module-dynamic-import'
        )
    })

    test('es6-module', async () => {
        await expectCodeUsesFeature(
            `import def, {a} from 'a'`,
            'es6-module'
        )
        await expectCodeUsesFeature(
            `export default def`,
            'es6-module'
        )
        await expectCodeUsesFeature(
            `const a = 2
            export {a}`,
            'es6-module'
        )
    })

    test('es6-number', async () => {
        function codeUsesEs6Number(code: string): Promise<void> {
            return expectCodeUsesFeature(code, 'es6-number')
        }

        await codeUsesEs6Number(`const a = 0b11`)
        await codeUsesEs6Number(`const b = 0o7`)
        // Number
        await codeUsesEs6Number(`Number.EPSILON`)
        await codeUsesEs6Number(`Number.isFinite(Infinity)`)
        await codeUsesEs6Number(`Number.isNaN(NaN)`)
        await codeUsesEs6Number(`Number.parseFloat('1.23')`)
        await codeUsesEs6Number(`Number.parseInt('11')`)
        await codeUsesEs6Number(`Number.isInteger(-17)`)
        await codeUsesEs6Number(`Number.isSafeInteger(18)`)
        await codeUsesEs6Number(`Number.MIN_SAFE_INTEGER`)
        await codeUsesEs6Number(`Number.MAX_SAFE_INTEGER`)
        // Math
        await codeUsesEs6Number(`Math.sign`)
        await codeUsesEs6Number(`Math.trunc`)
        await codeUsesEs6Number(`Math.cbrt`)
        await codeUsesEs6Number(`Math.expm1`)
        await codeUsesEs6Number(`Math.log1p`)
        await codeUsesEs6Number(`Math.log2`)
        await codeUsesEs6Number(`Math.log10`)
        await codeUsesEs6Number(`Math.fround`)
        await codeUsesEs6Number(`Math.imul`)
        await codeUsesEs6Number(`Math.clz32`)
        await codeUsesEs6Number(`Math.sinh`)
        await codeUsesEs6Number(`Math.cosh`)
        await codeUsesEs6Number(`Math.tanh`)
        await codeUsesEs6Number(`Math.asinh`)
        await codeUsesEs6Number(`Math.acosh`)
        await codeUsesEs6Number(`Math.atanh`)
        await codeUsesEs6Number(`Math.hypot`)

        // Non-global Number
        await expectNotCodeUsesFeature(
            `const Number = {
                isFinite() {},
                isNaN() {},
                parseFloat() {},
                parseInt() {},
                isInteger() {},
                isSafeInteger() {},
            }

            Number.EPSILON
            Number.isFinite(Infinity)
            Number.isNaN(NaN)
            Number.parseFloat('1.23')
            Number.parseInt('11')
            Number.isInteger(-17)
            Number.isSafeInteger(18)
            Number.MIN_SAFE_INTEGER
            Number.MAX_SAFE_INTEGER`,
            ''
        )
        // Non-global Math
        await expectNotCodeUsesFeature(
            `const Math = {
                sign() {},
                trunc() {},
                cbrt() {},
                expm1() {},
                log1p() {},
                log2() {},
                log10() {},
                fround() {},
                imul() {},
                clz32() {},
                sinh() {},
                cosh() {},
                tanh() {},
                asinh() {},
                acosh() {},
                atanh() {},
                hypot() {},
            }

            Math.sign(0)
            Math.trunc(3.1)
            Math.cbrt(8)
            Math.expm1(1e-10)
            Math.log1p(1e-16)
            Math.log2(8)
            Math.log10(100)
            Math.fround(1)
            Math.imul(1, 2)
            Math.clz32(2)
            Math.sinh(1)
            Math.cosh(1)
            Math.tanh(1)
            Math.asinh(1)
            Math.acosh(1)
            Math.atanh(1)
            Math.hypot(1)`,
            ''
        )
    })

    test('fetch', async () => {
        await expectCodeUsesFeature(
            `fetch('http://my.domain.com')`,
            'fetch'
        )
        await expectCodeUsesFeature(
            `const get = fetch
            get('http://my.domain.com')`,
            'fetch'
        )
        await expectNotCodeUsesFeature(
            `const fetch = () => {}
            fetch('http://my.domain.com')`,
            'fetch'
        )
    })

    test('let', async () => {
        await expectCodeUsesFeature(
            `let a = 1`,
            'let'
        )
        await expectNotCodeUsesFeature(
            `const a = 1`,
            'let'
        )
    })

    test('rest-parameters', async () => {
        await expectCodeUsesFeature(
            `function f(a, ...args) {}`,
            'rest-parameters'
        )
        await expectNotCodeUsesFeature(
            `function f(a, b) {}`,
            'rest-parameters'
        )
    })
})
