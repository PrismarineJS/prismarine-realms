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
    const data = await this.rest.post(`/invites/v1/link/accept/${clean}`)
    return new Realm(this, data)
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

  async getRealmWorldDownload (realmId, slotId, backupId = 'latest') {
    const data = await this.rest.get(`/archive/download/world/${realmId}/${slotId}/${backupId}`) // if backupId = latest will get the world as it is now not the most recent backup
    return new Download(this, data)
  }

  async resetRealm (realmId) {
    await this.rest.put(`/worlds/${realmId}/reset`)
  }

  // Reference https://github.com/PrismarineJS/prismarine-realms/issues/34 for configuration structure
  // async changeRealmConfiguration (realmId, configuration) {
  //   await this.rest.put(`/worlds/${realmId}/configuration`, {
  //     body: configuration
  //   })
  // }

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

  async opRealmPlayer (realmId, uuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'OP'
        }
      }
    })
    return new Realm(this, data)
  }

  async deopRealmPlayer (realmId, uuid) {
    const data = await this.rest.put(`/invites/${realmId}/invite/update`, {
      body: {
        invites: {
          [uuid]: 'DEOP'
        }
      }
    })
    return new Realm(this, data)
  }

  async banPlayerFromRealm (realmId, uuid) {
    await this.rest.post(`/worlds/${realmId}/blocklist/${uuid}`)
  }

  async unbanPlayerFromRealm (realmId, uuid) {
    await this.rest.delete(`/worlds/${realmId}/blocklist/${uuid}`)
  }

  async removeRealmFromJoinedList (realmId) {
    await this.rest.delete(`/invites/${realmId}`)
  }

  async changeIsTexturePackRequired (realmId, forced) {
    if (forced) {
      await this.rest.put(`/world/${realmId}/content/texturePacksRequired`)
    } else {
      await this.rest.delete(`/world/${realmId}/content/texturePacksRequired`)
    }
  }

  async changeRealmDefaultPermission (realmId, permission) {
    await this.rest.put(`/world/${realmId}/defaultPermission`, {
      body: {
        permission: permission.toUpperCase()
      }
    })
  }

  async changeRealmPlayerPermission (realmId, permission, uuid) {
    await this.rest.put(`/world/${realmId}/userPermission`, {
      body: {
        permission: permission.toUpperCase(),
        xuid: uuid
      }
    })
  }
}
