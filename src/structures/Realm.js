module.exports = class Realm {
  #api
  constructor (api, data) {
    this.#api = api
    Object.assign(this, {
      id: data.id,
      remoteSubscriptionId: data.remoteSubscriptionId,
      owner: data.owner,
      ownerUUID: data.ownerUUID,
      name: data.name,
      motd: data.motd,
      defaultPermission: data.defaultPermission,
      state: data.state,
      daysLeft: data.daysLeft,
      expired: data.expired,
      expiredTrial: data.expiredTrial,
      gracePeriod: data.gracePeriod,
      worldType: data.worldType,
      players: data.players,
      maxPlayers: data.maxPlayers,
      minigameName: data.minigameName,
      minigameId: data.minigameId,
      minigameImage: data.minigameImage,
      activeSlot: data.activeSlot,
      slots: data.slots,
      member: data.member,
      clubId: data.clubId,
      subscriptionRefreshStatus: data.subscriptionRefreshStatus
    })
  }

  /**
   * Retrieves the basic subscription info of a Realm
   * @returns The start date, days left, and the subscription type of a Realms subscription. The subscription type seems to only be recurring for now
   */
  async getSubscriptionInfo () {
    return this.#api.getRealmSubscriptionInfo(this.id)
  }

  /**
   * Retrieves the detailed subscription info of a Realm
   * @param {string} realmId The ID of the Realm to get the detailed subscription info of
   * @returns The type of subscription (value seems to only be 'SUBSCRIPTION'), store (platform you bought realm on), start date, end date, renewal period, days left, and subscription ID
   */
  async getSubscriptionInfoDetailed () {
    return this.#api.getRealmSubscriptionInfoDetailed(this.id)
  }

  /**
   * Retrieves the IP and port of a Realm
   * @returns The IP and port of the Realm separated by a comma
   */
  async getAddress () {
    return this.#api.getRealmAddress(this.id)
  }

  /**
   * Opens the Realm
   * @returns True if the Realm is successfully opened
   */
  async open () {
    return this.#api.changeRealmState(this.id, 'open')
  }

  /**
   * Closes the Realm
   * @returns True if the Realm is successfully closed
   */
  async close () {
    return this.#api.changeRealmState(this.id, 'close')
  }

  /**
   * Sets the realms active world slot
   * @param {number} slotId The slot of the world to set as active. This can be 1, 2, or 3
   * @returns True if the slot was changed successfully. False if the slot was changed unsuccessfully (403 if you are not the owner)
   */
  async changeActiveSlot (slotId) {
    return this.#api.changeRealmActiveSlot(this.id, slotId)
  }

  /**
   * Sets the name and description of a Realm
   * @param {string} name The name to set the Realm to
   * @param {string} description The description to set the Realm to
   * @returns All of the Realms information
   */
  async changeNameAndDescription (name, description) {
    return this.#api.changeRealmNameAndDescription(this.id, name, description)
  }

  /**
   * Deleted a Realm and all of its data. THIS ACTION IS IRREVERSIBLE AND CANNOT BE UNDONE
   * @returns A 204 status code if the Realm was deleted successfully
   */
  async delete () {
    return this.#api.deleteRealm(this.id)
  }

  /**
   * Resets a Realm to its default world and settings
   * @returns True if it successfully reset the Realm. False if it failed to reset the Realm (403 if you are not the owner)
   */
  async reset () {
    return this.#api.resetRealm(this.id)
  }

  /**
   * Retrieves a list of the Realms backups and their metadata related to them
   * @param {number} slotId The slot of the world to get the backups of. This can be 1, 2, or 3
   * @returns An array of all the backups metadata and various other information such as size
   */
  async getBackups () {
    return this.#api.getRealmBackups(this.id, this.activeSlot)
  }

  /**
   * Retrieves the download link for a Realms currently active world
   * @returns The download link and 2 other pieces of metadata for the latest and current realm sorld
   */
  async getWorldDownload () {
    return this.#api.getRealmWorldDownload(this.id, this.activeSlot, 'latest')
  }

  /**
   * Sets the specified player as an operator in the Realm
   * @param {string} uuid The UUID of the player to set as an operator
   * @returns All the information about the Realm
   */
  async opPlayer (uuid) {
    return this.#api.opRealmPlayer(this.id, uuid)
  }

  /**
   * Removes the specified player as an operator in the Realm
   * @param {string} uuid The UUID of the player to remove as an operator
   * @returns All the information about the Realm
   */
  async deopPlayer (uuid) {
    return this.#api.deopRealmPlayer(this.id, uuid)
  }

  /**
   * Invites a player to the Realm
   * @param {string} uuid The UUID of the player to invite
   * @param {string} name The name of the player to invite
   * @returns All the information about the Realm
   */
  async invitePlayer (uuid, name) {
    return this.#api.invitePlayer(this.id, uuid, name)
  }
}
