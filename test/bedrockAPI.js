/* eslint-env mocha */
const nock = require('nock')

const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const { World, Join, RealmInvite, RealmInviteModified, PendingInvites, PendingInvitesModified, PendingInvitesCount, BedrockWorldDownload, Backups, SubscriptionInfoDetailed, SubscriptionInfo } = require('./common/responses.json')

const { RealmAPI } = require('prismarine-realms')
const { Authflow } = require('prismarine-auth')

const Backup = require('../src/structures/Backup')
const Download = require('../src/structures/Download')

const config = {
  realmId: '1112223',
  slotId: '1',
  backupId: '1970-01-01T00:00:00.000Z',
  realmInviteCode: 'AB1CD2EFA3B',
  realmInviteLink: 'https://realms.gg/AB1CD2EFA3B',
  realmInvitationId: '11223344',
  xuid: '1111222233334444'
}

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock', { skipAuth: true })

nock('https://pocket.realms.minecraft.net')
  .get(`/worlds/${config.realmId}`) // Get Realm
  .times(16)
  .reply(200, World)
  .get(`/subscriptions/${config.realmId}`) // Subscription info
  .reply(200, SubscriptionInfo)
  .get(`/subscriptions/${config.realmId}/details`) // Subscription info detailed
  .reply(200, SubscriptionInfoDetailed)
  .get(`/worlds/${config.realmId}/join`) // Address
  .reply(200, Join)
  .put(`/worlds/${config.realmId}/open`) // Open Realm
  .reply(200, true)
  .put(`/worlds/${config.realmId}/close`) // Close Realm
  .reply(200, true)
  .put(`/worlds/${config.realmId}/slot/2`) // Change active world slot
  .reply(200, true)
  .post(`/worlds/${config.realmId}`) // Change name and description
  .reply(200, World)
  .delete(`/worlds/${config.realmId}`) // Delete Realm
  .reply(204)
  .put(`/worlds/${config.realmId}/reset`) // Reset Realm
  .reply(200, true)
  .get(`/worlds/${config.realmId}/backups`) // Get Realm backups
  .times(3)
  .reply(200, Backups)
  .get(`/archive/download/world/${config.realmId}/${config.slotId}/${config.backupId}`) // World download
  .times(2)
  .reply(200, BedrockWorldDownload)
  .get(`/archive/download/world/${config.realmId}/${config.slotId}/latest`) // World download
  .reply(200, BedrockWorldDownload)
  .put(`/invites/${config.realmId}/invite/update`) // OP, DEOP, invite player, and remove player from Realm
  .times(5)
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
  .get(`/worlds/v1/link/${config.realmInviteCode}`) // Get Realm from invite
  .times(2)
  .reply(200, World)
  .get(`/links/v1?worldId=${config.realmId}`) // Get Realm invite
  .reply(200, RealmInvite)
  .post('/links/v1') // Refresh Realm invite
  .reply(200, RealmInvite[0])
  .get('/invites/count/pending') // Get pending invites count
  .reply(200, PendingInvitesCount)
  .get('/invites/pending') // Get pending invites
  .reply(200, PendingInvites)
  .put(`/invites/accept/${config.realmInvitationId}`) // Accept Realm invitation
  .reply(204)
  .put(`/invites/reject/${config.realmInvitationId}`) // Reject Realm invitation
  .reply(204)
  .post(`/invites/v1/link/accept/${config.realmInviteCode}`) // Accept Realm invite from code
  .times(3)
  .reply(200)
  .post(`/worlds/${config.realmId}/blocklist/${config.xuid}`) // Ban player from Realm
  .reply(204)
  .delete(`/worlds/${config.realmId}/blocklist/${config.xuid}`) // Unban player from Realm
  .reply(204)
  .get(`/worlds/${config.realmId}/blocklist`) // Get Realm banned players
  .reply(200, [config.xuid])
  .delete(`/invites/${config.realmId}`) // Remove Realm from joined list
  .reply(204)
  .put(`/worlds/${config.realmId}/content/texturePacksRequired`) // Change is texture packs required (on)
  .reply(204)
  .delete(`/worlds/${config.realmId}/content/texturePacksRequired`) // Change is texture packs required (off)
  .reply(204)
  .put(`/world/${config.realmId}/defaultPermission`) // Change default Realm permission
  .reply(204)
  .put(`/world/${config.realmId}/userPermission`) // Change player Realm permission
  .reply(204)
  .post(`/worlds/${config.realmId}/configuration`)
  .reply(204)

