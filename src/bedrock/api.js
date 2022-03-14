const RealmAPI = require('../index')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}/join`)
    return { address: data.address }
  }

  async invitePlayer (realmId, uuid) {
    return await this.rest.post(`/invites/${realmId}/invite/update`, {
      body: {
        [uuid]: 'ADD'
      }
    })
  }
}
