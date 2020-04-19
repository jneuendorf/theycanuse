// @flow

export const RawSupportTypes: { [key: string]: string } = {
    u: 'UNKNOWN',
    n: 'NO',
    a: 'PARTIAL',
    y: 'YES',
}
export const SupportTypes: { [key: string]: number } = {
    UNKNOWN: 0,
    NO: 1,
    PARTIAL: 2,
    YES: 3,
}

function getType(raw: string): number {
    return SupportTypes[RawSupportTypes[raw.charAt(0)]]
}

/*
@param type: number | string
    Either one of the 'SupportTypes' or 'RawSupportTypes'
*/
function _isSupported(type: number | string, level: number): boolean {
    if (typeof type === 'string') {
        type = getType(type)
    }
    return type >= level
}

export function isSupported(type: number | string): boolean {
    return _isSupported(type, SupportTypes.PARTIAL)
}

export function strictIsSupported(type: number | string): boolean {
    return _isSupported(type, SupportTypes.YES)
}
