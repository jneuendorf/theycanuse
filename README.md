# theycanuse
Scan your code to see what browsers support it. This is basically the inverse of caniuse.com but based on its data.


## Notes / resources

### ASTs, parsing

- https://astexplorer.net
- https://prettier.io/docs/en/options.html#parser
- https://babeljs.io/docs/en/next/babel-parser.html
- https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md#identifier
- https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md


## TODOs

1. `jaro-winkler('daniel','danielle') == 0.95`, [natural's jaro winkler](https://github.com/NaturalNode/natural/blob/master/lib/natural/distance/jaro-winkler_distance.js)`()'daniel','danielle') == 0.95`, but `wink-jaro-distance('daniel','danielle') == { distance: 0.08333333333333337, similarity: 0.9166666666666666 }` as well as [Rosetta Code's Python implementation](https://rosettacode.org/wiki/Jaro_distance#Python)`('daniel','danielle') == 0.9166666666666666`
   - Which one is right? :man_shrugging: ¯\\\_(ツ)\_/¯
