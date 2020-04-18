import fs from 'fs-extra'
import path from 'path'


/*
{
    'arrow-function': {
        'ie': ['8.0.0 - 10.4.3', '>= 12'],
    },
}
*/
export type NormalizedData = {
    [feature: string]: BrowserSupport,
}
export type BrowserSupport = {
    [browser: string]: VersionRanges,
}
export type BrowserSupportEntries = Array<BrowserSupportEntry>
export type BrowserSupportEntry = [string, VersionRanges]
export type VersionRanges = Array<string>


export abstract class Provider {
    // TODO: Waiting for prettier@2 in tsdx in order to use private fields.
    cacheFile: string

    constructor(name: string, version: string) {
        this.cacheFile = path.join(__dirname, name, `${version}.json`)
    }

    abstract async normalizedData(): Promise<NormalizedData>

    async getData(): Promise<NormalizedData> {
        let data: NormalizedData
        if (fs.existsSync(this.cacheFile)) {
            data = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'))
        }
        else {
            data = await this.normalizedData()
            this.cache(data)
        }
        return data
    }

    private async cache(data: NormalizedData): Promise<void> {
        if (!fs.existsSync(this.cacheFile)) {
            await fs.ensureFile(this.cacheFile)
            await fs.writeJson(this.cacheFile, data)
        }
    }
}
