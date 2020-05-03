import { CaniuseProvider } from '../../src/providers'


describe('CaniuseProvider', () => {
    it('consolidates raw data correctly', async () => {
        const provider = new CaniuseProvider()
        const data = await provider.normalizedData()
        // Test IE because it's maintained only.
        // Therefore, no new major versions will appear.
        expect(data.aac.support.ie).toEqual(['>=9.0.0'])
    })
})
