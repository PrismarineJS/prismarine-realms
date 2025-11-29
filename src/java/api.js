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

  // NOTE: There's a bug in the Realms API where updating both the name and
  // description in a single request can fail with:
  //   `400 Bad Request {"errorCode":6009,"errorMsg":"Invalid Realm description","reason":"invalid_realm_description"}`
  // This behavior has been reproduced in the official web interface and in-game. 
  // Workaround: call the endpoint twice — first update the name
  // (passing an empty string for the description), then update the
  // description in a separate call. 
  // Example:
  //   await api.changeRealmNameAndDescription(realmId, name, '');
  //   await api.changeRealmNameAndDescription(realmId, name, description);
  async changeRealmNameAndDescription (realmId, name, description) {
    await this.rest.post(`/worlds/${realmId}`, {
      body: {
        name,
        description
      }
    })
  }

  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
  }
}
