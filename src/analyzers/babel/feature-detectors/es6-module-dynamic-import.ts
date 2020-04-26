import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _es6ModuleDynamicImport: BabelDetector = function({ node }): boolean {
    /*
    const lib = import('lib')
    */
    return t.isImport(node)
}
