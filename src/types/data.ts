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
