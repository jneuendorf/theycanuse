import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _es6Class: BabelDetector = function({ node }): boolean {
    /*
    class A {}
    const a = class {}
    */
    if (t.isClassDeclaration(node) || t.isClassExpression(node)) {
        return true
    }
    return false
}
