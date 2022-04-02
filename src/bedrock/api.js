const RealmAPI = require('../index')
const Realm = require('../structures/Realm')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}/join`)
    return { address: data.address }
  }

  async getRealmFromInvite (realmInviteCode) {
    if (!realmInviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = realmInviteCode.replace(/https:\/\/realms.gg\//g, '')
    const data = await this.rest.get(`/worlds/v1/link/${clean}`)
    return new Realm(this, data)
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
