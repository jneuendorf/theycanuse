import path from 'path'

import fs from 'fs-extra'
import { version } from 'caniuse-db/package.json'
import { SemVer } from 'semver'
import * as semver from 'semver'

import {
    NormalizedData,
    FeatureData,
    BrowserSupport,
    BrowserSupportEntry,
    VersionRanges,
} from '../types/data'
import { AbstractProvider } from './abstract'
import { unknownStatus, parsedSemVer } from './util'
import { isSupported } from '../support-types'


type CaniuseFeatureData = {
    stats: Stats,
    links: { url: string, title: string }[],
}
type Stats = { [key: string]: Versions }
type Versions = { [key: string]: string }


/*
Loading the cache file takes approximately 1%
compared to loading and processing 'caniuse-db'.
*/
export class CaniuseProvider extends AbstractProvider {
    private SPECIAL_VERSIONS = new Set(['TP', 'all'])

    constructor() {
        super('caniuse', version)
    }

    async normalizedData(): Promise<NormalizedData> {
        const jsonFiles = await fs.readdir('node_modules/caniuse-db/features-json')
        const caniuseData = await Promise.all(
            jsonFiles.map(
                async (jsonFile): Promise<[string, CaniuseFeatureData]> => {
                    const data: CaniuseFeatureData = await import(
                        `caniuse-db/features-json/${jsonFile}`
                    )
                    return [path.basename(jsonFile, '.json'), data]
                }
            )
        )
        return Object.fromEntries(
            caniuseData
                .map(([feature, data]): [string, FeatureData] => {
                    const support: BrowserSupport = Object.fromEntries(
                        Object.entries(data.stats)
                            .map(entry => this.getBrowserSupportEntry(...entry))
                    )
                    const featureData: FeatureData = {
                        support,
                        status: unknownStatus(),
                        urls: data.links.map(({ url }) => url)
                    }
                    return [feature, featureData]
                })
        )
    }

    private getBrowserSupportEntry(browser: string, versions: Versions): BrowserSupportEntry {
        const relevantVersions: [SemVer, string][] = (
            Object.entries(versions)
                // Ignore some of caniuse's special version strings
                .filter(([version]) => !this.SPECIAL_VERSIONS.has(version))
                // Parse semantic version string and
                // remove status annotations, e.g. 'a #1 => 'a'
                .map(
                    ([version, support]): [SemVer, string] => {
                        return [
                            parsedSemVer(version),
                            support.charAt(0),
                        ]
                    })
        )
        const sortedVersions = relevantVersions.sort(
            (
                [v1]: [SemVer, string],
                [v2]: [SemVer, string],
            ) => this.compareVersions(v1, v2),
        )
        return [
            browser,
            this.getSupportingVersionRanges(sortedVersions),
        ]
    }

    private compareVersions(v1: SemVer, v2: SemVer): number {
        if (semver.lt(v1, v2)) {
            return -1
        }
        if (semver.gt(v1, v2)) {
            return 1
        }
        return 0
    }

    private getSupportingVersionRanges(
        sortedVersions: [SemVer, string][],
    ): VersionRanges {
        const supportingVersionRanges: VersionRanges = []
        const n = sortedVersions.length
        let i = 0
        let j: number
        while (i < n) {
            // Find first item with supporting version.
            while (i < n - 1 && !isSupported(sortedVersions[i][1])) {
                i++
            }
            // No version has support.
            if (!isSupported(sortedVersions[i][1])) {
                break
            }

            j = i
            // Find last item with supporting version.
            while (j < n - 1 && isSupported(sortedVersions[j][1])) {
                j++
            }

            const [{ version: minVersion }] = sortedVersions[i]
            if (i === j) {
                supportingVersionRanges.push(minVersion)
            }
            else {
                const [{ version: maxVersion }] = sortedVersions[j]
                // maxVersion is the last available version, thus we don't use an upper version bound.
                // Example:
                //  Versions = [9: 'n', 10: 'y', 11: 'y']
                //  supportingVersionRange = '>= 10.0.0'
                //  instead '>= 10.0.0 <= 11.0.0'
                if (j === n - 1) {
                    supportingVersionRanges.push(`>=${minVersion}`)
                }
                else {
                    supportingVersionRanges.push(
                        `>=${minVersion} <=${maxVersion}`,
                    )
                }
            }

            i = j + 1
        }

        return supportingVersionRanges
    }
}
