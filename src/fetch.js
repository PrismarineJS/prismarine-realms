const { checkStatus } = require('./util')
const fetch = require('node-fetch')

const baseHeaders = (additionalHeaders = {}) => ({
  'User-Agent': '@prismarineJS/prismarine-realms',
  'Client-Version': '0.0.0',
  ...additionalHeaders
})

module.exports = (url, options = {}) => auth => {
  return fetch(url, {
    ...options,
    headers: {
      ...baseHeaders(options.headers),
      ...auth
    }
  }).then(checkStatus)
}
