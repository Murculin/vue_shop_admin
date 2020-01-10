const path = require('path');
function resolve (dir) {
  return path.join(__dirname,  dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@',resolve('src'))
      .set('styles',resolve('src/assets/styles'))
      .set('common',resolve('src/common'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api/private/v1/',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
