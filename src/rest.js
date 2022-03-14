const debug = require('debug')('prismarine-realms')
const fetch = require('node-fetch')

const {
  BedrockRealmsRelyingParty,
  BedrockUserAgent,
  BedrockHost,
  JavaHost,
  JavaUserAgent
} = require('./constants')

const { formatBedrockAuth, formatJavaAuth } = require('./util')

module.exports = class Rest {
  constructor (authflow, platform) {
    this.platform = platform
    this.host = (platform === 'bedrock') ? BedrockHost : JavaHost
    this.userAgent = (platform === 'bedrock') ? BedrockUserAgent : JavaUserAgent
    this.getAuth = (platform === 'bedrock') ? () => authflow.getXboxToken(BedrockRealmsRelyingParty).then(formatBedrockAuth) : () => authflow.getMinecraftJavaToken({ fetchProfile: true }).then(formatJavaAuth)
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

    const [key, value] = await this.getAuth()
    headers[key] = value

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

  async execRequest (url, options) {
    const response = await fetch(url, options)

    if (response.ok) {
      if (response.headers.get('Content-Type')?.startsWith('application/json')) {
        return response.json()
      }
      return response.arrayBuffer()
    } else {
      debug('Request fail', response)
      const body = await response.text()
      throw new Error(`${response.status} ${response.statusText} ${body}`)
    }
  }
}
