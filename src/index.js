const Rest = require('./rest')
const Realm = require('./structures/Realm')

const PlatformTypes = ['java', 'bedrock']

class RealmAPI {
  constructor (authflow, platform, options = {}) {
    if (!authflow) throw new Error('Need to proive an Authflow instance to use the Realm API https://github.com/PrismarineJS/prismarine-auth')
    if (!PlatformTypes.includes(platform)) throw new Error(`Platform provided is not valid. Must be ${PlatformTypes.join(' | ')}`)

    this.rest = new Rest(authflow, platform, options)
  }

  static from (authflow, platform, options) {
    return new {
      java: require('./java/api'),
      bedrock: require('./bedrock/api')
    }[platform](authflow, platform, options)
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
