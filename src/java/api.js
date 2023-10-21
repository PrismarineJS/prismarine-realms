const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')

module.exports = class JavaRealmAPI extends RealmAPI {

  /**
   * Retrieves the IP and port of a Realm
   * @param {string} realmId The ID of the Realm to get the address of
   * @returns The IP and port of the Realm separated by a comma
   */
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/v1/${realmId}/join/pc`)
    const [host, port] = data.address.split(':')
    return { host, port: Number(port) }
  }

  /**
   * Invites a player with the specified UUID and name to the Realm
   * @param {string} realmId The ID of the Realm to invite the player to
   * @param {string} uuid The UUID of the player to invite
   * @param {string} name The name of the player to invite
   * @returns An array filled with all of the Realms information
   */
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
   * Removed a player from the Realm. This isn't like banning and only removes the Realm from the players joined list and kicks them if they're logged in
   * @param {string} realmId The ID of the Realm to remove the player from
   * @param {string} uuid The UUID of the player to remove from the Realm
   * @returns All of the Realms information
   */
  async removeRealmInvite (realmId, uuid) {
    return await this.rest.delete(`/worlds/${realmId}/invite/${uuid}`)
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
   * Deleted a Realm and all of its data. THIS ACTION IS IRREVERSIBLE AND CANNOT BE UNDONE
   * @param {string} realmId The ID of the Realm to delete
   * @returns A 204 status code if the Realm was deleted successfully
   */
  async deleteRealm (realmId) {
    return await this.rest.delete(`/worlds/${realmId}`)
  }

  /**
   * Resets a Realm to its default world and settings
   * @param {string} realmId The ID of the Realm to reset
   * @returns True if it successfully reset the Realm. False if it failed to reset the Realm (403 if you are not the owner)
   */
  async resetRealm (realmId) {
    return await this.rest.post(`/worlds/${realmId}/reset`, {
      body: { 
        seed: '', 
        worldTemplateId: -1, 
        levelType: 0, 
        generateStructures: true 
      }
    })
  }

  /**
   * Retrieves and downloads a Realms latest backup
   * @param {string} realmId The ID of a Realm to retrieve the backup of
   * @param {number} slotId The slot, or world ID to retrieve the backup of. This can be 1, 2, or 3
   * @returns The download URL, resource pack URL, and resource pack hash of the backup
   */
  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
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
   * Sets the realms active world slot
   * @param {string} realmId The ID of the Realm to change the world slot of
   * @param {number} slotId The slot of the world to set as active. This can be 1, 2, or 3
   * @returns True if the slot was changed successfully. False if the slot was changed unsuccessfully (403 if you are not the owner)
   */
  async changeRealmActiveSlot (realmId, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`)
  }

  /**
   * Sets a player as an operator in the Realm
   * @param {string} realmId The ID of the Realm to set them as an operator in
   * @param {string} uuid The UUID of the player to set as an operator
   * @returns A list of operators in the Realm
   */
  async opRealmPlayer (realmId, uuid) {
    return await this.rest.put(`/ops/${realmId}/${uuid}`)
  }

  /**
   * Removes a player as an operator in the Realm
   * @param {string} realmId The ID of the Realm to remove operator in
   * @param {string} uuid The UUID of the player to remove operator from
   * @returns A list of operators in the Realm
   */
  async deopRealmPlayer (realmId, uuid) {
    return await this.rest.delete(`/ops/${realmId}/${uuid}`)
  }

  /**
   * Sets the name and description of a Realm
   * @param {string} realmId The ID of the Realm to set the name and description of
   * @param {string} name The name to set the Realm to
   * @param {string} description The description to set the Realm to
   * @returns All of the Realms information
   */
  async changeRealmNameAndDescription (realmId, name, description) {
    return await this.rest.put(`/worlds/${realmId}`, {
      body: {
        name,
        description
      }
    })
  }

  /**
   * Changes the configuration of a Realm. This can be the Realms settings and gamerules
   * @param {string} realmId The ID of the Realm to change the configuration of
   * @param {string} configuration See https://github.com/PrismarineJS/prismarine-realms/issues/34 for the configuration array structure
   * @param {number} slotId The slot of the world to change the configuration of. This can be 1, 2, or 3
   * @returns 204 if the configuration was changed successfully 
   */
  async changeRealmConfiguration (realmId, configuration, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`, {
      body: configuration
    })
  }

  /**
   * Retrieves the lastest new about Minecraft Realms
   * @returns The link to the news article
   */
  async getRecentRealmNews() {
    return await this.rest.get(`/mco/v1/news`)
  }

  async getStageCompatibility() {
    return await this.rest.get(`/mco/stageAvailable`)
  }

  /**
   * Returns the version compatibility of the client with Minecraft Realms
   * @returns If the client is outdated, 'OUTDATED'. If the client running a snapshot, 'OTHER'. Else it returns 'COMPATIBLE'
   */
  async getVersionCompatibility() {
    return await this.rest.get(`/mco/client/compatible`)
  }

  /**
   * Checks wether or not you can still use the Realms free trial
   * @returns True if you have a free 1 month trial available. False if you already used your free trial
   */
  async getTrialEligibility() {
    return await this.rest.get(`/trial`)
  }

  /**
   * Sets a Realm to a minigame
   * @param {string} realmId The ID of the Realm to set as a minigame
   * @param {string} minigameId The ID of the minigame to set the Realm to
   * @returns True if successfully set the Realm to minigames
   */
  async changeRealmToMinigame (realmId, minigameId) {
    return await this.rest.put(`/worlds/minigames/${minigameId}/${realmId}`)
  }

  /**
   * Wether or not you can access the Minecraft Realms Service
   * @returns True if you can access the Minecraft Realms Service. False if you cannot access the Minecraft Realms Service
   */
  async getRealmStatus () {
    return await this.rest.get(`/mco/available`)
  }
}
