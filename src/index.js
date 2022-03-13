const Routes = require('./routes')('default')

const Rest = require('./rest')
const Realm = require('./structures/Realm')

const RealmsBedrockAPI = require('./bedrock/api')
const RealmsJavaAPI = require('./java/api')

const { Authflow: PrismarineAuth } = require('prismarine-auth')

const PlatformTypes = ['java', 'bedrock']

class RealmAPI {
  constructor (Authflow = new PrismarineAuth(undefined, undefined, { authTitle: false }), platform) {
    if (!PlatformTypes.includes(platform?.toLowerCase())) throw new Error(`Platform provided is not valid. Must be ${PlatformTypes.join(' | ')}`)

    this.rest = new Rest(Authflow, platform)

    this.api = (platform === 'bedrock') ? new RealmsBedrockAPI(this.rest) : new RealmsJavaAPI(this.rest)
  }

  async getRealm (realmId) {
    const data = await this.rest.get(Routes.Realm(realmId))
    return new Realm(this.api, data)
  }

  async getRealms () {
    const data = await this.rest.get(Routes.Realms())
    return data.servers.map(realm => new Realm(this.api, realm))
  }
}

module.exports = RealmAPI
