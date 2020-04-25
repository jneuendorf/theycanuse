// import * as t from '@babel/types'
import { Node } from '@babel/types'
import { parse } from '@babel/parser'
import traverse, { Visitor, NodePath, Scope } from '@babel/traverse'

import { AbstractAnalyzer, NodeMetaData, Detector } from '../abstract'
import * as featureDetectors from './feature-detectors'


export type BabelDetector = Detector<NodeMetaData<Node, NodePath, Scope>>

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
            // ArrowFunctionExpression: (
            //     // path: NodePath<t.ArrowFunctionExpression>,
            //     path,
            //     // state
            // ) => {
            //     this.visit(path.node, path)
            // },
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
