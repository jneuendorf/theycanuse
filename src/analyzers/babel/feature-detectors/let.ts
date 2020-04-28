import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _let: BabelDetector = function({ node }): boolean {
    /*
    let a = 1
    */
    if (t.isVariableDeclaration(node)) {
        return node.kind === 'let'
    }
    return false
}
