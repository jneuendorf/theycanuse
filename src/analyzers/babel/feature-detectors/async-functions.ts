import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const asyncFunctions: BabelDetector = function({ node }): boolean {
    if (
        t.isArrowFunctionExpression(node)
        || t.isFunctionDeclaration(node)
        || t.isFunctionExpression(node)
    ) {
        return node.async
    }
    return false
}
