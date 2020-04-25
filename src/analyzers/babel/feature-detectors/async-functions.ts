import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _asyncFunctions: BabelDetector = function({ node }): boolean {
    /*
    async function f() {}
    g = async function () {}
    const h = async () => {}
    */
    if (
        t.isArrowFunctionExpression(node)
        || t.isFunctionDeclaration(node)
        || t.isFunctionExpression(node)
    ) {
        return node.async
    }
    return false
}
