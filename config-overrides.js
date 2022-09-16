// // config-overrides.js
// module.exports = function override(config, env) {
//   // New config, e.g. config.plugins.push...
//   const fallback = config.resolve.fallback || {}
//   Object.assign(fallback, {
//     url: require.resolve("url/"),
//     stream: require.resolve("stream-browserify"),
//     os: require.resolve("os-browserify/browser"),
//     util: require.resolve("util/"),
//     path: require.resolve("path-browserify"),
//     child_process: false,
//     fs: require.resolve("browserify-fs"),
//     zlib: require.resolve("browserify-zlib"),
//     https: require.resolve("https-browserify"),
//     http: require.resolve("stream-http"),
//     net: require.resolve("net-browserify"),
//     crypto: require.resolve("crypto-browserify"),
//     tls: require.resolve("tls-browserify"),
//     assert: require.resolve("assert/"),
//     buffer: require.resolve("buffer"),
//     process: false
//   })
//   config.resolve.fallback = fallback


//   return config
// }
const webpack = require('webpack')
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    url: require.resolve("url/"),
        stream: require.resolve("stream-browserify"),
        os: require.resolve("os-browserify/browser"),
        util: require.resolve("util/"),
        path: require.resolve("path-browserify"),
        child_process: false,
        fs: require.resolve("browserify-fs"),
        zlib: require.resolve("browserify-zlib"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        net: require.resolve("net-browserify"),
        crypto: require.resolve("crypto-browserify"),
        tls: require.resolve("tls-browserify"),
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer"),
        timers: require.resolve('timers-browserify'),
        process: false
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ])

  // config.module.rules.push({
  //   test: /\.m?js/,
  //   resolve: {
  //     fullySpecified: false,
  //   },
  // })

  return config
}
