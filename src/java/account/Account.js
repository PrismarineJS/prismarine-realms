const _GetRealms = require('./getRealms')

module.exports = (auth) => {
  return {
    getRealms: () => _GetRealms(auth)
  }
}
