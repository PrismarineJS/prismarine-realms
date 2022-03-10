const { checkStatus } = require('./util')
const fetch = require('node-fetch')

module.exports = (url, options = {}) => auth => {
  return fetch(url, {
    ...options,
    headers: {
      'Client-Version': '0.0.0',
      ...options.headers,
      ...auth
    }
  }).then(checkStatus)
}
