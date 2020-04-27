// import * as t from '@babel/types'
import { Node } from '@babel/types'
import { parse } from '@babel/parser'
import traverse, { Visitor, NodePath, Scope } from '@babel/traverse'

import { AbstractAnalyzer } from '../abstract'
import { NodeMetaData, Detector } from '../types'
import * as featureDetectors from './feature-detectors'


export { Node, NodePath, Scope }
export type BabelNodeMetaData = NodeMetaData<Node, NodePath, Scope>
export type BabelDetector = Detector<BabelNodeMetaData>


// Type assertion
const typedFeatureDetectors = (
    featureDetectors as {[feature: string]: BabelDetector}
)


export class BabelAnalyzer extends AbstractAnalyzer<Node, NodePath, Scope> {
    parse(code: string): Node {
        // TODO: Make options configurable from command line
        return parse(code, {
            sourceType: "unambiguous",
            plugins: [
                "jsx",
            ],
        })
    }

    traverse(ast: Node): void {
        const visitor: Visitor = {
            enter: (path) => {
                const metaData = { nodePath: path, ...path }
                this.visit(metaData)
            },
        }
        // parent, opts, scope, state, parentPath
        traverse(ast, visitor)
    }

    getDetector(feature: string): BabelDetector | void {
        return typedFeatureDetectors[`_${feature}`]
    }
}
