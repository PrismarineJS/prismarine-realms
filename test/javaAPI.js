/* eslint-env mocha */
const nock = require('nock')

const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const { World, Join, JavaWorldDownload, Backups, Operators, SubscriptionInfo, SubscriptionInfoDetailed } = require('./common/responses.json')

const { RealmAPI } = require('prismarine-realms')
const { Authflow } = require('prismarine-auth')

const Backup = require('../src/structures/Backup')
const Download = require('../src/structures/Download')

const config = {
  realmId: '1112223',
  slotId: '1',
  minigameId: '1',
  backupId: '1970-01-01T00:00:00.000Z',
  uuid: '1111222233334444',
  name: 'Steve'
}

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'java', { skipAuth: true })

nock('https://pc.realms.minecraft.net')
  .get(`/subscriptions/${config.realmId}`) // Subscription info
  .reply(200, SubscriptionInfo)
  .get(`/subscriptions/${config.realmId}/details`) // Subscription info detailed
  .reply(200, SubscriptionInfoDetailed)
  .get(`/worlds/v1/${config.realmId}/join/pc`) // Address
  .reply(200, Join)
  .put(`/worlds/${config.realmId}/open`) // Open Realm
  .reply(200, true)
  .put(`/worlds/${config.realmId}/close`) // Close Realm
  .reply(200, true)
  .put(`/worlds/${config.realmId}/slot/2`) // Change active world slot
  .reply(200, true)
  .post(`/worlds/${config.realmId}`) // Change name and description
  .times(2)
  .reply(200, World)
  .delete(`/worlds/${config.realmId}`) // Delete Realm
  .reply(204)
  .post(`/worlds/${config.realmId}/reset`) // Reset Realm
  .reply(200, true)
  .get(`/worlds/${config.realmId}/backups`) // Get Realm backups
  .times(3)
  .reply(200, Backups)
  .get(`/worlds/${config.realmId}/slot/${config.slotId}/download`) // World download
  .times(2)
  .reply(200, JavaWorldDownload)
  .post(`/ops/${config.realmId}/${config.uuid}`) // Op player
  .reply(200, Operators)
  .delete(`/ops/${config.realmId}/${config.uuid}`) // Deop player
  .reply(200, Operators)
  .post(`/invites/${config.realmId}`) // Invite player
  .reply(200, World)
  .get(`/worlds/${config.realmId}`) // Get Realm
  .times(15)
  .reply(200, World)
  .get('/worlds') // Get Realms
  .reply(200, { servers: [World] })
  .put(`/worlds/${config.realmId}/backups?backupId=${config.backupId}&clientSupportsRetries`) // Restore Realm from backup
  .times(3)
  .reply(204)
  .get('/mco/v1/news') // Get recent Realm news
  .reply(200, { newsLink: 'https://www.minecraft.net/en-us/article/new-realms--after-party' })
  .get('/mco/stageAvailable') // Get stage compatibility
  .reply(200, false)
  .get('/mco/client/compatible') // Get version compatibility
  .reply(200, 'OTHER')
  .get('/trial/new') // Get trial eligibility
  .reply(200, true)
  .delete(`/invites/${config.realmId}`) // Remove Realm from joined list
  .reply(204)
  .get('/mco/available') // Get Realm status
  .reply(200, true)
  .put(`/worlds/minigames/${config.minigameId}/${config.realmId}`) // Change Realm to minigame
  .reply(200, true)
  .post(`/worlds/${config.realmId}/slot/2`) // Change Realm configuration
  .reply(204)
  .delete(`/worlds/${config.realmId}/invite/${config.uuid}`) // Remove player from Realm
  .reply(200, World)
  .post(`/invites/${config.realmId}`) // Invite player
  .reply(200, World)
  .get('/trial') // Get trial eligibility
  .reply(200, true)

