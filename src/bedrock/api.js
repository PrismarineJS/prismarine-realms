const RealmAPI = require('../index')
const Realm = require('../structures/Realm')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}/join`)
    return { address: data.address }
  }

  async invitePlayer (realmId, uuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'ADD'
        }
      }
    })
    return new Realm(this, data)
  }

  async changeRealmState (realmId, state) {
    return await this.rest.put(`/worlds/${realmId}/${state}`)
  }
}
