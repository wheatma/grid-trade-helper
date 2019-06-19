module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' && process.env.DEPLOY != 'now'
      ? '/grid-trade-helper/'
      : '/'
};
