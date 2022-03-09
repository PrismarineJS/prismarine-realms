const _BedrockRealm = require('./bedrock/realm/Realm')
const _BedrockAccount = require('./bedrock/account/Account')

const _JavaRealm = require('./java/realm/Realm')
const _JavaAccount = require('./java/account/Account')

const { formatJavaAuth, formatBedrockAuth } = require('./util')

const { BedrockRealmsRelyingParty } = require('./constants')

const { Authflow } = require('prismarine-auth')

class RealmAPI extends Authflow {
  constructor (username, cache, options = {}, codeCallback) {
    super(username, cache, { ...options, authTitle: false }, codeCallback)
    this.auth = {
      getJavaAuth: () => (options.test) ? (async () => ({}))() : this.getMinecraftJavaToken({ fetchProfile: true }).then(formatJavaAuth),
      getBedrockAuth: () => (options.test) ? (async () => ({}))() : this.getXboxToken(BedrockRealmsRelyingParty).then(formatBedrockAuth)
    }
    this.Bedrock = {
      realm: _BedrockRealm(this.auth),
      account: _BedrockAccount(this.auth)
    }
    this.Java = {
      realm: _JavaRealm(this.auth),
      account: _JavaAccount(this.auth)
    }
  }
}

module.exports = RealmAPI
