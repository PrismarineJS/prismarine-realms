const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')

module.exports = class BedrockRealmAPI extends RealmAPI {
  /**
   * Retrieves the IP and port of a Realm
   * @param {string} realmId The ID of the Realm to get the address of
   * @returns The IP and port of the Realm separated by a comma
   */
  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}/join`)
    const [host, port] = data.address.split(':')
    return { host, port: Number(port) }
  }

  /**
   * Retrieves a Realms data from an invite code or link. If the player isn't a member, it will accept the invite by default
   * @param {string} realmInviteCode The invite code or link to the Realm
   * @param {string} invite Wether or not to accept the invite if the player isn't a member
   * @returns All of the Realms information
   */
  async getRealmFromInvite (realmInviteCode, invite = true) {
    if (!realmInviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = realmInviteCode.replace(/https:\/\/realms.gg\//g, '')
    const data = await this.rest.get(`/worlds/v1/link/${clean}`)
    if (!data.member && invite) await this.acceptRealmInviteFromCode(realmInviteCode) // If the player isn't a member, accept the invite
    return new Realm(this, data)
  }

  /**
   * Retrieves a Realms invite code and other invite related information from a Realm ID
   * @param {string} realmId The ID of the Realm to get the invite code from
   * @returns Data relating to inviting players to the Realm along with some basic Realm information
   */
  async getRealmInvite (realmId) {
    const data = await this.rest.get(`/links/v1?worldId=${realmId}`)
    return {
      inviteCode: data[0].linkId,
      ownerXUID: data[0].profileUuid,
      type: data[0].type,
      createdOn: data[0].ts,
      inviteLink: data[0].url,
      deepLinkUrl: data[0].deepLinkUrl
    }
  }

  /**
   * Generates a new invite code for a Realm and revokes the old one
   * @param {string} realmId The ID of the Realm to refresh the invite code for
   * @returns Data relating to inviting players to the Realm along with some basic Realm information
   */
  async refreshRealmInvite (realmId) {
    const data = await this.rest.post('/links/v1', {
      body: {
        type: 'INFINITE',
        worldId: realmId
      }
    })
    return {
      inviteCode: data.linkId,
      ownerXUID: data.profileUuid,
      type: data.type,
      createdOn: data.ts,
      inviteLink: data.url,
      deepLinkUrl: data.deepLinkUrl
    }
  }

  /**
   * Retrieves the amount of Realm invites you have pending (invites you haven't accepted or rejected yet)
   * @returns The amount of pending Realm invites you have
   */
  async getPendingInviteCount () {
    return await this.rest.get('/invites/count/pending')
  }

  /**
   * Retrieves every pending Realm invite you have and the information assosiated with them
   * @returns An array of all of the pending Realm invites you have and their respective information
   */
  async getPendingInvites () {
    const data = await this.rest.get('/invites/pending')
    return data.invites.map(invite => {
      return {
        invitationId: invite.invitationId,
        worldName: invite.worldName,
        worldDescription: invite.worldDescription,
        worldOwnerName: invite.worldOwnerName,
        worldOwnerXUID: invite.worldOwnerUuid,
        createdOn: invite.date
      }
    })
  }

  /**
   * Accepts a Realm invite
   * @param {string} invitationId The ID of the invite to accept
   */
  async acceptRealmInvitation (invitationId) {
    await this.rest.put(`/invites/accept/${invitationId}`)
  }

  /**
   * Rejects a Realm invite
   * @param {string} invitationId The ID of the invite to reject
   */
  async rejectRealmInvitation (invitationId) {
    await this.rest.put(`/invites/reject/${invitationId}`)
  }

  /**
   * Accepts a Realm invite from an invite code
   * @param {string} inviteCode The code for the invite to accept
   */
  async acceptRealmInviteFromCode (inviteCode) {
    if (!inviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = inviteCode.replace(/https:\/\/realms.gg\//g, '')
    await this.rest.post(`/invites/v1/link/accept/${clean}`)
  }

  /**
   * Invites a player to the specified Realm. If the player is already a member, it will do nothing
   * @param {string} realmId The ID of the Realm to invite the player to
   * @param {string} xuid The XUID of the player to invite to the Realm
   * @returns All of the Realms information
   */
  async invitePlayer (realmId, xuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [xuid]: 'ADD'
        }
      }
    })
    return new Realm(this, data)
  }

  /**
   * Resets a Realm to its default world and settings
   * @param {string} realmId The ID of the Realm to reset
   * @returns True if it successfully reset the Realm. False if it failed to reset the Realm (403 if you are not the owner)
   */
  async resetRealm (realmId) {
    return await this.rest.put(`/worlds/${realmId}/reset`)
  }

  /**
   * Retrieves and downloads a Realms world backup
   * @param {string} realmId The ID of a Realm to retrieve the backup of
   * @param {number} slotId The slot, or world ID to retrieve the backup of. This can be 1, 2, or 3
   * @param {string|number} backupId The ID of the backup to download. This can be 'latest' or a number
   * @returns The download URL, token, and size of the backup
   */
  async getRealmWorldDownload (realmId, slotId, backupId = 'latest') {
    const data = await this.rest.get(`/archive/download/world/${realmId}/${slotId}/${backupId}`) // if backupId = latest will get the world as it is now not the most recent backup
    return new Download(this, data)
  }

  /**
   * Sets a player as an operator in the Realm
   * @param {string} realmId The ID of the Realm to set them as an operator in
   * @param {string} uuid The UUID of the player to set as an operator
   * @returns All of the Realms information
   */
  async opRealmPlayer (realmId, uuid) {
    return await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'OP'
        }
      }
    })
  }

  /**
   * Removes a player as an operator in the Realm
   * @param {string} realmId The ID of the Realm to remove operator in
   * @param {string} uuid The UUID of the player to remove operator from
   * @returns All of the Realms information
   */
  async deopRealmPlayer (realmId, uuid) {
    return await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'DEOP'
        }
      }
    })
  }

  /**
   * Removed a player from the Realm. This isn't like banning and only removes the Realm from the players joined list and kicks them if they're logged in
   * @param {string} realmId The ID of the Realm to remove the player from
   * @param {string} xuid The XUID of the player to remove from the Realm
   * @returns All of the Realms information
   */
  async removePlayerFromRealm (realmId, xuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [xuid]: 'REMOVE'
        }
      }
    })
    return new Realm(this, data)
  }

  /**
   * Includes the specified player in the Realms blocklist. This means that they cannot join the Realm
   * @param {string} realmId The ID of the Realm to ban the player from
   * @param {string} xuid The XUID of the player to add to the blocklist
   * @returns 204 if the player was banned successfully. 403 if you are not the owner of the Realm
   */
  async banPlayerFromRealm (realmId, xuid) {
    return await this.rest.post(`/worlds/${realmId}/blocklist/${xuid}`)
  }

  /**
   * Removes the specified player from the Realms blocklist. This means that they can join the Realm again
   * @param {string} realmId The ID of the Realm to unban the player from
   * @param {string} xuid Thee XUID of the player to remove from the blocklist
   * @returns 204 if the player was unbanned successfully. 403 if you are not the owner of the Realm
   */
  async unbanPlayerFromRealm (realmId, xuid) {
    return await this.rest.delete(`/worlds/${realmId}/blocklist/${xuid}`)
  }

  /**
   * Retrieves a list of UUID's of all the banned players of the Realm
   * @param {string} realmId The ID of the Realm to get the banned players of
   * @returns An array of UUID's of all the banned players of the Realm
   */
  async getRealmBannedPlayers (realmId) {
    return await this.rest.get(`/worlds/${realmId}/blocklist`)
  }

  /**
   * Removes the specified Realm from your joined Realm list
   * @param {string} realmId The ID of the realm to remove from the joined list
   * @returns 204 if the Realm was removed successfully
   */
  async removeRealmFromJoinedList (realmId) {
    return await this.rest.delete(`/invites/${realmId}`)
  }

  /**
   * Changes if a texture pack is required to be applied when joining a Realm
   * @param {string} realmId The ID of the Realm to change the texture pack requirement of
   * @param {boolean} forced Wether or not to force the texture pack to be required
   * @returns 204 if the texture pack requirement was changed successfully. 403 if you are not the owner of the Realm
   */
  async changeIsTexturePackRequired (realmId, forced) {
    if (forced) {
      return await this.rest.put(`/worlds/${realmId}/content/texturePacksRequired`)
    } else {
      return await this.rest.delete(`/worlds/${realmId}/content/texturePacksRequired`)
    }
  }

  /**
   * Changes a Realms default permission when a player joins
   * @param {string} realmId The ID of the Realm to change the default permission of
   * @param {string} permission The permission to set player by default. Can be 'MEMBER', 'VISITOR', or 'OPERATOR'
   * @returns All the Realms information
   */
  async changeRealmDefaultPermission (realmId, permission) {
    const data = await this.rest.put(`/world/${realmId}/defaultPermission`, {
      body: {
        permission: permission.toUpperCase()
      }
    })
    return new Realm(this, data)
  }

  /**
   * Sets the permission of a player in the Realm
   * @param {string} realmId The ID of the Realm to set the players permission in
   * @param {string} permission The permission to set the player to. Can be 'MEMBER', 'VISITOR', or 'OPERATOR'
   * @param {string} xuid The XUID of the player to set the permission of
   * @returns 204 if the players permission was changed successfully. 403 if you are not the owner of the Realm
   */
  async changeRealmPlayerPermission (realmId, permission, xuid) {
    return await this.rest.put(`/world/${realmId}/userPermission`, {
      body: {
        permission: permission.toUpperCase(),
        xuid
      }
    })
  }

  /**
   * Changes the configuration of a Realm. This can be the Realms settings and gamerules
   * @param {string} realmId The ID of the Realm to change the configuration of
   * @param {string} configuration See https://github.com/PrismarineJS/prismarine-realms/issues/34 for the configuration array structure
   * @returns 204 if the configuration was changed successfully
   */
  async changeRealmConfiguration (realmId, configuration) {
    return await this.rest.post(`/worlds/${realmId}/configuration`, {
      body: configuration
    })
  }

  /**
   * Checks wether or not you can still use the Realms free trial
   * @returns True if you have a free 1 month trial available. False if you already used your free trial
   */
  async getTrialEligibility () {
    return await this.rest.get('/trial/new')
  }
}
