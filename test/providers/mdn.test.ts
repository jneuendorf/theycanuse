import { MdnProvider } from '../../src/providers'


describe('MdnProvider', () => {
    it('consolidates raw data correctly', async () => {
        const provider = new MdnProvider()
        // const data = await provider.normalizedData()
        const data = await provider.getData()
        console.log(data)
        // Test IE because it's maintained only.
        // Therefore, no new major versions will appear.
        // expect(data.aac.support.ie).toEqual(['>=9.0.0'])
    })
})
