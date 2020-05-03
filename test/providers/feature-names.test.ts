import subsets from 'enum-nck'
import jaro from 'jaro-winkler'

import { instances as providers } from '../../src/providers'
import { NormalizedData } from '../../src/types/data'
// import cartesian from '../../src/types/cartesian'

// declare module cartesian {
//
// }
// type Cartesian<T=any> = (arrays: T[][]) => T[][]

// const cartesian: Cartesian<string> = _cartesian

// declare type cartesian<T=any> = (...arrays: T[][]) => T[][]

const ALLOWED_SIMILAR_FEATURES = [
    /\d$/,
    /transforms(\d)d/,
    /stream(s)?/,
    /link-rel-(dns-)?prefetch/,
    /keyboardevent-(char)?code/,
]


test('normalized and distinguishable feature names across providers', async () => {
    const datas: NormalizedData[] = await Promise.all(
        providers.map(provider => provider.normalizedData())
    )
    const featureNames = (
        datas
        .map(data => Object.keys(data))
        .flat()
    )
    const uniqueFeatureNames = [...new Set(featureNames)]
    // console.log(featureNames)
    const combinations = subsets<string>(uniqueFeatureNames, 2)
    // console.log(combinations)
    const indistinguishableFeatureNames = (
        combinations
        .map(([feature1, feature2]): [string, string, number] => [
            feature1,
            feature2,
            jaro(feature1, feature2),
        ])
        .filter(([,, similarity]) => similarity > 0.95)
        // Make an exception on some features.
        .filter(([feature1, feature2]: [string, string, number]) => {
            return !ALLOWED_SIMILAR_FEATURES.some(re => (
                re.test(feature1)
                || re.test(feature2)
            ))
        })
    )
    console.log(indistinguishableFeatureNames)
})
