const RealmAPI = require('../index')
const Realm = require('../structures/Realm')

module.exports = class BedrockRealmAPI extends RealmAPI {
  async getRealmAddress (realmId) {
    // This endpoint on the Realms API can be very intermittent and may fail with error code 503. We retry the request maximum 5 times to help mitigate this
    const data = await this.rest.get(`/worlds/${realmId}/join`, {
      retryCount: 5
    })
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
}
