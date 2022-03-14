const Rest = require('./rest')
const Realm = require('./structures/Realm')

const PlatformTypes = ['java', 'bedrock']

class RealmAPI {
  constructor (Authflow, platform) {
    if (!Authflow) throw new Error('Need to proive an Authflow instance to use the Realm API https://github.com/PrismarineJS/prismarine-auth')
    if (!PlatformTypes.includes(platform?.toLowerCase())) throw new Error(`Platform provided is not valid. Must be ${PlatformTypes.join(' | ')}`)

    this.rest = new Rest(Authflow, platform)
  }

  static from (authflow, platform) {
    return (platform === 'bedrock') ? new (require('./bedrock/api'))(authflow, platform) : new (require('./java/api'))(authflow, platform)
  }

  async getRealm (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}`)
    return new Realm(this, data)
  }

  async getRealms () {
    const data = await this.rest.get('/worlds')
    return data.servers.map(realm => new Realm(this, realm))
  }
}

module.exports = RealmAPI
