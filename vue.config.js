const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
				  javascriptEnabled: true
        }
      }
    },
  },
})
