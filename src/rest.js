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
  }

  get (route, options) {
    return this.prepareRequest({ ...options, route, method: 'get' })
  }

  post (route, options) {
    return this.prepareRequest({ ...options, route, method: 'post' })
  }

  put (route, options) {
    return this.prepareRequest({ ...options, route, method: 'put' })
  }

  delete (route, options) {
    return this.prepareRequest({ ...options, route, method: 'delete' })
  }

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

    return this.execRequest(url, fetchOptions, request.retryCount)
  }

  async execRequest (url, options, retries = 0) {
    const response = await fetch(url, options)

    if (response.ok) {
      if (response.headers.get('Content-Type')?.startsWith('application/json')) {
        return response.json()
      }
      return response.text()
    } else {
      debug('Request fail', response)
      if (response.status >= 500 && response.status < 600 && retries !== 0) {
        debug('retry', retries)
        await new Promise((resolve) => { setTimeout(resolve, 1000) })
        return this.execRequest(url, options, --retries)
      }
      const body = await response.text()
      throw new Error(`${response.status} ${response.statusText} ${body}`)
    }
  }
}