describe('Java', () => {
  /**
   * The following tests below are in the Realm object
   */
  describe('Realm getSubscriptionInfo', () => {
    it('should return an array of basic subscription info', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getSubscriptionInfo()).to.deep.equal(SubscriptionInfo)
    })
  })
  describe('Realm getSubscriptionInfoDetailed', () => {
    it('should return an array of detailed subscription info', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getSubscriptionInfoDetailed()).to.deep.equal(SubscriptionInfoDetailed)
    })
  })
  describe('Realm getAddress', () => {
    it('should return an object containing the Realms address', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getAddress()).to.deep.equal({ host: '0.0.0.0', port: 19132 })
    })
  })
  describe('Realm open', () => {
    it('should return true indicating Realm is now open', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.open()).to.deep.equal(true)
    })
  })
  describe('Realm close', () => {
    it('should return true indicating Realm is now closed', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.close()).to.deep.equal(true)
    })
  })
  describe('Realm changeActiveRealmSlot', () => {
    it('should return true to indicate the change has been made', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.changeActiveSlot(2)).to.deep.equal(true)
    })
  })
  describe('Realm changeNameAndDescription', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.changeNameAndDescription('Hello', 'World!')).to.deep.equal(World)
    })
  })
  describe('Realm delete', () => {
    it('should return void indicating Realm is successfully deleted', async () => {
      const realm = await api.getRealm(config.realmId)
      await realm.delete()
    })
  })
  describe('Realm reset', () => {
    it('should return true to indicate it reset the Realm', async () => {
      const reset = await api.resetRealm(config.realmId)
      expect(reset).to.deep.equal(true)
    })
  })
  describe('Realm getBackups', () => {
    it('should return an array of backup objects', async () => {
      const realm = await api.getRealm(config.realmId)
      const backups = await realm.getBackups()
      expect(backups).to.deep.equal(Backups.backups.map(e => new Backup(null, null, e)))
    })
    it('should error when trying to download a backup', async () => {
      const realm = await api.getRealm(config.realmId)
      const backups = await realm.getBackups()
      await expect(backups[0].getDownload()).to.be.rejectedWith('Indiviual backup downloads is not a feature of Java Realms API, only getRealmWorldDownload() is available')
    })
  })
  describe('Realm getWorldDownload', () => {
    it('should return a world download object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getWorldDownload()).to.deep.equal(new Download({ platform: 'java' }, JavaWorldDownload))
    })
  })
  describe('Realm opRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.opPlayer(config.uuid)).to.deep.equal(Operators)
    })
  })
  describe('Realm deopRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.deopPlayer(config.uuid)).to.deep.equal(Operators)
    })
  })
  describe('Realm InvitePayer', () => {
    it('should contain the player uuid and realmId included in the request', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.invitePlayer(config.uuid, config.name)).to.deep.equal(World)
    })
  })

  /**
   * The following tests are for all functions in the RealmAPI class
   */
  describe('getRealm', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(realm).to.deep.equal(World)
    })
  })
  describe('getRealms', () => {
    it('should return an array of Realm objects', async () => {
      expect(await api.getRealms()).to.deep.equal([World])
    })
  })
  describe('restoreRealmFromBackup', () => {
    it('should return void', async () => {
      await api.restoreRealmFromBackup(config.realmId, config.backupId)
    })
  })
  describe('getRecentRealmNews', () => { // TODO
    it('should return a link to the most recent Realm news', async () => {
      await api.restoreRealmFromBackup(config.realmId, config.backupId)
    })
  })
  describe('getStageCompatibility', () => {
    it('should return false all the time', async () => {
      const stageCompatibility = await api.getStageCompatibility()
      expect(stageCompatibility).to.deep.equal(false)
    })
  })
  describe('getVersionCompatibility', () => {
    it('should return OTHER', async () => {
      const versionCompatibility = await api.getVersionCompatibility()
      expect(versionCompatibility).to.deep.equal('OTHER')
    })
  })

  /**
   * The following tests are for all functions that are specific to ONLY Java Edition
   */
  describe('getTrialEligibility', () => {
    it('should return true to indicate 1 month trial is available', async () => {
      expect(await api.getTrialEligibility()).to.deep.equal(true)
    })
  })
  describe('invitePlayer', () => {
    it('should return a Realm object', async () => {
      const invite = await api.invitePlayer(config.realmId, config.uuid)
      expect(invite).to.deep.equal(World)
    })
  })
  describe('removePlayerFromRealm', () => {
    it('should return a Realm object', async () => {
      const removePlayer = await api.removePlayerFromRealm(config.realmId, config.uuid)
      expect(removePlayer).to.deep.equal(World)
    })
  })
  describe('changeConfiguration', () => {
    it('should return void', async () => {
      await api.changeRealmConfiguration(config.realmId, { pvp: true, spawnAnimals: true, spawnMonsters: true, spawnNPCs: true, spawnProtection: 0, commandBlocks: false, difficulty: 2, gameMode: 0, forceGameMode: false, slotName: '', worldTemplateId: -1, worldTemplateImage: null }, 2)
    })
  })
  describe('changeRealmToMinigame', () => {
    it('should return a true', async () => {
      const changeToMinigame = await api.changeRealmToMinigame(config.realmId, config.minigameId)
      expect(changeToMinigame).to.deep.equal(true)
    })
  })
  describe('getRealmStatus', () => {
    it('should return a true', async () => {
      expect(await api.getRealmStatus()).to.deep.equal(true)
    })
  })
})