describe('Bedrock', () => {
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
      expect(await realm.getBackups()).to.deep.equal(Backups.backups.map(e => new Backup(null, null, e)))
    })
    it('downloading a backup should return a world download object', async () => {
      const realm = await api.getRealm(config.realmId)
      const [backup] = await realm.getBackups()
      expect(await backup.getDownload()).to.deep.equal(new Download({ platform: 'bedrock' }, BedrockWorldDownload))
    })
    it('restoring a backup should return void', async () => {
      const realm = await api.getRealm(config.realmId)
      const [backup] = await realm.getBackups()
      await backup.restore()
    })
  })
  describe('Realm getWorldDownload', () => {
    it('should return a world download object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getWorldDownload()).to.deep.equal(new Download({ platform: 'bedrock' }, BedrockWorldDownload))
    })
  })
  describe('Realm opRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.opPlayer(config.realmId, config.xuid)).to.deep.equal(World)
    })
  })
  describe('Realm deopRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.deopPlayer(config.realmId, config.xuid)).to.deep.equal(World)
    })
  })
  describe('Realm InvitePayer', () => {
    it('should contain the player xuid and realmId included in the request', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.invitePlayer(config.xuid)).to.deep.equal(World)
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
   * The following tests are for all functions that are specific to ONLY Bedrock Edition
   */
  describe('getTrialEligibility', () => {
    it('should return true to indicate 1 month trial is available', async () => {
      expect(await api.getTrialEligibility()).to.deep.equal(true)
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
  describe('invitePlayer', () => {
    it('should return a Realm object', async () => {
      const invite = await api.invitePlayer(config.realmId, config.xuid)
      expect(invite).to.deep.equal(World)
    })
  })
  describe('removePlayerFromRealm', () => {
    it('should return a Realm object', async () => {
      const removePlayer = await api.removePlayerFromRealm(config.realmId, config.xuid)
      expect(removePlayer).to.deep.equal(World)
    })
  })
  describe('banPlayerFromRealm', () => {
    it('should return void', async () => {
      await api.banPlayerFromRealm(config.realmId, config.xuid)
    })
  })
  describe('unbanPlayerFromRealm', () => {
    it('should return void', async () => {
      await api.unbanPlayerFromRealm(config.realmId, config.xuid)
    })
  })
  describe('getRealmBannedPlayers', () => {
    it('should return an array of XUIDs for banned players', async () => {
      const bannedPlayersList = await api.getRealmBannedPlayers(config.realmId)
      expect(bannedPlayersList).to.deep.equal([config.xuid])
    })
  })
  describe('removeRealmFromJoinedList', () => {
    it('should return void', async () => {
      await api.removeRealmFromJoinedList(config.realmId)
    })
  })
  describe('changeIsTexturePackRequired', () => {
    it('should return void', async () => {
      await api.changeIsTexturePackRequired(config.realmId, true)
    })
  })
  describe('changeRealmDefaultPermission', () => {
    it('should return void', async () => {
      await api.changeRealmDefaultPermission(config.realmId, 'MEMBER')
    })
  })
  describe('changeRealmPlayerPermission', () => {
    it('should return void', async () => {
      await api.changeRealmPlayerPermission(config.realmId, 'MEMBER', config.xuid)
    })
  })
  describe('changeConfiguration', () => {
    it('should return void', async () => {
      await api.changeRealmConfiguration(config.realmId, '{ "description":{"description": "","name": ""options":{"slotName":"Test","pvp":true,"spawnAnimals":true,"spawnMonsters":true,"spawnNPCs":true,"spawnProtection":0,"commandBlocks":false,"forceGameMode":false,"gameMode":0,"difficulty":2,"worldTemplateId":-1,"worldTemplateImage":"","adventureMap":false,"resourcePackHash":null,"incompatibilities":[],"versionRef":"","versionLock":false,"cheatsAllowed":true,"texturePacksRequired":true,"timeRequest":null,"enabledPacks":{"resourcePacks":[""],"behaviorPacks":[""]},"customGameServerGlobalProperties":null,"worldSettings":{"sendcommandfeedback":{"type":0,"value":true},"commandblocksenabled":{"type":0,"value":true},"dodaylightcycle":{"type":0,"value":true},"randomtickspeed":{"type":1,"value":3},"naturalregeneration":{"type":0,"value":true},"showtags":{"type":0,"value":true},"commandblockoutput":{"type":0,"value":true},"dofiretick":{"type":0,"value":false},"maxcommandchainlength":{"type":1,"value":65535},"falldamage":{"type":0,"value":true},"tntexplodes":{"type":0,"value":true},"drowningdamage":{"type":0,"value":true},"domobloot":{"type":0,"value":true},"domobspawning":{"type":0,"value":true},"showbordereffect":{"type":0,"value":true},"showdeathmessages":{"type":0,"value":true},"respawnblocksexplode":{"type":0,"value":true},"doweathercycle":{"type":0,"value":true},"doentitydrops":{"type":0,"value":true},"doimmediaterespawn":{"type":0,"value":true},"freezedamage":{"type":0,"value":true},"pvp":{"type":0,"value":true},"keepinventory":{"type":0,"value":false},"doinsomnia":{"type":0,"value":true},"mobgriefing":{"type":0,"value":true},"dotiledrops":{"type":0,"value":true},"firedamage":{"type":0,"value":true},"functioncommandlimit":{"type":1,"value":10000},"spawnradius":{"type":1,"value":25},"showcoordinates":{"type":0,"value":true}}}}')
    })
  })
})
