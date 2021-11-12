module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:4000/"
      }
    }
  },
  pages:{
    index:{
      entry:'src/main.js',
      title:'Solarpro'
    }
  }
}