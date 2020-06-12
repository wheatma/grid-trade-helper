module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' && process.env.DEPLOY != 'now'
      ? '/grid-trade-helper/'
      : '/',
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/logo.png',
      maskIcon: 'img/icons/favicon.png',
      msTileImage: 'img/logo.png'
    }
  }
};
