/* eslint-env mocha */
const nock = require('nock')

const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const { World, Join } = require('./common/responses.json')

const { RealmAPI } = require('prismarine-realms')
const { Authflow } = require('prismarine-auth')

const config = {
  realmId: '1112223',
  realmInviteCode: 'AB1CD2EFA3B',
  realmInviteLink: 'https://realms.gg/AB1CD2EFA3B',
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
  .get(`/invites/v1/link/accept/${config.realmInviteCode}`)
  .reply(200, World)
  .put(`/worlds/${config.realmId}/open`)
  .reply(200, true)
  .put(`/worlds/${config.realmId}/close`)
  .reply(200, true)

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
