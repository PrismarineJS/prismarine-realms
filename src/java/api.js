const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')
const LivePlayerList = require('../structures/LivePlayerList')

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

  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
  }

  async getLivePlayerLists () {
    const data = await this.rest.get('/activities/liveplayerlist')
    return data.lists.map(list => new LivePlayerList(this, list))
  }
}
