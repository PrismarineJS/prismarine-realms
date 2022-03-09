/* eslint-env mocha */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const { expect } = chai

const config = {
  realmId: '0000000',
  realmInviteCode: 'AB1CD2EFA3B',
  xuid: '1234567890'
}

const nock = require('nock')

const { RealmAPI } = require('prismarine-realms')

const api = new RealmAPI('RealmAPITest', './', { test: true }).Bedrock

nock('https://pocket.realms.minecraft.net')
  .get('/worlds')
  .reply(200, { servers: [] })
  .get(`/worlds/${config.realmId}`)
  .reply(200, { id: config.realmId })
  .get(`/worlds/${config.realmId}/blocklist`)
  .reply(200, [])
  .get(`/worlds/${config.realmId}/join`)
  .reply(200, { address: '0.0.0.0:19132', pendingUpdate: false })
  .get(`/worlds/v1/link/${config.realmInviteCode}`)
  .reply(200, {})
  .put(`/invites/${config.realmId}/invite/update`)
  .reply(200, (_, body) => ({ id: config.realmId, players: [{ uuid: Object.keys(body.invites)[0] }] }))

describe('Bedrock', () => {
  describe('Account getRealms', () => {
    it('should return an object with a servers key and an array as it\'s value', async () => {
      expect(await api.account.getRealms()).to.deep.equal({ servers: [] })
    })
  })
  describe('Realm getInfo', () => {
    it('should contain the realmId included in the request', async () => {
      expect(await api.realm.getInfo(config.realmId)).to.deep.equal({ id: config.realmId })
    })
  })
  describe('Realm getInfoByInvite', () => {
    it('should return an object', async () => {
      expect(await api.realm.getInfoByInvite(config.realmInviteCode)).to.deep.equal({})
    })
  })
  describe('Realm getBlocklist', () => {
    it('should return an array', async () => {
      expect(await api.realm.getBlocklist(config.realmId)).to.deep.equal([])
    })
  })
  describe('Realm getConnection', () => {
    it('should return an object containing connection information', async () => {
      expect(await api.realm.getConnection(config.realmId)).to.have.keys(['ip', 'port', 'address', 'pendingUpdate'])
    })
  })
  describe('Realm Player invite', () => {
    it('should contain the player uuid and realmId included in the request', async () => {
      expect(await api.realm.player.invite(config.realmId, config.xuid)).to.deep.equal({ id: config.realmId, players: [{ uuid: config.xuid }] })
    })
  })
})
