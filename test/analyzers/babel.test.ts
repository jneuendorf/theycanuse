import { Features } from '../../src/analyzers/abstract'
import { BabelAnalyzer } from '../../src/analyzers/babel'
import { instances as providers } from '../../src/providers'


const babelAnalyzer = new BabelAnalyzer(
    providers,
    // new Set<string>(['async-iterations-and-generators'])
)

function analyze(code: string): Promise<Features> {
    return babelAnalyzer.analyzeFeatures(code)
}

async function expectCodeUsesFeature(code: string, feature: string): Promise<void> {
    const browserSupport = await analyze(code)
    expect(browserSupport[feature]).not.toBeUndefined()
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
})
