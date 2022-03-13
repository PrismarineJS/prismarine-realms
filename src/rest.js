const debug = require('debug')('prismarine-realms')
const fetch = require('node-fetch')

const { PlatformConstants, BedrockRealmsRelyingParty } = require('./constants')
const { formatBedrockAuth, formatJavaAuth } = require('./util')

module.exports = class Rest {
  constructor (authflow, platform) {
    this.authflow = authflow
    this.platform = platform
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
    const { Host, UserAgent } = PlatformConstants(this.platform)

    const url = `${Host}${request.route}`

    const headers = {
      'Client-Version': '0.0.0',
      'User-Agent': UserAgent
    }

    const [key, value] = await this.getAuth(this.platform)
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

  getAuth (platform) {
    switch (platform) {
      case 'java':
        return this.authflow.getMinecraftJavaToken({ fetchProfile: true }).then(formatJavaAuth)
      case 'bedrock':
        return this.authflow.getXboxToken(BedrockRealmsRelyingParty).then(formatBedrockAuth)
    }
  }
}
