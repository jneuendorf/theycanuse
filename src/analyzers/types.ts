import { BrowserSupport } from '../types/data'

/*
Generic subset of node_modules/@types/babel__traverse/index.d.ts > NodePath

ESLint: https://github.com/eslint/eslint/blob/33efd71d7c3496b4b9cbfe006280527064940826/lib/linter/linter.js#L851-L926
*/
export interface NodeMetaData<Node, NodePath, Scope> {
    node: Node
    nodePath: NodePath
    scope: Scope
    parent: Node
    parentPath: NodePath
    opts?: object
}

export type Features = {
    [feature: string]: {
        [provider: string]: BrowserSupport,
    },
}
export type Detector<NodeMetaData> = (metaData: NodeMetaData) => boolean
