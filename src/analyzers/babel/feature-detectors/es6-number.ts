import * as t from '@babel/types'

import { BabelDetector } from '../index'
import { isAnyMemberOfGlobal } from '../utils'


interface NumericLiteral extends t.NumericLiteral {
    extra: {rawValue: number, raw: string}
}
function isNumericLiteral(node: object | null | undefined, opts?: object | null): node is NumericLiteral {
    return t.isNumericLiteral(node, opts)
}


export const _es6Number: BabelDetector = function({ node, scope }): boolean {
    /*
    const a = 0b11
    const b = 0o7
    */
    if (isNumericLiteral(node)) {
        const { raw } = node.extra
        return raw.startsWith('0b') || raw.startsWith('0o')
    }

    /*
    Source (linked from caniuse-db):
    https://2ality.com/2015/04/numbers-math-es6.htmlw
    */
    const numberProps = [
        'EPSILON',
        'isFinite', 'isNaN',
        'parseFloat', 'parseInt',
        'isInteger', 'isSafeInteger',
        'MIN_SAFE_INTEGER', 'MAX_SAFE_INTEGER',
    ]
    const mathProps = [
        'sign',
        'trunc',
        'cbrt',
        'expm1',
        'log1p', 'log2', 'log10',
        'fround',
        'imul',
        'clz32',
        'sinh', 'cosh', 'tanh',
        'asinh', 'acosh', 'atanh',
        'hypot',
    ]
    return (
        isAnyMemberOfGlobal(node, scope, 'Number', numberProps)
        || isAnyMemberOfGlobal(node, scope, 'Math', mathProps)
    )
}
