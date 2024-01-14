# RealmsAPI

## Definitions

| Param           | Type                 | Description                                                           |
| --------------- | -------------------- | --------------------------------------------------------------------- |
| realmId         | `string`             | The ID of the Realm                                                   |
| realmInviteCode | `string`             | The invite code for the Realm. This can be used an unlimited amount of times and allows anyone with the code to join the Realm (Only on Bedrock)                                                                |
| invitationId    | `string`             | The ID of the invitation. This can only be used by the player it is sent to and expires after use (Only on Bedrock)                                                                                                |
| username        | `string`             | The username of player                                                |
| uuid            | `string`             | The unique ID of the player, without hyphens                          |
| xuid            | `string`             | The Xbox User ID of the targeted player                               |
| configuration            | `string`             | The array of configurations that can change gamerules and Realm features                                |
| slotId            | `string`             | The ID of one of the Realm world slots. This value can be either 1, 2, or 3                               |
| permission            | `string`             | The permission that can be added to a players. This can resolve to VISITOR, MEMBER, or OPERATOR                               |

## Table of Contents
  - [Bedrock & Java](#bedrock--java)
    - [getRealms](#getrealms)
    - [getRealm](#getrealm)
    - [getRealmBackups](#getrealmbackups)
    - [restoreRealmFromBackup](#restorerealmfrombackup)
    - [getRealmWorldDownload](#getrealmworlddownload)
  - [Bedrock Only](#bedrock-only)
    - [getRealmFromInvite](#getrealmfrominvite)
    - [getRealmInvite](#getrealminvite)
    - [refreshRealmInvite](#refreshrealminvite)
    - [getPendingInviteCount](#getpendinginvitecount)
    - [getPendingInvites](#getpendinginvites)
    - [acceptRealmInvitation](#acceptrealminvitation)
    - [acceptRealmInviteFromCode](#acceptrealminvitefromcode)
    - [rejectRealmInvitation](#rejectrealminvitation)
    - [removePlayerFromRealm](#removeplayerfromrealm)
    - [resetRealm](#resetrealm)
    <!-- - [changeRealmConfiguration](#changerealmconfiguration) -->
    - [opRealmPlayer](#oprealmplayer)
    - [deopRealmPlayer](#deoprealmplayer)
    - [banPlayerFromRealm](#banplayerfromrealm)
    - [unbanPlayerFromRealm](#unbanplayerfromrealm)
    - [removeRealmFromJoinedList](#removerealmfromjoinedlist)
    - [changeIsTexturePackRequired](#changeistexturepackrequired)
    - [changeRealmDefaultPermission](#changerealmdefaultpermission)
    - [changeRealmPlayerPermission](#changerealmplayerpermission)
  - [Structures](#structures)
    - [Realm](#realm)
      - [getAddress](#getaddress)
      - [invitePlayer](#inviteplayer)
      - [open](#open)
      - [close](#close)
      - [delete](#delete)
      - [getBackups](#getbackups)
      - [getWorldDownload](#getworlddownload)
      - [getSubscriptionInfo](#getsubscriptioninfo)
      - [changeActiveSlot](#changeactiveslot)
      - [changeNameAndDescription](#changenameanddescription)
    - [Backup](#backup)
      - [getDownload](#getDownload)
      - [restore](#restore)
    - [Download](#download)
      - [writeToDirectory](#writeToDirectory)
      - [getBuffer](#getBuffer)

## Options
Used for `RealmAPI.from()`
| Param           | Type                 | Description                                                           |
| --------------- | -------------------- | --------------------------------------------------------------------- |
| usePreview      | `Boolean`            | If the Preview Realms API should be used (Only bedrock)               |
---

## Constructor

```js
const { Authflow } = require('prismarine-auth') 
const { RealmAPI } = require('prismarine-realms')

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock' | 'java', options)
```
---

## Bedrock & Java

### getRealms

() => Promise\<Realm[]>

Returns a list of Realms the authenticating account has joined or owns.

```js
await api.getRealms()
```

<details>
<summary>Output</summary>

[Realm](#Realm)[]

</details>

---

### getRealm

(realmId: string) => Promise\<Realm>

Gets detailed information about a Realm if owned

```js
await api.getRealm('1234567')
```

<details>
<summary>Output</summary>

[Realm](#Realm)

</details>

---

### getRealmBackups

(realmId: string, slotId: string) => Promise\<Backup[]>

Gets a list of backups for a Realm

```js
await api.getRealmBackups('1234567', '1')
```

<details>
<summary>Output</summary>

[Backup](#Backup)[]

</details>

---

### restoreRealmFromBackup

(realmId: string, slotId: string, backupId: string) => Promise\<string>

Restores a Realm from a backup

```js
await api.restoreRealmFromBackup('1234567', '1', '1970-01-01T00:00:00.000Z')
```

Either 'Retry again later' or 'true'. Always seems to return 'Retry again later' on the first try.

---

### getRealmWorldDownload

(realmId: string, slotId: string, backupId?: string) => Promise\<object>

*Java will always return the latest state of the world*

Gets the download for a Realm world. If no backup is specified or "latest" is specified, the latest state of the world is returned.

```js
await api.getRealmWorldDownload('1234567', '1', '1970-01-01T00:00:00.000Z')
```

<details>
<summary>Output</summary>

[Download](#Download)

</details>

---

## Bedrock Only

### getRealmFromInvite

(realmInviteCode: string, invite: boolean) => Promise\<Realm>

Gets detailed information about a Realm from the invite code and adds it to the authenticating accounts Realms list if not present. If invite is false, the Realm will not be added to the authenticating accounts Realms list.

```js
await api.getRealmFromInvite('AB1CD2EFA3B') // https://realms.gg/AB1CD2EFA3B will work as well
```

<details>
<summary>Output</summary>

[Realm](#Realm)

</details>

---

### getRealmInvite

(realmId: string) => Promise\<RealmInvite>

Gets the invite code for a Realm

```js
await api.getRealmInvite('1234567')
```

<details>
<summary>Output</summary>

```ts
{
    inviteCode: string,
    ownerXUID: string,
    type: string,
    createdOn: number,
    inviteLink: string,
    deepLinkUrl: string,
}
```

</details>

---

### refreshRealmInvite

(realmId: string) => Promise\<RealmInvite>

Refreshes the invite code for a Realm (Note: This will invalidate the previous invite code)

```js
await api.refreshRealmInvite('1234567')
```

<details>
<summary>Output</summary>

```ts
{
    inviteCode: string,
    ownerXUID: string,
    type: string,
    createdOn: number,
    inviteLink: string,
    deepLinkUrl: string,
}
```

</details>

---

### getPendingInviteCount

() => Promise\<number>

Gets the number of pending invites for the authenticating account

```js
await api.getPendingInviteCount()
```

<details>
<summary>Output</summary>

```ts
number
```

</details>

---

### getPendingInvites

() => Promise\<RealmPlayerInvite[]>

Gets a list of pending invites for the authenticating account

```js
await api.getPendingInvites()
```

<details>
<summary>Output</summary>

```ts
[
    {
        invitationId: string
        worldName: string
        worldDescription: string
        worldOwnerName: string
        worldOwnerXUID: string
        createdOn: number
    }
]
```

</details>

---

### acceptRealmInvitation

(invitationId: string) => Promise\<void>

Accepts a pending invite for the authenticating account

```js
await api.acceptRealmInvitation('1234567')
```

<summary>Output</summary>

No output

</details>

---

### acceptRealmInviteFromCode

(realmInviteCode: string) => Promise\<Realm>

Accepts a Realm invite from an invite link or code.
```js
await api.acceptRealmInviteFromCode('1234567')
```

<summary>Output</summary>

[Realm](#realm)

</details>

---

### rejectRealmInvitation

(invitationId: string) => Promise\<void>

Rejects a pending invite for the authenticating account

```js
await api.rejectRealmInvitation('1234567')
```

<details>
<summary>Output</summary>

No output

</details>

---

### removePlayerFromRealm

(realmId: string, xuid: string) => Promise\<Realm>

Removes a player from the Realm

```js
await api.removePlayerFromRealm('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

[Realm](#realm)

</details>

---

### resetRealm

(realmId: string) => Promise\<void>

Resets a Realm to its default, or brand new state

```js
await api.resetRealm('1234567')
```

<details>
<summary>Output</summary>

No output

</details>

---
<!--
### changeRealmConfiguration

(realmId: string, configuration: object) => Promise\<void>

Updates a Realms configuration. This can be gamerules or general Realm settings

```js
const configuration = { description:{description: "",name: option:{slotName:"Test",pvp:true,spawnAnimals:true,spawnMonster:true,spawnNPCs:true,spawnProtection:0,commandBlocks:false,forceGameMode:false,gameMode:0,difficulty:2,worldTemplateId:-1,worldTemplateImage:"",adventureMap:false,resourcePackHash:null,incompatibilities:[],versionRef:"",versionLock:false,cheatsAllowed:true,texturePacksRequired:true,timeRequest:null,enabledPacks:{resourcePacks:[""],behaviorPacks:[""]},customGameServerGlobalProperties:null,worldSettings:{sendcommandfeedback:{type:0,value:true}commandblocksenabled:{type:0,value:true},dodaylightcycle:{type:0,value:true},randomtickspeed:{type:1,value:3},naturalregeneration:{type:0,value:true},showtags:{type:0,value:true},commandblockoutput:{type:0,value:true},dofiretick:{type:0,value:false},maxcommandchainlength:{type:1,value:65535},falldamage:{type:0,value:true},tntexplodes:{type:0,value:true},drowningdamage:{type:0,value:true},domobloot:{type:0,value:true},domobspawning:{type:0,value:true},showbordereffect:{type:0,value,:true},showdeathmessages:{type:0,value:true},respawnblocksexplode:{type:0,value:true},doweathercycle:{type:0,value:true},doentitydrops:{type:0,value:true},doimmediaterespawn:{type:0,value:true},freezedamage:{type:0,value:true},pvp:{type:0,value:true},keepinventory:{type:0,value:false},doinsomnia:{type:0,value:true},mobgriefing:{type:0,value:true},dotiledrops:{type:0,value:true},firedamage:{type:0,value:true},functioncommandlimit:{type:1,value:10000},spawnradius:{type:1,value:25},showcoordinates:{type:0,value:true}}}}}
await api.changeRealmConfiguration('1234567', coinfiguration)
```

<details>
<summary>Output</summary>

No output

</details>
-->
---

### opRealmPlayer

(realmId: string, uuid: string) => Promise\<Realm>

OPs a player on the Realm

```js
await api.opRealmPlayer('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

[Realm](#realm)

</details>

---

### deopRealmPlayer

(realmId: string, uuid: string) => Promise\<Realm>

DEOPs a player on the Realm

```js
await api.deopRealmPlayer('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

[Realm](#realm)

</details>

---

### banPlayerFromRealm

(realmId: string, uuid: string) => Promise\<void>

Bans a player from the Realm

```js
await api.banPlayerFromRealm('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

---

### unbanPlayerFromRealm

(realmId: string, uuid: string) => Promise\<void>

Unbans a player from the Realm

```js
await api.unbanPlayerFromRealm('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

---

### removeRealmFromJoinedList

(realmId: string) => Promise\<void>

Removes the Realm from your joined list

```js
await api.removeRealmFromJoinedList('1234567')
```

<details>
<summary>Output</summary>

No output

</details>

---

### changeIsTexturePackRequired

(realmId: string, forced: boolean) => Promise\<void>

Changes if a texture pack is required to be applied when joining

```js
await api.changeIsTexturePackRequired('1234567', true)
```

<details>
<summary>Output</summary>

No output

</details>

---

### changeRealmDefaultPermission

(realmId: string, permission: string) => Promise\<void>

Changes the Realms default permission. Permission can be VISITOR, MEMBER, or OPERATOR

```js
await api.changeRealmDefaultPermission('1234567', 'MEMBER')
```

<details>
<summary>Output</summary>

No output

</details>

---

### changeRealmPlayerPermission

(realmId: string, permission: string, uuid: string) => Promise\<void>

Changes the a players permission. Permission can be VISITOR, MEMBER, or OPERATOR

```js
await api.changeRealmPlayerPermission('1234567', 'MEMBER', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

---

## Structures

### Realm

```js
{
    getAddress(): Promise<Address>
    invitePlayer(uuid: string, name: string): Promise<Realm>
    open(): Promise<void>
    close(): Promise<void>
    getBackups(): Promise<Backup[]>
    getWorldDownload(): Promise<Download>
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
```

```ts
interface RealmPlayer {
    uuid: string,
    name: string,
    operator: boolean,
    accepted: boolean,
    online: boolean,
    permission: string
}
```
```ts
interface Slot {
    options: string
    slotId: number
}
```

---

#### getAddress

() => Promise\<Address>

Gets the address for the Realm.

```js
await realm.getAddress()
```

<details>
<summary>Output</summary>

```ts
{
    host: string
    port: number
}
```

</details>

---

#### invitePlayer

(uuid: string, name: string) => Promise\<Realm>

Invites a player to the Realm. On Bedrock the UUID is the player's XUID.

```js
await realm.invitePlayer('a8005260a332457097a50bdbe48a9a21', 'Steve')
```

<details>
<summary>Output</summary>

[Realm](#Realm)

</details>

---

#### open

() => Promise\<boolean>

Opens a Realm. Allows players to join

```js
await realm.open()
```

True if the world has opened

---

#### close

() => Promise\<boolean>

Closes a Realm. Removes all current players and restricts joining

```js
await realm.close()
```

True if the world has closed

---

#### delete

() => Promise\<void>

Deletes a Realm. This removes all worlds and the Realm itself beyond recovery

```js
await realm.delete()
```

No output

---

#### getBackups

() => Promise\<Backup[]>

Gets a list of backups for the Realm

```js
await realm.getBackups()
```

<details>
<summary>Output</summary>

[Backup](#Backup)[]

</details>

---

#### getWorldDownload

() => Promise\<Download>

Gets the most recent download for the Realm's world

```js
await realm.getWorldDownload()
```

<details>
<summary>Output</summary>

[Download](#Download)

</details>

---

#### getSubscriptionInfo

(detailed: boolean) => Promise\<RealmSubscriptionInfo|RealmSubscriptionInfoDetailed>

Gets the subscription info of the Realm

```js
await realm.getSubscriptionInfo(true)
```

<details>
<summary>Output</summary>

```ts
Basic Subscription Info:
{
  startDate: number
  daysLeft: number
  subscriptionType: string
}

Detailed Subscription Info:
{
  type: string
  store: string
  startDate: number
  endDate: number
  renewalPeriod: number
  daysLeft: number
  subscriptionId: string
}
```

</details>

---

#### changeActiveSlot

(realmId: string, slotId, number) => Promise\<boolean>

Changes the active world slot. Slot ID can be 1, 2, or 3 (or 4 for Java Edition)

```js
await realm.changeActiveSlot('1234567', 1)
```

<details>
<summary>Output</summary>

True if the active world is changed

</details>

---

#### changeNameAndDescription

(realmId: string, name: string, description: string) => Promise\<void>

Changes the name and description of the Realm

```js
await realm.changeNameAndDescription('1234567', 'Hello', 'World!')
```

<details>
<summary>Output</summary>

No output

</details>

---

### Backup

```js
{
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
```

---

#### getDownload

() => Promise\<Download>

*Not available on Java*

Gets the download information for the backup

```js
await backup.getDownload()
```

<details>
<summary>Output</summary>

```ts
Buffer
```

</details>

---

#### restore

() => Promise\<void>

Restores the Realm back to this backup

```js
await backup.restore()
```

No output

---

### Download

```js
{
    writeToDirectory(directory: string): Promise<void>
    getBuffer(): Promise<Buffer>
    downloadUrl: string
    fileExtension: '.mcworld' | '.tar.gz'
    resourcePackUrl?: string // Java only
    resourcePackHash?: string // Java only
    size?: number // Bedrock only
    token?: string // Bedrock only
}
```

---

#### writeToDirectory

(directory: string) => Promise\<void>

Downloads the world to the specified directory.

```js
await download.writeToDirectory()
```

No output

---

#### getBuffer

() => Promise\<Buffer>

Downloads the world and returns it as a Buffer

```js
await download.getBuffer()
```

<details>
<summary>Output</summary>

```ts
Buffer
```

</details>
