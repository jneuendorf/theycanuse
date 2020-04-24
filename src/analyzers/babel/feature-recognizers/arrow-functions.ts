import * as t from '@babel/types'

import { BabelRecognizer } from '../index'


export const arrowFunctions: BabelRecognizer = function({ node }): boolean {
    return t.isArrowFunctionExpression(node)
}
