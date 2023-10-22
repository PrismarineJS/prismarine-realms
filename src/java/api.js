const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')

module.exports = class JavaRealmAPI extends RealmAPI {

  /**
   * The following 6 functions below are in both Java Edition Minecraft and Bedrock. They just hit different endpoints
   */

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
   * @param {number} slotId The slot, or world ID to retrieve the backup of. This can be 1, 2, 3, or 4
   * @returns The download URL, resource pack URL, and resource pack hash of the backup
   */
  async getRealmWorldDownload (realmId, slotId) {
    const data = await this.rest.get(`/worlds/${realmId}/slot/${slotId}/download`)
    return new Download(this, data)
  }

  /**
   * Sets a player as an operator in the Realm
   * @param {string} realmId The ID of the Realm to set them as an operator in
   * @param {string} uuid The UUID of the player to set as an operator
   * @returns A list of operators in the Realm
   */
  async opRealmPlayer (realmId, uuid) {
    return await this.rest.post(`/ops/${realmId}/${uuid}`)
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
   * Checks wether or not you can still use the Realms free trial
   * @returns True if you have a free 1 month trial available. False if you already used your free trial
   */
  async getTrialEligibility () {
    return await this.rest.get('/trial')
  }

  /**
   * All functions below are only found in Java Edition Minecraft unless stated otherwise in index.d.ts
   */

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
  async removePlayerFromRealm (realmId, uuid) {
    return await this.rest.delete(`/worlds/${realmId}/invite/${uuid}`)
  }

  /**
   * Changes the configuration of a Realm. This can be the Realms settings and gamerules
   * @param {string} realmId The ID of the Realm to change the configuration of
   * @param {string} configuration See https://github.com/PrismarineJS/prismarine-realms/issues/34 for the configuration array structure
   * @returns 204 if the configuration was changed successfully
   */
  async changeRealmConfiguration (realmId, configuration, slotId) {
    return await this.rest.post(`/worlds/${realmId}/slot/${slotId}`, {
      body: configuration
    })
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
    return await this.rest.get('/mco/available')
  }
}
