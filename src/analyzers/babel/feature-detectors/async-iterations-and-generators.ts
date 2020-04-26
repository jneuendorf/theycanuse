import * as t from '@babel/types'

import { BabelDetector } from '../index'


export const _asyncIterationsAndGenerators: BabelDetector = function({ node }): boolean {
    /*
    async function* asyncGenerator() {
        let i = 0;
        while (i < 3) {
            yield i++;
        }
    }
    const asyncGenerator2 = async function* () {
        let i = 0;
        while (i < 3) {
            yield i++;
        }
    }
    */
    if (t.isFunctionDeclaration(node) || t.isFunctionExpression(node)) {
        return node.generator && node.async
    }

    /*
    const asyncIterable = {
        [Symbol.asyncIterator]() {
            return {
                i: 0,
                next() {
                    if (this.i < 3) {
                        return Promise.resolve({
                            value: this.i++,
                            done: false
                        });
                    }
                    return Promise.resolve({done: true});
                }
            };
        }
    };
    */
    if (t.isMemberExpression(node)) {
        // This implies it's no nested MemberExpression thus something like
        // 'a.Symbol.asyncIterator' is not detected.
        if (t.isIdentifier(node.object) && node.object.name === 'Symbol') {
            if (t.isIdentifier(node.property)) {
                return node.property.name === 'asyncIterator'
            }
        }
    }

    /*
    (async function() {
        for await (let num of asyncIterable) {
            console.log(num);
        }
    })();
    (async function() {
        for await (let num of asyncGenerator()) {
            console.log(num);
        }
    })();
    */
    if (t.isForOfStatement(node)) {
        return node.await
    }

    return false
}
