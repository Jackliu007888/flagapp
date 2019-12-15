const path = require('path')

module.exports = {
  publicPath: '/flagApp/',
  css: {
    loaderOptions: {
      stylus: {
        import: [path.resolve(__dirname, './src/common/style/variables.styl')]
      }
    }
  }
}