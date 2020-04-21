import * as t from '@babel/types'
// import { Node } from '@babel/types'

import { BabelRecognizer } from '../index'


// https://astexplorer.net/#/gist/ac8f6d9c480debbd2fd4e06f78a0bf3e/6a4b61b6f3186d56d114600ce870b28a34847ca3
export const aac: BabelRecognizer = function(node, nodePath): boolean {
    if (t.isStringLiteral(node)) {
        const { parent, parentPath } = nodePath
        return (
            node.value.endsWith(".aac")
            && t.isJSXAttribute(parent)
            && t.isJSXIdentifier(parent.name)
            && parent.name.name === 'src'
            && t.isJSXIdentifier(parentPath.parent)
            && parentPath.parent.name === 'audio'
        )
    }
    return false
}
