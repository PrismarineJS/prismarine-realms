const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')

module.exports = class JavaRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/v1/${realmId}/join/pc`)
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

  async deleteRealm (realmId) {
    return await this.rest.delete(`/worlds/${realmId}`)
  }

  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
  }

  async getRealmSubscriptionInfo (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}`)
  }

  async getRealmSubscriptionInfoDetailed (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}/details`)
  }

  async changeRealmActiveSlot (realmId, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`)
  }

  async changeRealmNameAndDescription (realmId, name, description) {
    return await this.rest.put(`/worlds/${realmId}`, {
      body: {
        name,
        description
      }
    })
  }
}
