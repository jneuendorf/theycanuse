// import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _abortcontroller: BabelDetector = function({ node }): boolean {
    // const a = fetch
    // TODO: check for non-member 'new AbortController()')

    // if (t.isStringLiteral(node)) {
    //     const { parent, parentPath } = nodePath
    //
    //     // <? ?=".*\.aac" />
    //     if (t.isJSXAttribute(parent) && node.value.endsWith(".aac")) {
    //         // <? src=".*\.aac" />
    //         if (t.isJSXIdentifier(parent.name) && parent.name.name === 'src') {
    //             // <? src=".*\.aac"></?>
    //             if (t.isJSXOpeningElement(parentPath.parent)) {
    //                 // <audio src=".*\.aac"></audio>
    //                 if (t.isJSXIdentifier(parentPath.parent.name)) {
    //                     return parentPath.parent.name.name === 'audio'
    //                 }
    //             }
    //         }
    //     }
    // }
    return node && false
}
