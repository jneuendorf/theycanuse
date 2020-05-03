/*
{
    'arrow-function': {
        support: {
            ie: ['8.0.0 - 10.4.3', '>= 12'],
        },
        status: {deprecated: false, experimental: false, standard_track: false}
    },
}
*/
export type NormalizedData = {
    [feature: string]: FeatureData,
}
export type FeatureData = {
    support: BrowserSupport,
    status: Status,
    urls: string[],
}

export type BrowserSupport = {
    [browser: string]: VersionRanges,
}
export type BrowserSupportEntries = BrowserSupportEntry[]
export type BrowserSupportEntry = [string, VersionRanges]
export type VersionRanges = VersionRange[]
export type VersionRange = {versions: string, notes?: string}

// See `StatusBlock` in node_modules/mdn-browser-compat-data/types.d.ts
export type Status = {
    deprecated: boolean | null,
    experimental: boolean | null,
    standardTrack: boolean | null,
}
