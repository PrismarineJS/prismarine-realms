/// <reference types="node" />
declare module 'prismarine-realms' {
  export class RealmAPI {
    /**
     * Creates a new RealmAPI instance, which handles and authenticates calls to the Realms API
     * @param authflow An Authflow instance from [prismarine-auth](https://github.com/PrismarineJS/prismarine-auth).
     * @param platform Which platforms API to access
     */
    constructor(authflow: Authflow, platform: 'bedrock' | 'java')

    static from(authflow: Authflow, platform: 'bedrock' | 'java'): BedrockRealmAPI | JavaRealmAPI 

    getRealms(): Promise<Realm[]>

    getRealm(realmId?: string): Promise<Realm>

  }

  export class BedrockRealmAPI extends RealmAPI {
    getRealmAddress(realmId: string): Promise<Address>
    getRealmFromInvite(realmInviteCode: string): Promise<Realm>
    invitePlayer(realmId: string, uuid: string): Promise<Realm>
    changeRealmState(realmId: string, state: 'open' | 'close'): Pomise<void>
  }

  export class JavaRealmAPI extends RealmAPI {
    getRealmAddress(realmId: string): Promise<Address>
    invitePlayer(realmId: string, uuid: string, name: string): Promise<Realm>
    changeRealmState(realmId: string, state: 'open' | 'close'): Pomise<void>
  }

  export interface Realm {
    getAddress(): Promise<Address>
    invitePlayer(uuid: string, name: string): Promise<Realm>
    open(): Promise<void>
    close(): Promise<void>
    id: number
    remoteSubscriptionId: string
    owner: null
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
    players: RealmPlayer[]
    maxPlayers: number
    minigameName: string
    minigameId: number
    minigameImage: string
    activeSlot: number
    slots: Slot[]
    member: boolean
    clubId: number
    subscriptionRefreshStatus: null
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
    address: string
  }

}
