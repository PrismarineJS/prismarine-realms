module.exports = class BedrockRealmAPI {
  constructor (rest) {
    this.rest = rest
  }

  async getRealmAddress (realmId) {
    return await this.rest.get(`/worlds/${realmId}/join`)
  }

  async invitePlayer (realmId, uuid, name) {
    return await this.rest.post(`/invites/${realmId}/invite/update`, {
      body: {
        [uuid]: 'ADD'
      }
    })
  }
}
