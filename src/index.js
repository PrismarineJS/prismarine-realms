const Rest = require('./rest')
const Realm = require('./structures/Realm')

class RealmAPI {
  constructor (authflow, platform, options = {}) {
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
