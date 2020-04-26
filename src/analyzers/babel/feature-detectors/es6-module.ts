import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _es6Module: BabelDetector = function({ node }): boolean {
    /*
    import def, {a} from 'a'
    export default def
    export {a}
    */
    return (
        t.isImportDeclaration(node)
        || t.isExportDefaultDeclaration(node)
        || t.isExportNamedDeclaration(node)
    )
}
