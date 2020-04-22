import { Features } from '../../src/analyzers/abstract'
import { BabelAnalyzer } from '../../src/analyzers/babel'
import { instances as providers } from '../../src/providers'


describe('BabelAnalyzer', () => {
    const babelAnalyzer = new BabelAnalyzer(providers)
    const analyze = (code: string): Promise<Features> => babelAnalyzer.analyzeFeatures(code)

    test('aac', async () => {
        const features = await analyze(
            `const jsx = <audio controls src="/media/sound.aac"></audio>`
        )
        expect(features['aac']).not.toBeUndefined()
    })

    test('arrow-functions', async () => {
        const features = await analyze(`const f = (a, b) => a + b`)
        expect(features['arrow-functions']).not.toBeUndefined()
    })
})
