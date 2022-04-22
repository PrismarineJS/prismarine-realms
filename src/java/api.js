const RealmAPI = require('../index')
const Realm = require('../structures/Realm')

module.exports = class JavaRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/v1/${realmId}/join/pc`, { retryCount: 5 })
    const [host, port] = data.address.split(':')
    return { host, port: Number(port) }
  }

  async invitePlayer (realmId, uuid, name) {
    const data = await this.rest.post(`/invites/${realmId}`, {
      body: {
        uuid,
        name
      }
    })
    return new Realm(this, data)
  }

  async changeRealmState (realmId, state) {
    return await this.rest.put(`/worlds/${realmId}/${state}`)
  }
}
