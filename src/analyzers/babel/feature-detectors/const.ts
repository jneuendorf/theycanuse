import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _const: BabelDetector = function({ node }): boolean {
    /*
    const a = 1
    */
    if (t.isVariableDeclaration(node)) {
        return node.kind === 'const'
    }
    return false
}
