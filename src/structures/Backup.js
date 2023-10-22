module.exports = class Backup {
  #api
  #realm
  constructor (api, realm, data) {
    this.#api = api
    this.#realm = realm
    Object.assign(this, {
      id: data.backupId,
      lastModifiedDate: data.lastModifiedDate,
      size: data.size,
      metadata: {
        gameDifficulty: data.metadata.game_difficulty,
        name: data.metadata.name,
        gameServerVersion: data.metadata.game_server_version,
        enabledPacks: JSON.parse(data.metadata.enabled_packs),
        description: data.metadata.description,
        gamemode: data.metadata.game_mode,
        worldType: data.metadata.world_type
      }
    })
  }

  /**
   * Retrieves a download link to download a Realms backup
   * @returns A link to download the backup and some metadata for the backup
   */
  async getDownload () {
    if (this.#api.platform === 'java') throw new Error('Indiviual backup downloads is not a feature of Java Realms API, only getRealmWorldDownload() is available')
    return await this.#api.getRealmWorldDownload(this.#realm.realmId, this.#realm.slotId, this.id)
  }

  /**
   * Restores a backup for a Realm
   * @returns Either 'Retry again later' or 'true'
   */
  async restore () {
    return await this.#api.restoreRealmFromBackup(this.#realm.realmId, this.id)
  }
}
