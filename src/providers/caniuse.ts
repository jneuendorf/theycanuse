import caniusePkg from 'caniuse-db/package.json'
import { SemVer } from 'semver'
import * as semver from 'semver'

import {
    NormalizedData,
    BrowserSupport,
    BrowserSupportEntries,
    BrowserSupportEntry,
    VersionRanges,
} from '../types-data'
import { AbstractProvider } from './abstract'
import { isSupported } from '../support-types'

type Stats = { [key: string]: Versions }
type Versions = { [key: string]: string }

function isParseableSemVer(
    entry: [SemVer | null, string],
): entry is [SemVer, string] {
    return entry[0] instanceof SemVer
}

/*
Loading the cache file takes approximately 1%
compared to loading and processing 'caniuse-db'.
*/
export class CaniuseProvider extends AbstractProvider {
    constructor() {
        super('caniuse', caniusePkg.version)
    }

    async normalizedData(): Promise<NormalizedData> {
        const caniuse = await import('caniuse-db/data.json')
        const data = (
            Object.entries(caniuse.data)
                .map(([feature, data]): [string, BrowserSupport] => {
                    const stats: Stats = data.stats
                    const browserSupportEntries: BrowserSupportEntries = (
                        Object.entries(stats)
                            .map((
                                [browser, versions]: [string, Versions]
                            ): BrowserSupportEntry => {
                                const relevantVersions: Array<[SemVer, string]> = (
                                    Object.entries(versions)
                                        // Parse semantic version string and
                                        // remove status annotations, e.g. 'a #1 => 'a'
                                        .map(
                                            ([version, support]): [SemVer | null, string] => [
                                                semver.coerce(version),
                                                support.charAt(0),
                                            ])
                                        // Filter unparseable versions.
                                        .filter(isParseableSemVer)
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
                            })
                    )

                    return [feature, Object.fromEntries(browserSupportEntries)]
                })
        )
        return Object.fromEntries(data)
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
        sortedVersions: Array<[SemVer, string]>,
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
