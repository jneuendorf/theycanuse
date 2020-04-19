import { CaniuseProvider } from '../src/providers/caniuse'


describe('CaniuseProvider', () => {
    it('consolidates raw data correctly', async () => {
        const caniuseProvider = new CaniuseProvider()
        const data = await caniuseProvider.getData()
        // Test IE because it's maintained only.
        // Therefore, no new major versions will appear.
        expect(data.aac.ie).toEqual(['>=9.0.0'])
    })
})
