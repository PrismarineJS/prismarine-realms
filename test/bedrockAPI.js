/* eslint-env mocha */
const nock = require('nock')

const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const { World, Join, RealmInvite, RealmInviteModified, PendingInvites, PendingInvitesModified, PendingInvitesCount } = require('./common/responses.json')

const { RealmAPI } = require('prismarine-realms')
const { Authflow } = require('prismarine-auth')

const config = {
  realmId: '1112223',
  realmInviteCode: 'AB1CD2EFA3B',
  realmInviteLink: 'https://realms.gg/AB1CD2EFA3B',
  realmInvitationId: '11223344',
  xuid: '1111222233334444'
}

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock', { skipAuth: true })

nock('https://pocket.realms.minecraft.net')
  .get('/worlds')
  .reply(200, { servers: [World] })
  .get(`/worlds/${config.realmId}`)
  .times(5)
  .reply(200, World)
  .get(`/worlds/v1/link/${config.realmInviteCode}`)
  .times(2)
  .reply(200, World)
  .get(`/worlds/${config.realmId}/join`)
  .reply(200, Join)
  .put(`/invites/${config.realmId}/invite/update`)
  .reply(200, (_, body) => ({ ...World, players: [{ uuid: Object.keys(body.invites)[0] }] }))
  .put(`/worlds/${config.realmId}/open`)
  .reply(200, true)
  .put(`/worlds/${config.realmId}/close`)
  .reply(200, true)
  .get(`/links/v1?worldId=${config.realmId}`)
  .reply(200, RealmInvite)
  .post('/links/v1')
  .reply(200, RealmInvite[0])
  .get('/invites/count/pending')
  .reply(200, PendingInvitesCount)
  .get('/invites/pending')
  .reply(200, PendingInvites)
  .put(`/invites/accept/${config.realmInvitationId}`)
  .reply(204)
  .put(`/invites/reject/${config.realmInvitationId}`)
  .reply(204)
  .post(`/invites/v1/link/accept/${config.realmInviteCode}`)
  .times(3)
  .reply(200)

describe('Bedrock', () => {
  describe('getRealms', () => {
    it('should return an array of Realm objects', async () => {
      expect(await api.getRealms()).to.deep.equal([World])
    })
  })
  describe('getRealm', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(realm).to.deep.equal(World)
    })
  })
  describe('getRealmFromInvite', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealmFromInvite(config.realmInviteCode)
      expect(realm).to.deep.equal(World)
    })
    it('should return a Realm object when using an invite link', async () => {
      const realm = await api.getRealmFromInvite(config.realmInviteLink)
      expect(realm).to.deep.equal(World)
    })
  })
  describe('getRealmInvite', () => {
    it('should return an invite object', async () => {
      const invite = await api.getRealmInvite(config.realmId)
      expect(invite).to.deep.equal(RealmInviteModified)
    })
  })
  describe('refreshRealmInvite', () => {
    it('should return an invite object', async () => {
      const invite = await api.refreshRealmInvite(config.realmId)
      expect(invite).to.deep.equal(RealmInviteModified)
    })
  })
  describe('getPendingInviteCount', () => {
    it('should return a count', async () => {
      const count = await api.getPendingInviteCount()
      expect(count).to.equal(PendingInvitesCount)
    })
  })
  describe('getPendingInvites', () => {
    it('should return an array of invite objects', async () => {
      const invites = await api.getPendingInvites()
      expect(invites).to.deep.equal(PendingInvitesModified)
    })
  })
  describe('acceptRealmInvitation', () => {
    it('should return void', async () => {
      await api.acceptRealmInvitation(config.realmInvitationId)
    })
  })
  describe('rejectRealmInvitation', () => {
    it('should return void', async () => {
      await api.rejectRealmInvitation(config.realmInvitationId)
    })
  })
  describe('acceptRealmInviteFromCode', () => {
    it('should return void', async () => {
      await api.acceptRealmInviteFromCode(config.realmInviteCode)
    })
  })
  describe('Realm getAddress', () => {
    it('should return an object containing the Realms address', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getAddress()).to.deep.equal({ host: '0.0.0.0', port: 19132 })
    })
  })
  describe('Realm InvitePayer', () => {
    it('should contain the player uuid and realmId included in the request', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.invitePlayer(config.xuid)).to.deep.equal({ ...World, players: [{ uuid: config.xuid }] })
    })
  })
  describe('Realm Open', () => {
    it('should return true indicating Realm is now open', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.open()).to.deep.equal(true)
    })
  })
  describe('Realm Close', () => {
    it('should return true indicating Realm is now closed', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.close()).to.deep.equal(true)
    })
  })
})
