const RealmAPI = require('../index')
const Realm = require('../structures/Realm')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    // This endpoint on the Realms API can be very intermittent and may fail with error code 503. We retry the request maximum 5 times to help mitigate this
    const data = await this.rest.get(`/worlds/${realmId}/join`, {
      retryCount: 5
    })
    const [host, port] = data.address.split(':')
    return { host, port: Number(port) }
  }

  async acceptRealmInvite (inviteCode) {
    await this.rest.get(`/invites/v1/link/accept/${inviteCode}`)
  }

  async getRealmFromInvite (realmInviteCode) {
    if (!realmInviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = realmInviteCode.replace(/https:\/\/realms.gg\//g, '')
    await this.acceptRealmInvite(clean)
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
