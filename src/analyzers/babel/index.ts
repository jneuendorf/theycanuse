// import * as t from '@babel/types'
import { Node } from '@babel/types'
import { parse } from '@babel/parser'
import traverse, { Visitor, NodePath, Scope } from '@babel/traverse'

import { AbstractAnalyzer, NodeMetaData, Recognizer } from '../abstract'
import * as featureRecognizers from './feature-recognizers'


export type BabelRecognizer = Recognizer<NodeMetaData<Node, NodePath, Scope>>

// Type assertion
const typedFeatureRecognizers = (
    featureRecognizers as {[feature: string]: BabelRecognizer}
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

    getRecognizer(feature: string): BabelRecognizer | void {
        return typedFeatureRecognizers[feature]
    }
}
