/// <reference types="node" />
import { Authflow } from "prismarine-auth";

declare module 'prismarine-realms' {
  export class RealmAPI {
    /**
     * Creates a new RealmAPI instance, which handles and authenticates calls to the Realms API
     * @param authflow An Authflow instance from [prismarine-auth](https://github.com/PrismarineJS/prismarine-auth).
     * @param platform Which platforms API to access
     */
    constructor(authflow: Authflow, platform: 'bedrock' | 'java')

    static from(authflow: Authflow, platform: 'bedrock' | 'java'): BedrockRealmAPI | JavaRealmAPI 

    getRealm(realmId: string): Promise<Realm>
    getRealms(): Promise<Realm[]>
    getRealmBackups(realmId: string, slotId: string): Promise<Backup[]>
    restoreRealmFromBackup(realmId: string, slotId: string, backupId: string): Promise<void>
    getRealmSubscriptionInfo(realmId: string): Promise<RealmSubscriptionInfo>
    getRealmSubscriptionInfoDetailed(realmId: string): Promise<RealmSubscriptionInfoDetailed>
    deleteRealm(realmId: string): Promise<void>
    changeRealmState(realmId: string, state: 'open' | 'close'): Promise<void>
    changeRealmActiveSlot(realmId: string, slotId: number): Promise<void>
    changeRealmNameAndDescription(realmId: string, name: string, description: string): Promise<void>
    getRecentRealmNews(): Promise<void>
    getStageCompatibility(): Promise<void>
    getVersionCompatibility(): Promise<void>
    // All functions below are names in the same in both Bedrock and Java but hit different endpoints
    getRealmAddress(realmId: string): Promise<Address>
    resetRealm(realmId: string): Promise<void>
    getRealmWorldDownload(realmId: string, slotId: string, backupId?: string | 'latest'): Promise<Download>
    opRealmPlayer(realmId: string, uuid: string): Promise<void>
    deopRealmPlayer(realmId: string, uuid: string): Promise<void>
    getTrialEligibility(): Promise<void>
  }

  export class BedrockRealmAPI extends RealmAPI {
    getRealmFromInvite(realmInviteCode: string, invite: boolean): Promise<Realm>
    getRealmInvite(realmId: string): Promise<RealmInvite>
    refreshRealmInvite(realmId: string): Promise<RealmInvite>
    getPendingInviteCount(): Promise<number>
    getPendingInvites(): Promise<RealmPlayerInvite[]>
    acceptRealmInvitation(invitationId: string): Promise<void>
    rejectRealmInvitation(invitationId: string): Promise<void>
    acceptRealmInviteFromCode(realmInviteCode: string): Promise<void>
    invitePlayer(realmId: string, xuid: string): Promise<Realm> // This is also in Java Edition but this doesn't take the name param
    removePlayerFromRealm(realmId: string, xuid: string): Promise<Realm>
    banPlayerFromRealm(realmId: string, xuid: string): Promise<void>
    unbanPlayerFromRealm(realmId: string, xuid: string): Promise<void>
    getRealmBannedPlayers(realmId: string): Promise<void>
    removeRealmFromJoinedList(realmId: string): Promise<void>
    changeIsTexturePackRequired(realmId: string, forced: boolean): Promise<Realm>
    changeRealmDefaultPermission(realmId: string, permission: 'VISITOR' | 'MEMBER' | 'OPERATOR'): Promise<Realm>
    changeRealmPlayerPermission(realmId: string, permission: 'VISITOR' | 'MEMBER' | 'OPERATOR', xuid: string): Promise<void>
    changeRealmConfiguration(realmId: string, configuration: Array): Promise<void> // This is also in Java Edition but this doesn't take the slotId param
  }

  export class JavaRealmAPI extends RealmAPI {
    invitePlayer(realmId: string, uuid: string, name: string): Promise<Realm>
    removePlayerFromRealm(realmId: string, uuid: string): Promise<void>
    changeRealmConfiguration(realmId: string, configuration: Array, slotId: number): Promise<void>
    changeRealmToMinigame(realmId: string, minigameId: number): Promise<void>
    getRealmStatus(): Promise<void>
  }

  export interface Realm {
    getSubscriptionInfo(): Promise<void>
    getSubscriptionInfoDetailed(): Promise<void>
    getAddress(): Promise<Address>
    open(): Promise<void>
    close(): Promise<void>
    changeActiveSlot(slotId: string): Promise<void>
    changeNameAndDescription(name: string, description: string): Promise<void>
    delete(): Promise<void>
    reset(): Promise<void>
    getBackups(): Promise<Backup[]>
    getWorldDownload(): Promise<Download>
    opPlayer(uuid: string): Promise<void>
    deopPlayer(uuid: string): Promise<void>
    invitePlayer(uuid: string, name: string): Promise<Realm>
    id: number
    remoteSubscriptionId: string
    owner: string | null
    ownerUUID: string
    name: string
    motd: string
    defaultPermission: string
    state: string
    daysLeft: number
    expired: boolean
    expiredTrial: boolean
    gracePeriod: boolean
    worldType: string
    players: RealmPlayer[] | null
    maxPlayers: number
    minigameName: string
    minigameId: number
    minigameImage: string
    activeSlot: number
    slots: Slot[] | null
    member: boolean
    clubId: number
    subscriptionRefreshStatus: null
  }

  export interface Backup {
    getDownload(): Promise<Download>
    restore(): Promise<void>
    id: string
    lastModifiedDate: number
    size: number
    metadata: {
        gameDifficulty: string
        name: string
        gameServerVersion: string
        enabledPacks: { 
          resourcePack: string
          behaviorPack: string
        }
        description: string | null
        gamemode: string
        worldType: string
    }
  }

  export interface Download {
    writeToDirectory(directory: string): Promise<void>
    getBuffer(): Promise<Buffer>
    downloadUrl: string
    fileExtension: '.mcworld' | '.tar.gz'
    resourcePackUrl?: string // Java only
    resourcePackHash?: string // Java only
    size?: number // Bedrock only
    token?: string // Bedrock only
  }

  export interface RealmSubscriptionInfo {
    startDate: number
    daysLeft: number
    subscriptionType: string
  }

  export interface RealmSubscriptionInfoDetailed {
    type: string
    store: string
    startDate: number
    endDate: number
    renewalPeriod: number
    daysLeft: number
    subscriptionId: string
  }

  export interface RealmPlayerInvite {
    invitationId: string
    worldName: string
    worldDescription: string
    worldOwnerName: string
    worldOwnerXUID: string
    createdOn: number
  }

  export interface RealmInvite {
    inviteCode: string,
    ownerXUID: string,
    type: string,
    createdOn: number,
    inviteLink: string,
    deepLinkUrl: string,
  }

  export interface RealmPlayer {
      uuid: string,
      name: string,
      operator: boolean,
      accepted: boolean,
      online: boolean,
      permission: string
  }

  export interface Slot {
      options: string
      slotId: number
  }

  export interface Address {
    host: string
    port: number
  }

}
