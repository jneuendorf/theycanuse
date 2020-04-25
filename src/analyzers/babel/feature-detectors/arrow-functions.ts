import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _arrowFunctions: BabelDetector = function({ node }): boolean {
    return t.isArrowFunctionExpression(node)
}
