const Rest = require('./rest')
const Realm = require('./structures/Realm')

const RealmsBedrockAPI = require('./bedrock/api')
const RealmsJavaAPI = require('./java/api')

const PlatformTypes = ['java', 'bedrock']

class RealmAPI {
  constructor (Authflow, platform) {
    if (!Authflow) throw new Error('Need to proive an Authflow instance to use the Realm API https://github.com/PrismarineJS/prismarine-auth')
    if (!PlatformTypes.includes(platform?.toLowerCase())) throw new Error(`Platform provided is not valid. Must be ${PlatformTypes.join(' | ')}`)

    this.rest = new Rest(Authflow, platform)

    this.api = (platform === 'bedrock') ? new RealmsBedrockAPI(this.rest) : new RealmsJavaAPI(this.rest)
  }

  async getRealm (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}`)
    return new Realm(this.api, data)
  }

  async getRealms () {
    const data = await this.rest.get('/worlds')
    return data.servers.map(realm => new Realm(this.api, realm))
  }
}

module.exports = RealmAPI
