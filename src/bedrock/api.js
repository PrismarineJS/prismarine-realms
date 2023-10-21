const RealmAPI = require('../index')

const Realm = require('../structures/Realm')
const Download = require('../structures/Download')

module.exports = class BedrockRealmAPI extends RealmAPI {

  async getRealmAddress (realmId) {
    const data = await this.rest.get(`/worlds/${realmId}/join`)
    const [host, port] = data.address.split(':')
    return { host, port: Number(port) }
  }

  async getRealmFromInvite (realmInviteCode, invite = true) {
    if (!realmInviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = realmInviteCode.replace(/https:\/\/realms.gg\//g, '')
    const data = await this.rest.get(`/worlds/v1/link/${clean}`)
    if (!data.member && invite) await this.acceptRealmInviteFromCode(realmInviteCode) // If the player isn't a member, accept the invite
    return new Realm(this, data)
  }

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

  async getPendingInviteCount () {
    return await this.rest.get('/invites/count/pending')
  }

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

  async acceptRealmInvitation (invitationId) {
    await this.rest.put(`/invites/accept/${invitationId}`)
  }

  async rejectRealmInvitation (invitationId) {
    await this.rest.put(`/invites/reject/${invitationId}`)
  }

  async acceptRealmInviteFromCode (inviteCode) {
    if (!inviteCode) throw new Error('Need to provide a realm invite code/link')
    const clean = inviteCode.replace(/https:\/\/realms.gg\//g, '')
    await this.rest.post(`/invites/v1/link/accept/${clean}`)
  }

  async invitePlayer (realmId, uuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'ADD'
        }
      }
    })
    return new Realm(this, data)
  }

  async changeRealmState (realmId, state) {
    return await this.rest.put(`/worlds/${realmId}/${state}`)
  }

  async deleteRealm (realmId) {
    return await this.rest.delete(`/worlds/${realmId}`)
  }

  async getRealmWorldDownload (realmId, slotId, backupId = 'latest') {
    const data = await this.rest.get(`/archive/download/world/${realmId}/${slotId}/${backupId}`) // if backupId = latest will get the world as it is now not the most recent backup
    return new Download(this, data)
  }

  async getRealmSubscriptionInfo (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}`)
  }

  async getRealmSubscriptionInfoDetailed (realmId) {
    return await this.rest.get(`/subscriptions/${realmId}/details`)
  }

  async changeRealmActiveSlot (realmId, slotId) {
    return await this.rest.put(`/worlds/${realmId}/slot/${slotId}`)
  }

  async changeRealmNameAndDescription (realmId, name, description) {
    return await this.rest.put(`/worlds/${realmId}`, {
      body: {
        name,
        description
      }
    })
  }

  async resetRealm (realmId) {
    return await this.rest.put(`/worlds/${realmId}/reset`)
  }

  // Reference https://github.com/PrismarineJS/prismarine-realms/issues/34 for configuration structure
  async changeRealmConfiguration (realmId, configuration) {
    return await this.rest.put(`/worlds/${realmId}/configuration`, {
      body: configuration
    })
  }

  async removeRealmInvite (realmId, uuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'REMOVE'
        }
      }
    })
    return new Realm(this, data)
  }

  async opRealmPlayer (realmId, uuid) {
    return await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'OP'
        }
      }
    })
  }

  async deopRealmPlayer (realmId, uuid) {
    return await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'DEOP'
        }
      }
    })
  }

  async removeAllRealmPlayers (realmId) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: null
      }
    })
    return new Realm(this, data)
  }

  async banPlayerFromRealm (realmId, uuid) {
    return await this.rest.post(`/worlds/${realmId}/blocklist/${uuid}`)
  }

  async unbanPlayerFromRealm (realmId, uuid) {
    return await this.rest.delete(`/worlds/${realmId}/blocklist/${uuid}`)
  }

  async removeRealmFromJoinedList (realmId) {
    return await this.rest.delete(`/invites/${realmId}`)
  }

  async changeForcedTexturePack (realmId, forced) {
    if (forced) {
      return await this.rest.put(`/worlds/${realmId}/content/texturePacksRequired`)
    } else {
      return await this.rest.delete(`/worlds/${realmId}/content/texturePacksRequired`)
    }
  }

  async changeRealmDefaultPermission (realmId, permission) {
    const data = await this.rest.put(`/world/${realmId}/defaultPermission`, {
      body: {
        permission: permission.toUpperCase()
      }
    })
    return new Realm(this, data)
  }

  async changeRealmPlayersPermission (realmId, permission, uuid) {
    return await this.rest.put(`/world/${realmId}/userPermission`, {
      body: {
        permission: permission.toUpperCase(),
        uuid: uuid
      }
    })
  }
}