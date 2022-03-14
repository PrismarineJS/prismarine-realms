const RealmAPI = require('../index')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    return await this.rest.get(`/worlds/${realmId}/join`)
  }

  async invitePlayer (realmId, uuid) {
    return await this.rest.post(`/invites/${realmId}/invite/update`, {
      body: {
        [uuid]: 'ADD'
      }
    })
  }
}
