const Routes = require('../routes')('bedrock')

module.exports = class BedrockRealmAPI {
  constructor (rest) {
    this.rest = rest
  }

  async getRealmAddress (realmId) {
    return await this.rest.get(Routes.RealmAddress(realmId))
  }

  async invitePlayer (realmId, uuid, name) {
    return await this.rest.post(Routes.InviteUpdate(realmId), {
      body: {
        [uuid]: 'ADD'
      }
    })
  }
}
