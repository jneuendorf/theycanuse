import * as t from '@babel/types'

import { BabelRecognizer } from '../index'


export const aac: BabelRecognizer = function({ node, nodePath }): boolean {
    if (t.isStringLiteral(node)) {
        const { parent, parentPath } = nodePath

        // <? ?=".*\.aac" />
        if (t.isJSXAttribute(parent) && node.value.endsWith(".aac")) {
            // <? src=".*\.aac" />
            if (t.isJSXIdentifier(parent.name) && parent.name.name === 'src') {
                // <? src=".*\.aac"></?>
                if (t.isJSXOpeningElement(parentPath.parent)) {
                    // <audio src=".*\.aac"></audio>
                    if (t.isJSXIdentifier(parentPath.parent.name)) {
                        return parentPath.parent.name.name === 'audio'
                    }
                }
            }
        }
    }
    return false
}
