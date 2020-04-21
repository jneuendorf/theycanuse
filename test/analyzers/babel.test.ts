import { BabelAnalyzer } from '../../src/analyzers/babel'
import { instances as providers } from '../../src/providers'


describe('BabelAnalyzer', () => {
    it('TODO', async () => {
        const babelAnalyzer = new BabelAnalyzer(providers)
        const features = await babelAnalyzer.analyzeFeatures(`
const f = (a, b) => a + b
        `)
        console.log(features)
        console.log(features['arrow-functions'])
    })
})
