const Rest = require('./rest')

const Realm = require('./structures/Realm')
const Backup = require('./structures/Backup')

class RealmAPI {
  constructor (authflow, platform, options = {}) {
    this.rest = new Rest(authflow, platform, options)
    this.platform = platform
  }

  static from (authflow, platform, options) {
    return new {
      java: require('./java/api'),
      bedrock: require('./bedrock/api')
    }[platform](authflow, platform, options)
  }

  async getRealm (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}`)
    return new Realm(this, data)
  }

  async getRealms () {
    const data = await this.rest.get('/worlds')
    return data.servers.map(realm => new Realm(this, realm))
  }

  async getRealmBackups (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/backups`)
    return data.backups.map(e => new Backup(this, { realmId, slotId }, e))
  }

  async restoreRealmFromBackup (realmId, backupId) {
    return await this.rest.put(`/worlds/${realmId}/backups?backupId=${encodeURIComponent(backupId)}&clientSupportsRetries`)
  }

  async getRealmSubscriptionInfo (realmId, detailed = false) {
    if (detailed) {
      const data = await this.rest.get(`/subscriptions/${realmId}/details`)
      return {
        type: data.type,
        store: data.store,
        startDate: data.startDate,
        endDate: data.endDate,
        renewalPeriod: data.renewalPeriod,
        daysLeft: data.daysLeft,
        subscriptionId: data.subscriptionId
      }
    } else {
      const data = await this.rest.get(`/subscriptions/${realmId}`)
      return {
        startDate: data.startDate,
        daysLeft: data.daysLeft,
        subscriptionType: data.subscriptionType
      }
    }
  }

  async changeRealmState (realmId, state) {
    return await this.rest.put(`/worlds/${realmId}/${state}`)
  }

  async changeRealmActiveSlot (realmId, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`)
  }

  async changeRealmNameAndDescription (realmId, name, description) {
    /**
     * NOTE: Workaround for Realms API bug where updating both name and
     * description in a single request can fail with:
     *   400 Bad Request {"errorCode":6009,"errorMsg":"Invalid Realm description","reason":"invalid_realm_description"}
     * Call the endpoint twice if both `name` and `description` are set:
     *   1) update name with empty description
     *   2) update description
     * Remove this logic once the upstream endpoint is fixed.
     */
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
      await this.rest.post(`/worlds/${realmId}`, {
        body: {
          name,
          description
        }
      })
    }
  }

  async deleteRealm (realmId) {
    await this.rest.delete(`/worlds/${realmId}`)
  }
}

module.exports = RealmAPI
