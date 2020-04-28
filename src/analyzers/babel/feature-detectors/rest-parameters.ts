import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _restParameters: BabelDetector = function({ node }): boolean {
    /*
    function f(a, ...args) {}
    */
    return t.isRestElement(node)
}
