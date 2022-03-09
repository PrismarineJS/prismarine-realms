/* eslint-env mocha */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const { expect } = chai

const config = {
  realmId: '0000000',
  uuid: '3333dddd2222cccc1111bbbb0000aaaa',
  name: 'Steve'
}

const nock = require('nock')

const { RealmAPI } = require('prismarine-realms')

const api = new RealmAPI('RealmAPITest', './', { test: true }).Java

nock('https://pc.realms.minecraft.net')
  .get('/worlds')
  .reply(200, { servers: [] })
  .get(`/worlds/${config.realmId}`)
  .reply(200, { id: config.realmId })
  .get(`/worlds/v1/${config.realmId}/join/pc`)
  .reply(200, { address: '0.0.0.0:19132', resourcePackUrl: null, resourcePackHash: null })
  .post(`/invites/${config.realmId}`)
  .reply(200, (_, body) => ({ id: config.realmId, players: [{ uuid: body.uuid, name: body.name }] }))

describe('Java', () => {
  describe('Account getRealms', () => {
    it('should return an object with a servers property', async () => {
      expect(await api.account.getRealms()).to.deep.equal({ servers: [] })
    })
  })
  describe('Realm getInfo', () => {
    it('should contain the realmId included in the request', async () => {
      expect(await api.realm.getInfo(config.realmId)).to.deep.equal({ id: config.realmId })
    })
  })
  describe('Realm getConnection', () => {
    it('should return an object containing connection information', async () => {
      expect(await api.realm.getConnection(config.realmId)).to.have.keys(['ip', 'port', 'address', 'resourcePackUrl', 'resourcePackHash'])
    })
  })
  describe('Realm Player invite', () => {
    it('should contain the player uuid and realmId included in the request', async () => {
      expect(await api.realm.player.invite(config.realmId, { uuid: config.uuid, name: config.name })).to.deep.equal({ id: config.realmId, players: [{ uuid: config.uuid, name: config.name }] })
    })
  })
})
