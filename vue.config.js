const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Pro-ecomm-pharmacy/' // تأكد أن الاسم يطابق تماماً اسم الـ Repo على GitHub بالحروف الكبيرة والصغيرة
    : '/',
  configureWebpack: {
    performance: {
      hints: false
    }
  }
})