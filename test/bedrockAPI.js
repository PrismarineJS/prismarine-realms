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

nock('https://pocket.realms.minecraft.net/')
  .get('/worlds')
  .reply(200, { servers: [World] })
  .get(`/worlds/${config.realmId}`)
  .times(10)
  .reply(200, World)
  // Expect two POSTs for changeNameAndDescription workaround
  .post(`/worlds/${config.realmId}`, { name: 'Hello', description: '' })
  .reply(204)
  .post(`/worlds/${config.realmId}`, { name: 'Hello', description: 'World!' })
  .reply(204)
  .post(`/worlds/${config.realmId}`)
  .reply(204)
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
  .get(`/archive/download/world/${config.realmId}/${config.slotId}/${config.backupId}`)
  .times(2)
  .reply(200, BedrockWorldDownload)
  .get(`/archive/download/world/${config.realmId}/${config.slotId}/latest`)
  .reply(200, BedrockWorldDownload)
  .get(`/worlds/${config.realmId}/backups`)
  .times(3)
  .reply(200, Backups)
  .put(`/worlds/${config.realmId}/backups?backupId=${config.backupId}&clientSupportsRetries`)
  .times(2)
  .reply(204)
  .persist()
  .delete(`/worlds/${config.realmId}`)
  .reply(204)
  .get(`/subscriptions/${config.realmId}/details`)
  .reply(200, SubscriptionInfoDetailed)
  .get(`/subscriptions/${config.realmId}`)
  .reply(200, SubscriptionInfo)
  .put(`/worlds/${config.realmId}/slot/2`)
  .reply(200, true)
  .put(`/worlds/${config.realmId}`)
  .reply(200, World)
  .put(`/worlds/${config.realmId}/reset`)
  .reply(200, true)
  .put(`/worlds/${config.realmId}/configuration`)
  .reply(204)
  .post(`/worlds/${config.realmId}/blocklist/${config.xuid}`)
  .reply(204)
  .delete(`/worlds/${config.realmId}/blocklist/${config.xuid}`)
  .reply(204)
  .delete(`/invites/${config.realmId}`)
  .reply(204)
  .put(`/world/${config.realmId}/content/texturePacksRequired`)
  .reply(204)
  .put(`/world/${config.realmId}/defaultPermission`)
  .reply(204)
  .put(`/world/${config.realmId}/userPermission`)
  .reply(204)

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
  describe('restoreRealmFromBackup', () => {
    it('should return void', async () => {
      await api.restoreRealmFromBackup(config.realmId, config.backupId)
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
  describe('Realm Delete', () => {
    it('should return void indicating Realm is successfully deleted', async () => {
      const realm = await api.getRealm(config.realmId)
      await realm.delete()
    })
  })
  describe('Realm getSubscriptionInfo', () => {
    it('should return an array of basic subscription info', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getSubscriptionInfo()).to.deep.equal(SubscriptionInfo)
    })
    it('should return an array of detailed subscription info', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.getSubscriptionInfo(true)).to.deep.equal(SubscriptionInfoDetailed)
    })
  })
  describe('Realm changeActiveRealmSlot', () => {
    it('should return true to indicate the change has been made', async () => {
      const realm = await api.getRealm(config.realmId)
      expect(await realm.changeActiveSlot(2)).to.deep.equal(true)
    })
  })
  describe('Realm changeNameAndDescription', () => {
    it('should return void', async () => {
      const realm = await api.getRealm(config.realmId)
      await realm.changeNameAndDescription(config.realmId, 'Hello', 'World!')
    })
  })
  describe('Realm reset', () => {
    it('should return void', async () => {
      await api.resetRealm(config.realmId)
    })
  })
  // describe('Realm changeConfiguration', () => {
  //   it('should return void', async () => {
  //     const configuration = {
  //       description: {
  //         description: '',
  //         name: '',
  //         options: {
  //           slotName: 'Test',
  //           pvp: true,
  //           spawnAnimals: true,
  //           spawnMonsters: true,
  //           spawnNPCs: true,
  //           spawnProtection: 0,
  //           commandBlocks: false,
  //           forceGameMode: false,
  //           gameMode: 0,
  //           difficulty: 2,
  //           worldTemplateId: -1,
  //           worldTemplateImage: '',
  //           adventureMap: false,
  //           resourcePackHash: null,
  //           incompatibilities: [],
  //           versionRef: '',
  //           versionLock: false,
  //           cheatsAllowed: true,
  //           texturePacksRequired: true,
  //           timeRequest: null,
  //           enabledPacks: {
  //             resourcePacks: [''],
  //             behaviorPacks: ['']
  //           },
  //           customGameServerGlobalProperties: null,
  //           worldSettings: {
  //             sendcommandfeedback: {
  //               type: 0,
  //               value: true
  //             },
  //             commandblocksenabled: {
  //               type: 0,
  //               value: true
  //             },
  //             dodaylightcycle: {
  //               type: 0,
  //               value: true
  //             },
  //             randomtickspeed: {
  //               type: 1,
  //               value: 3
  //             },
  //             naturalregeneration: {
  //               type: 0,
  //               value: true
  //             },
  //             showtags: {
  //               type: 0,
  //               value: true
  //             },
  //             commandblockoutput: {
  //               type: 0,
  //               value: true
  //             },
  //             dofiretick: {
  //               type: 0,
  //               value: false
  //             },
  //             maxcommandchainlength: {
  //               type: 1,
  //               value: 65535
  //             },
  //             falldamage: {
  //               type: 0,
  //               value: true
  //             },
  //             tntexplodes: {
  //               type: 0,
  //               value: true
  //             },
  //             drowningdamage: {
  //               type: 0,
  //               value: true
  //             },
  //             domobloot: {
  //               type: 0,
  //               value: true
  //             },
  //             domobspawning: {
  //               type: 0,
  //               value: true
  //             },
  //             showbordereffect: {
  //               type: 0,
  //               value: true
  //             },
  //             showdeathmessages: {
  //               type: 0,
  //               value: true
  //             },
  //             respawnblocksexplode: {
  //               type: 0,
  //               value: true
  //             },
  //             doweathercycle: {
  //               type: 0,
  //               value: true
  //             },
  //             doentitydrops: {
  //               type: 0,
  //               value: true
  //             },
  //             doimmediaterespawn: {
  //               type: 0,
  //               value: true
  //             },
  //             freezedamage: {
  //               type: 0,
  //               value: true
  //             },
  //             pvp: {
  //               type: 0,
  //               value: true
  //             },
  //             keepinventory: {
  //               type: 0,
  //               value: false
  //             },
  //             doinsomnia: {
  //               type: 0,
  //               value: true
  //             },
  //             mobgriefing: {
  //               type: 0,
  //               value: true
  //             },
  //             dotiledrops: {
  //               type: 0,
  //               value: true
  //             },
  //             firedamage: {
  //               type: 0,
  //               value: true
  //             },
  //             functioncommandlimit: {
  //               type: 1,
  //               value: 10000
  //             },
  //             spawnradius: {
  //               type: 1,
  //               value: 25
  //             },
  //             showcoordinates: {
  //               type: 0,
  //               value: true
  //             }
  //           }
  //         }
  //       }
  //     }
  //     await api.changeRealmConfiguration(config.realmId, configuration)
  //   })
  // })
  describe('Realm removePlayerFromRealm', () => {
    it('should return a Realm object', async () => {
      const removedInvite = await api.removePlayerFromRealm(config.realmId, config.xuid)
      expect(removedInvite).to.deep.equal({ ...World, players: [{ uuid: config.xuid }] })
    })
  })
  describe('Realm opRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const op = await api.opRealmPlayer(config.realmId, config.xuid)
      expect(op).to.deep.equal({ ...World, players: [{ uuid: config.xuid }] })
    })
  })
  describe('Realm deopRealmPlayer', () => {
    it('should return a Realm object', async () => {
      const deop = await api.deopRealmPlayer(config.realmId, config.xuid)
      expect(deop).to.deep.equal({ ...World, players: [{ uuid: config.xuid }] })
    })
  })
  describe('Realm banPlayerFromRealm', () => {
    it('should return void', async () => {
      await api.banPlayerFromRealm(config.realmId, config.xuid)
    })
  })
  describe('Realm unbanPlayerFromRealm', () => {
    it('should return void', async () => {
      await api.unbanPlayerFromRealm(config.realmId, config.xuid)
    })
  })
  describe('Realm removeRealmFromJoinedList', () => {
    it('should return void', async () => {
      await api.removeRealmFromJoinedList(config.realmId)
    })
  })
  describe('Realm changeIsTexturePackRequired', () => {
    it('should return void', async () => {
      await api.changeIsTexturePackRequired(config.realmId, true)
    })
  })
  describe('Realm changeRealmDefaultPermission', () => {
    it('should return void', async () => {
      await api.changeRealmDefaultPermission(config.realmId, 'MEMBER')
    })
  })
  describe('Realm changeRealmPlayerPermission', () => {
    it('should return void', async () => {
      await api.changeRealmPlayerPermission(config.realmId, 'MEMBER', config.xuid)
    })
  })
})
