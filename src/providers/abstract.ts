import fs from 'fs-extra'
import path from 'path'

import { NormalizedData } from '../types/data'


export abstract class AbstractProvider {
    readonly name: string
    private cacheFile: string

    constructor(name: string, version: string) {
        this.name = name
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
