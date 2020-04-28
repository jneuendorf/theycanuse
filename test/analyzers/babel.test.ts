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

async function expectFeatureUsed(code: string, feature: string): Promise<void> {
    const browserSupport = await analyze(code)
    expect(browserSupport[feature]).not.toBeUndefined()
}
async function expectFeatureNotUsed(code: string, feature: string): Promise<void> {
    const browserSupport = await analyze(code)
    expect(browserSupport[feature]).toBeUndefined()
}



describe('language features', () => {
    test('arrow-functions', async () => {
        await expectFeatureUsed(
            `const f = (a, b) => a + b`,
            'arrow-functions'
        )
    })

    test('async-functions', async () => {
        await expectFeatureUsed(
            `async function f() {}`,
            'async-functions'
        )
        await expectFeatureUsed(
            `g = async function () {}`,
            'async-functions'
        )
        await expectFeatureUsed(
            `const h = async () => {}`,
            'async-functions'
        )
    })

    test('async-iterations-and-generators', async () => {
        await expectFeatureUsed(
            `async function* asyncGenerator() {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'async-iterations-and-generators'
        )
        await expectFeatureUsed(
            `const asyncGenerator2 = async function* () {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'async-iterations-and-generators'
        )
        await expectFeatureUsed(
            `(async function() {
                for await (let num of asyncIterable) {
                    console.log(num);
                }
            })();`,
            'async-iterations-and-generators'
        )
    })

    test('const', async () => {
        await expectFeatureUsed(
            `const a = 1`,
            'const'
        )
    })

    test('es6-class', async () => {
        await expectFeatureUsed(
            `class A {}`,
            'es6-class'
        )
        await expectFeatureUsed(
            `const a = class {}`,
            'es6-class'
        )
    })

    test('es6-generators', async () => {
        await expectFeatureUsed(
            `function* generator() {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'es6-generators'
        )
        await expectFeatureUsed(
            `const asyncGenerator2 = function* () {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'es6-generators'
        )
    })

    test('es6-module', async () => {
        await expectFeatureUsed(
            `import def, {a} from 'a'`,
            'es6-module'
        )
        await expectFeatureUsed(
            `export default def`,
            'es6-module'
        )
        await expectFeatureUsed(
            `const a = 2
            export {a}`,
            'es6-module'
        )
    })

    test('es6-number', async () => {
        await expectFeatureUsed(
            `const a = 0b11`,
            'es6-number'
        )
        await expectFeatureUsed(
            `const b = 0o7`,
            'es6-number'
        )
    })

    test('let', async () => {
        await expectFeatureUsed(
            `let a = 1`,
            'let'
        )
        await expectFeatureNotUsed(
            `const a = 1`,
            'let'
        )
    })

    test('rest-parameters', async () => {
        await expectFeatureUsed(
            `function f(a, ...args) {}`,
            'rest-parameters'
        )
        await expectFeatureNotUsed(
            `function f(a, b) {}`,
            'rest-parameters'
        )
    })
})




describe('JS APIs', () => {
    test('async-iterations-and-generators', async () => {
        await expectFeatureUsed(
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
    })

    test('es6-module-dynamic-import', async () => {
        await expectFeatureUsed(
            `const lib = import('lib')`,
            'es6-module-dynamic-import'
        )
    })

    test('es6-number', async () => {
        function codeUsesEs6Number(code: string): Promise<void> {
            return expectFeatureUsed(code, 'es6-number')
        }

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
        await expectFeatureNotUsed(
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
            'es6-number'
        )
        // Non-global Math
        await expectFeatureNotUsed(
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
            'es6-number'
        )
    })

    test('fetch', async () => {
        await expectFeatureUsed(
            `fetch('http://my.domain.com')`,
            'fetch'
        )
        await expectFeatureUsed(
            `const get = fetch
            get('http://my.domain.com')`,
            'fetch'
        )
        await expectFeatureNotUsed(
            `const fetch = () => {}
            fetch('http://my.domain.com')`,
            'fetch'
        )
    })
})




describe('media', () => {
    test('aac', async () => {
        await expectFeatureUsed(
            `const jsx = <audio controls src="/media/sound.aac"></audio>`,
            'aac'
        )
    })
})
