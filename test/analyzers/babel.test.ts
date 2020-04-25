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
            `async function* asyncGenerator() {
                let i = 0;
                while (i < 3) {
                    yield i++;
                }
            }`,
            'async-iterations-and-generators'
        )


        // const functionDeclaration = await analyze(
        //     `async function* asyncGenerator() {
        //         let i = 0;
        //         while (i < 3) {
        //             yield i++;
        //         }
        //     }`
        // )
        // const functionDeclaration = await analyze(
        //     `const asyncGenerator2 = async function* () {
        //         let i = 0;
        //         while (i < 3) {
        //             yield i++;
        //         }
        //     }`
        // )
        // console.log(functionDeclaration)
        // expect(functionDeclaration['async-functions']).not.toBeUndefined()
        // const functionExpression = await analyze(`g = async function () {}`)
        // expect(functionExpression['async-functions']).not.toBeUndefined()
        // const arrowFunctionExpression = await analyze(`const h = async () => {}`)
        // expect(arrowFunctionExpression['async-functions']).not.toBeUndefined()
    })
})
