// import * as t from '@babel/types'
import { Node } from '@babel/types'
import { parse } from '@babel/parser'
import traverse, { Visitor, NodePath } from '@babel/traverse'

import { AbstractAnalyzer, Recognizer } from '../abstract'
import * as featureRecognizers from './feature-recognizers'


export type BabelRecognizer = Recognizer<Node, NodePath>

// Type assertion
const typedFeatureRecognizers = (
    featureRecognizers as {[feature: string]: BabelRecognizer}
)


export class BabelAnalyzer extends AbstractAnalyzer<Node, NodePath> {
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
                this.visit(path.node, path)
            },
        }
        // parent, opts, scope, state, parentPath
        traverse(ast, visitor)
    }

    getRecognizer(feature: string): Recognizer<Node, NodePath> | void {
        return typedFeatureRecognizers[feature]
    }
}
