import * as t from '@babel/types'
// import { Node } from '@babel/types'

import { BabelRecognizer } from '../index'


export const arrowFunctions: BabelRecognizer = function(node, _nodePath): boolean {
    return t.isArrowFunctionExpression(node)
}
