import * as t from '@babel/types'

import { Node, Scope } from './index'


export function isAnyMemberOfGlobal(
    node: Node,
    scope: Scope,
    nameOfGlobal: string,
    properties: string[],
): boolean {
    if (t.isMemberExpression(node)) {
        // Of `a.b.c.d` this would be `a.b`,
        // thus the first/most inner member expression
        if (t.isIdentifier(node.object) && t.isIdentifier(node.property)) {
            return (
                node.object.name === nameOfGlobal
                && scope.hasGlobal(node.object.name)
                && properties.includes(node.property.name)
            )
        }
    }
    return false
}


export function isMemberOfGlobal(
    node: Node,
    scope: Scope,
    nameOfGlobal: string,
    property: string,
): boolean {
    return isAnyMemberOfGlobal(node, scope, nameOfGlobal, [property])
}
