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
}

module.exports = RealmAPI
