const debug = require('debug')('prismarine-realms')
const fetch = require('node-fetch')

const constants = require('./constants')

const { formatBedrockAuth, formatJavaAuth, getBedrockVersion } = require('./util')

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
    const version = this.options.clientVersion ?? await getBedrockVersion()
    if (!version.startsWith('1.')) {
      throw new Error(`Invalid client version ${version}, must be in format 1.x.x`)
    }

    const headers = {
      // As of Minecraft update 26.13, the "Client-Version" header must be the current version of the game
      // in the format of 1.x.x, otherwise the Realms API will return an error message of "Unknown client version"
      'Client-Version': version,
      'User-Agent': this.userAgent
    }

    // Minecraft Bedrock has two types of realms: Regular and Preview
    // Regular realms can be only be accessed by the normal MCBE client, and Preview realms can only be accessed by the Preview (Beta) MCBE Client
    // These versions have completely different worlds attached
    if (this.options.usePreview && this.platform === 'bedrock') {
      headers['is-prerelease'] = true
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
