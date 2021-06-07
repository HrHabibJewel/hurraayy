// next.config.js
module.exports = {
    webpack: (config, { dev }) => {
        //config.optimization.minimize = false;
      // disable sourcemaps of webpack
    //   config.devtool = false
      
    //   // disable soucemaps of babel-loader
    //   for (const r of config.module.rules) {
    //     if (r.loader === 'babel-loader') {
    //       r.options.sourceMaps = false
    //     }
    //   }
  
      return config
    }
  }