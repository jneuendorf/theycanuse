import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _es6Generators: BabelDetector = function({ node }): boolean {
    /*
    function* generator() {
        let i = 0;
        while (i < 3) {
            yield i++;
        }
    }
    const asyncGenerator2 = function* () {
        let i = 0;
        while (i < 3) {
            yield i++;
        }
    }
    */
    if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
        return node.generator
    }
    return false
}
