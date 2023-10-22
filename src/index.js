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

  /**
   * Retrieves a Realms information from its ID
   * @param {string} realmId
   * @returns All of the Realms information
   */
  async getRealm (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}`)
    return new Realm(this, data)
  }

  /**
   * Retrieves a list of the Realms that the account has access to
   * @returns An array of all the Realms information
   */
  async getRealms () {
    const data = await this.rest.get('/worlds')
    return data.servers.map(realm => new Realm(this, realm))
  }

  /**
   * Retrieves a list of the specified Realms backups and their metadata related to them
   * @param {string} realmId The ID of the Realm to get the backups of
   * @param {number} slotId The slot of the world to get the backups of. This can be 1, 2, or 3
   * @returns An array of all the backups metadata and various other information such as size
   */
  async getRealmBackups (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/backups`)
    return data.backups.map(e => new Backup(this, { realmId, slotId }, e))
  }

  /**
   * Restores a backup for a Realm
   * @param {string} realmId The ID of the Realm to restore the backup for
   * @param {string} backupId The ID of the backup to restore. This can also be 'latest' ONLY on Bedrock Edition
   * @returns Either 'Retry again later' or 'true'
   */
  async restoreRealmFromBackup (realmId, backupId) {
    return await this.rest.put(`/worlds/${realmId}/backups?backupId=${encodeURIComponent(backupId)}&clientSupportsRetries`)
  }

  /**
   * Retrieves the basic subscription info of a Realm
   * @param {string} realmId The ID of the Realm to get the subscription info of
   * @returns The start date, days left, and the subscription type of a Realms subscription. The subscription type seems to only be recurring for now
   */
  async getRealmSubscriptionInfo (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}`)
  }

  /**
    * Retrieves the detailed subscription info of a Realm
    * @param {string} realmId The ID of the Realm to get the detailed subscription info of
    * @returns The type of subscription (value seems to only be 'SUBSCRIPTION'), store (platform you bought realm on), start date, end date, renewal period, days left, and subscription ID
    */
  async getRealmSubscriptionInfoDetailed (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}/details`)
  }

  /**
   * Deleted a Realm and all of its data. THIS ACTION IS IRREVERSIBLE AND CANNOT BE UNDONE
   * @param {string} realmId The ID of the Realm to delete
   * @returns A 204 status code if the Realm was deleted successfully
   */
  async deleteRealm (realmId) {
    return await this.rest.delete(`/worlds/${realmId}`)
  }

  /**
   * Sets the state of the Realm to open or closed
   * @param {string} realmId The ID of the Realm to change the state of
   * @param {string} state The state the Realm should enter. This can either be 'OPEN' or 'CLOSED'
   * @returns True if the state was changed successfully. False if the state was changed unsuccessfully (403 if you are not the owner)
   */
  async changeRealmState (realmId, state) {
    return await this.rest.put(`/worlds/${realmId}/${state}`)
  }

  /**
   * Sets the realms active world slot
   * @param {string} realmId The ID of the Realm to change the world slot of
   * @param {number} slotId The slot of the world to set as active. This can be 1, 2, or 3 (or 4 for Java Edition)
   * @returns True if the slot was changed successfully. False if the slot was changed unsuccessfully (403 if you are not the owner)
   */
  async changeRealmActiveSlot (realmId, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`)
  }

  /**
   * Sets the name and description of a Realm
   * @param {string} realmId The ID of the Realm to set the name and description of
   * @param {string} name The name to set the Realm to
   * @param {string} description The description to set the Realm to
   * @returns All of the Realms information
   */
  async changeRealmNameAndDescription (realmId, name, description) {
    return await this.rest.post(`/worlds/${realmId}`, {
      body: {
        name,
        description
      }
    })
  }

  /**
   * Retrieves the lastest new about Minecraft Realms
   * @returns The link to the news article
   */
  async getRecentRealmNews () {
    return await this.rest.get('/mco/v1/news')
  }

  async getStageCompatibility () {
    return await this.rest.get('/mco/stageAvailable')
  }

  /**
    * Returns the version compatibility of the client with Minecraft Realms
    * @returns If the client is outdated, 'OUTDATED'. If the client running a snapshot, 'OTHER'. Else it returns 'COMPATIBLE'
    */
  async getVersionCompatibility () {
    return await this.rest.get('/mco/client/compatible')
  }
}

module.exports = RealmAPI
