module.exports = {
  publicPath: './',
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: '.',
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:3000'
			}
		}
  }
}
