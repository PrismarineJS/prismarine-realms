const debug = require('debug')('prismarine-realms')
const fetch = require('node-fetch')

const constants = require('./constants')

const { formatBedrockAuth, formatJavaAuth } = require('./util')

module.exports = class Rest {
  constructor (authflow, platform, options) {
    this.options = options
    this.platform = platform
    this.host = constants[platform].host
    this.userAgent = constants[platform].userAgent
    if (platform === 'bedrock') {
      this.getAuth = () => authflow.getXboxToken(constants.bedrock.relyingParty).then(formatBedrockAuth)
    } else if (platform === 'java') {
      this.getAuth = () => authflow.getMinecraftJavaToken({ fetchProfile: true }).then(formatJavaAuth)
    }
    this.maxRetries = options.maxRetries ?? 4
  }

  /**
   * Sends a GET request to the specified route with the specified options
   * @param {string} route The route to send the request to. This can also be the URL with parameters
   * @param {Array} options The body or options of the request 
   * @returns The response that is given from the request
   */
  get (route, options) {
    return this.prepareRequest({ ...options, route, method: 'get' })
  }

  /**
   * Sends a POST request to the specified route with the specified options
   * @param {string} route The route to send the request to. This can also be the URL with parameters
   * @param {Array} options The body or options of the request 
   * @returns The response that is given from the request
   */
  post (route, options) {
    return this.prepareRequest({ ...options, route, method: 'post' })
  }

  /**
   * Sends a PUT request to the specified route with the specified options
   * @param {string} route The route to send the request to. This can also be the URL with parameters
   * @param {Array} options The body or options of the request 
   * @returns The response that is given from the request
   */
  put (route, options) {
    return this.prepareRequest({ ...options, route, method: 'put' })
  }

  /**
   * Sends a DELETE request to the specified route with the specified options
   * @param {string} route The route to send the request to. This can also be the URL with parameters
   * @param {Array} options The body or options of the request 
   * @returns The response that is given from the request
   */
  delete (route, options) {
    return this.prepareRequest({ ...options, route, method: 'delete' })
  }

  /**
   * Prepares a request with the necessary headers, body, and other options
   * @param {Array} request The options, route, and method that is in the request
   * @returns The response that is given from the request
   */
  async prepareRequest (request) {
    const url = `${this.host}${request.route}`

    const headers = {
      'Client-Version': '0.0.0',
      'User-Agent': this.userAgent
    }

    if (!this.options.skipAuth) {
      const [key, value] = await this.getAuth()
      headers[key] = value
    }

    let body

    if (request.body !== null) {
      body = JSON.stringify(request.body)
      headers['Content-Type'] = 'application/json'
    }

    const fetchOptions = {
      method: request.method,
      body,
      headers: { ...headers, ...request.headers }
    }

    return this.execRequest(url, fetchOptions)
  }

  /**
   * 
   * @param {string} url The URL to send the request to
   * @param {Array} options The method, body, and headers of the request
   * @param {number} retries The number of retries that should be made if the request fails
   * @returns The response that is given from the request
   */
  async execRequest (url, options, retries = 0) {
    const response = await fetch(url, options)

    if (response.ok) {
      if (response.headers.get('Content-Type')?.startsWith('application/json')) {
        return response.json()
      }
      return response.text()
    } else {
      debug('Request fail', response)
      // Some endpoints on the Realms API can be very intermittent and may fail with error code 503. We retry 5xx errors a maximum of 4 times to help mitigate this
      if (response.status >= 500 && response.status < 600 && retries < this.maxRetries) {
        const delay = Math.pow(2, retries) * 1000
        debug('retry', retries, 'in', delay, 'ms')
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.execRequest(url, options, ++retries)
      }
      const body = await response.text()
      throw new Error(`${response.status} ${response.statusText} ${body}`)
    }
  }
}
