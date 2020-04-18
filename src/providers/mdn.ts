// const mdn = require('mdn-browser-compat-data')
//
//
// /*
// > require('mdn-browser-compat-data').javascript.functions.arrow_functions
// {
//   __compat: {
//     description: 'Arrow functions',
//     mdn_url: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
//     spec_url: 'https://tc39.es/ecma262/#sec-arrow-function-definitions',
//     support: {
//       chrome: [Object],
//       chrome_android: [Object],
//       edge: [Object],
//       firefox: [Object],
//       firefox_android: [Object],
//       ie: [Object],
//       nodejs: [Object],
//       opera: [Object],
//       opera_android: [Object],
//       safari: [Object],
//       safari_ios: [Object],
//       samsunginternet_android: [Object],
//       webview_android: [Object]
//     },
//     status: { experimental: false, standard_track: true, deprecated: false }
//   },
//   trailing_comma: {
//     __compat: {
//       description: 'Trailing comma in parameters',
//       support: [Object],
//       status: [Object]
//     }
//   }
// }
// */
//
// const data = {}
// for (const broadArea of Object.keys(mdn)) {
//     for (const category of Object.keys(mdn[broadArea])) {
//         data[category] = mdn[broadArea][category].__compat.support
//     }
// }
//
// function normalized(data) {
//     return data
// }
//
//
// module.exports = normalized(data)
