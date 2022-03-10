module.exports = (auth) => {
  return {
    getRealms: () => require('./getRealms')(auth)
  }
}
