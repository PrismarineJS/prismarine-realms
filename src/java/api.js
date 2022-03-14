const RealmAPI = require('../index')

module.exports = class JavaRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    return await this.rest.get(`/worlds/v1/${realmId}/join/pc`)
  }

  async invitePlayer (realmId, uuid, name) {
    return await this.rest.post(`/invites/${realmId}`, {
      body: {
        uuid,
        name
      }
    })
  }
}
