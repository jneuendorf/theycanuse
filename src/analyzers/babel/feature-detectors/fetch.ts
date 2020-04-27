import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _fetch: BabelDetector = function({ node, scope }): boolean {
    return (
        t.isIdentifier(node)
        && node.name === 'fetch'
        && scope.hasGlobal('fetch')
    )
}
