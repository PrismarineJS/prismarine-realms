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

  /**
   * Updates the name and/or description of a Realm.
   *
   * NOTE: Due to a Realms API bug, updating both name and description in a single request
   * can fail with:
   *   400 Bad Request {"errorCode":6009,"errorMsg":"Invalid Realm description","reason":"invalid_realm_description"}
   * This workaround will call the endpoint twice if both name and description are set:
   *   1. Update name (description empty)
   *   2. Update description (with name)
   * Remove this logic once the endpoint is patched upstream.
   */
  async changeRealmNameAndDescription (realmId, name, description) {
    if (name && description) {
      // Step 1: update name only
      await this.rest.post(`/worlds/${realmId}`, {
        body: {
          name,
          description: ''
        }
      })
      // Step 2: update description
      await this.rest.post(`/worlds/${realmId}`, {
        body: {
          name,
          description
        }
      })
    } else {
      // Normal single update
      await this.rest.post(`/worlds/${realmId}`, {
        body: {
          name,
          description
        }
      })
    }
  }

  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
  }
}
