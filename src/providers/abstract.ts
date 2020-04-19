import fs from 'fs-extra'
import path from 'path'

import { NormalizedData } from './types'


export abstract class AbstractProvider {
    // TODO: Waiting for prettier@2 in tsdx in order to use private fields.
    cacheFile: string

    constructor(name: string, version: string) {
        this.cacheFile = path.join(__dirname, name, `${version}.json`)
    }

    abstract async normalizedData(): Promise<NormalizedData>

    async getData(): Promise<NormalizedData> {
        let data: NormalizedData
        if (await fs.pathExists(this.cacheFile)) {
            const fileContents = await fs.readFile(this.cacheFile, 'utf8')
            data = JSON.parse(fileContents)
        }
        else {
            data = await this.normalizedData()
            await this.cache(data)
        }
        return data
    }

    private async cache(data: NormalizedData): Promise<void> {
        if (!(await fs.pathExists(this.cacheFile))) {
            await fs.ensureFile(this.cacheFile)
            await fs.writeJson(this.cacheFile, data)
        }
    }
}
