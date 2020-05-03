import { SemVer } from 'semver'
import * as semver from 'semver'

import { Status } from '../types/data'
import { ParseError } from '../errors'


export function unknownStatus(): Status {
    return {
        deprecated: null,
        experimental: null,
        standardTrack: null,
    }
}

export function parsedSemVer(version: string): SemVer {
    const coerced = semver.coerce(version)
    if (!(coerced instanceof SemVer)) {
        throw new ParseError(
            `Could parse sementic version ${version}`
        )
    }
    return coerced
}
