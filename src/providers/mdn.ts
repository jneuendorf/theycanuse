import { paramCase } from 'change-case'
import { version } from 'mdn-browser-compat-data/package.json'
import {
    CompatStatement,
    Identifier,
    PrimaryIdentifier,
    SupportStatement,
} from 'mdn-browser-compat-data/types'
import { SemVer } from 'semver'

import {
    NormalizedData,
    FeatureData,
    BrowserSupport,
    Status,
    VersionRange,
} from '../types/data'
import { AbstractProvider } from './abstract'
import { unknownStatus, parsedSemVer } from './util'


// type FeatureName = Exclude<string, '__compat'>
// NOTE: `keyof CompatDataIdentifiers` is not strict enough
// type Category = (
//     'api'
//     | 'css'
//     | 'html'
//     | 'http'
//     | 'javascript'
//     | 'mathml'
//     | 'svg'
//     | 'webdriver'
//     | 'webextensions'
//     | 'xpath'
//     | 'xslt'
// )
type Features = { [feature: string]: CompatStatement }


function browserHasSupportStatement(
    entry: [string, SupportStatement | void]
): entry is [string, SupportStatement] {
    const [, support] = entry
    return support != null
}


export class MdnProvider extends AbstractProvider {
    constructor() {
        super('mdn', version)
    }

    async normalizedData(): Promise<NormalizedData> {
        const compatData = await import('mdn-browser-compat-data')
        const { javascript } = compatData
        const features = this.getCompatObjects(javascript)
        // console.log(features)

        // console.log(features['trailing-commas'].support)
        const entries = (
            Object.entries(features)
                .map(([feature, compat]): [string, FeatureData] => {
                    console.log(feature)
                    const support: BrowserSupport = Object.fromEntries(
                        Object.entries(compat.support)
                            .filter(browserHasSupportStatement)
                            .map(([browser, support]) => [
                                browser,
                                this.getVersionRanges(support),
                            ])
                    )
                    const status: Status = (
                        compat.status
                            ? {
                                deprecated: compat.status.deprecated,
                                experimental: compat.status.experimental,
                                standardTrack: compat.status.standard_track,
                            }
                            : unknownStatus()
                    )
                    const urls = (
                        compat.mdn_url
                            ? [compat.mdn_url]
                            : []
                    )

                    return [feature, {
                        support,
                        status,
                        urls,
                    }]
                })
        )
        const normalizedData: NormalizedData = Object.fromEntries(entries)
        return normalizedData
    }

    private getCompatObjects(primaryIdentifier: PrimaryIdentifier): Features {
        const features: Features = {}
        for (const [feature, identifier] of Object.entries(primaryIdentifier)) {
            if (feature !== 'grammar') {
                continue
            }
            Object.assign(
                features,
                this.getFeatures(feature, identifier)
            )
        }
        return features
    }

    private getFeatures(feature: string, identifier: Identifier): Features {
        const features: Features = {}
        const { __compat, ...rest } = identifier
        if (__compat) {
            features[feature] = __compat
        }
        for (const [subFeature, subIdentifier] of Object.entries(rest)) {
            Object.assign(
                features,
                this.getFeatures(paramCase(subFeature), subIdentifier)
            )
        }
        return features
    }

    private getVersionRanges(support: SupportStatement): VersionRange[] {
        if (!Array.isArray(support)) {
            support = [support]
        }

        const versionRanges: VersionRange[] = []
        for (const simpleSupport of support) {
            const {
                version_added: versionAdded,
                version_removed: versionRemoved,
                ...info
            } = simpleSupport
            let added: SemVer | null = null
            let removed: SemVer | null = null
            if (typeof versionAdded === 'string') {
                added = parsedSemVer(versionAdded)
            }
            if (typeof versionRemoved === 'string') {
                removed = parsedSemVer(versionRemoved)
            }

            if (added) {
                let range
                if (removed) {
                    range = `>=${added.version} <=${removed.version}`
                }
                else {
                    range = `>=${added.version}`
                }

                const versionRange: VersionRange = { versions: range }
                if (Object.keys(info).length > 0) {
                    versionRange.notes = JSON.stringify(info, undefined, 4)
                }
                versionRanges.push(versionRange)
            }
        }
        return versionRanges
    }
}
