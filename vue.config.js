
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
<<<<<<< HEAD
	publicPath: '.',
=======
publicPath: '.',
>>>>>>> 19bd86bc54d58c99457a56edd33654a983079c6d
	devServer: {
		proxy: {
			'^/api': {
				target: 'http://localhost:3000'
			},
      
		}
  }
}
