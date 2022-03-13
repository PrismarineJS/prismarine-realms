module.exports = class JavaRealmAPI {
  constructor (rest) {
    this.rest = rest
  }

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
