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
| minigameId        | `string`             | Not confirmed, probably unique Id of Minigame map. Returns `null` for a Realm if not in a minigame                                                |

## Table of Contents
  - [Bedrock & Java](#bedrock--java)
    - [getRealm](#getrealm)
    - [getRealms](#getrealms)
    - [getRealmBackups](#getrealmbackups)
    - [restoreRealmFromBackup](#restorerealmfrombackup)
    - [getRealmWorldDownload](#getrealmworlddownload)
    - [changeRealmConfiguration](#changerealmconfiguration)
    - [resetRealm](#resetrealm)
    - [removeRealmInvite](#removerealminvite)
    - [getRecentRealmNews](#getrecentrealmnews)
    - [getStageCompatibility](#getstagecompatibility)
    - [getVersionCompatibility](#getversioncompatibility)
    - [getTrialEligibility](#gettrialeligibility)
  - [Bedrock Only](#bedrock-only)
    - [getPendingInvites](#getpendinginvites)
    - [getPendingInviteCount](#getpendinginvitecount)
    - [acceptRealmInvitation](#acceptrealminvitation)
    - [acceptRealmInviteFromCode](#aceptrealminvitefromcode)
    - [rejectRealmInvitation](#rejectrealminvitation)
    - [getRealmFromInvite](#getrealmfrominvite)
    - [getRealmBannedPlayers](#getrealmbannedplayers)
    - [banPlayerFromRealm](#banplayerfromrealm)
    - [unbanPlayerFromRealm](#unbanplayerfromrealm)
    - [removeRealmFromJoinedList](#removerealmfromjoinedlist)
    - [changeIsTexturePackRequired](#changeistexturepackrequired)
    - [changeRealmDefaultPermission](#changerealmdefaultpermission)
    - [changeRealmPlayerPermission](#changerealmplayerpermission)
    - [getRealmInvite](#getrealminvite)
    - [refreshRealmInvite](#refreshrealminvite)
  - [Java Only](#java-only)
    - [changeRealmToMinigame](#changerealmtominigame)
    - [getRealmStatus](#getrealmstatus)
  - [Structures](#structures)
    - [Realm](#realm)
      - [getAddress](#getaddress)
      - [invitePlayer](#inviteplayer)
      - [open](#open)
      - [close](#close)
      - [delete](#delete)
      - [reset](#reset)
      - [opPlayer](#opplayer)
      - [deopPlayer](#deopplayer)
      - [getBackups](#getbackups)
      - [getWorldDownload](#getworlddownload)
      - [getSubscriptionInfo](#getsubscriptioninfo)
      - [getSubscriptionInfoDetailed](#getsubscriptioninfodetailed)
      - [changeActiveSlot](#changeactiveslot)
      - [changeNameAndDescription](#changenameanddescription)
    - [Backup](#backup)
      - [getDownload](#getDownload)
      - [restore](#restore)
    - [Download](#download)
      - [writeToDirectory](#writeToDirectory)
      - [getBuffer](#getBuffer)

---

## Constructor

```js
const { Authflow } = require('prismarine-auth') 
const { RealmAPI } = require('prismarine-realms')

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock' | 'java')
```
---

## Bedrock & Java

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

(realmId: string, slotId: string, backupId: string) => Promise\<void>

Restores a Realm from a backup

```js
await api.restoreRealmFromBackup('1234567', '1', '1970-01-01T00:00:00.000Z')
```

No output

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

### changeRealmConfiguration

(realmId: string, configuration: Array, slotId) => Promise\<object>

Changes the configuration of a Realm. This can be the Realms settings and gamerules. Slot ID is only for Java Edition realms

Where `configuration_array_here` is, you can find the configuration array for Java and Bedrock editition [here](https://github.com/PrismarineJS/prismarine-realms/issues/34)

```js
await api.changeRealmConfiguration('1234567', configuration_array_here, '1')
```

<details>
<summary>Output</summary>

Bedrock Edition: [Realm](#realm)
Java Edition: No output

</details>

---

### resetRealm

(realmId: string) => Promise\<boolean>

Resets a Realm to its default world and settings

```js
await api.resetRealm('1234567')
```

<details>
<summary>Output</summary>

True if it successfully reset the Realm. False if it failed to reset the Realm (403 if you are not the owner)

</details>

---

### removeRealmInvite

(realmId: string, uuid: string) => Promise\<Realm>

Removed a player from the Realm. This isn't like banning and only removes the Realm from the players joined list and kicks them if they're logged in

```js
await api.removeRealmInvite('1234567', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

[Realm](#realm)

</details>

---

### getRecentRealmNews

() => Promise\<object>

Retrieves the lastest new about Minecraft Realms

```js
await api.getRecentRealmNews()
```

<details>
<summary>Output</summary>

```ts
{
  newsLink: 'https://www.minecraft.net/article/new-realms--friday-map-fever?ref=pcrealmsclient'
}
```

</details>

---

### getStageCompatibility

() => Promise\<object>

Currently the functionality is unknown.

```js
await api.getStageCompatibility()
```

<details>
<summary>Output</summary>

False

</details>

---

### getVersionCompatibility

() => Promise\<object>

Returns the version compatibility of the client with Minecraft Realms

```js
await api.getVersionCompatibility()
```

<details>
<summary>Output</summary>

If the client is outdated, 'OUTDATED'. If the client running a snapshot, 'OTHER'. Else it returns 'COMPATIBLE'

</details>

---

### getTrialEligibility

() => Promise\<object>

Checks wether or not you can still use the Realms free trial

```js
await api.getTrialEligibility()
```

<details>
<summary>Output</summary>

True if you have a free 1 month trial available. False if you already used your free trial

</details>

---

## Bedrock Only

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

### getRealmBannedPlayers

(realmId: string, uuid: string) => Promise\<void>

Retrieves a list of UUID's of all the banned players of the Realm

```js
await api.getRealmBannedPlayers('1234567')
```

<details>
<summary>Output</summary>

```ts
{
  "UUID1",
  "UUID2"
}
```

</details>

---

### banPlayerFromRealm

(realmId: string, uuid: string) => Promise\<void>

Includes the specified player in the Realms blocklist. This means that they cannot join the Realm

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

Removes the specified player from the Realms blocklist. This means that they can join the Realm again

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

Removes the specified Realm from your joined Realm list

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

Changes if a texture pack is required to be applied when joining a Realm

```js
await api.changeIsTexturePackRequired('1234567', true)
```

<details>
<summary>Output</summary>

No output

</details>

---

### changeRealmDefaultPermission

(realmId: string, permission: string) => Promise\<Realm>

Changes a Realms default permission when a player joins. Permission can be VISITOR, MEMBER, or OPERATOR

```js
await api.changeRealmDefaultPermission('1234567', 'MEMBER')
```

<details>
<summary>Output</summary>

[Realm](#realm)

</details>

---

### changeRealmPlayerPermission

(realmId: string, permission: string, uuid: string) => Promise\<void>

Sets the permission of a player in the Realm. Permission can be VISITOR, MEMBER, or OPERATOR

```js
await api.changeRealmPlayerPermission('1234567', 'MEMBER', 'a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

---

### getRealmInvite

(realmId: string) => Promise\<RealmInvite>

Retrieves a Realms invite code and other invite related information from a Realm ID

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

## Java Only

### changeRealmToMinigame

(realmId: string, minigameId: string) => Promise\<boolean>

Sets a Realm to a minigame

```js
await api.changeRealmToMinigame('1234567', '1')
```

<details>
<summary>Output</summary>

True if successfully set the Realm to minigames

</details>

---

### getRealmStatus

() => Promise\<RealmInvite>

Wether or not you can access the Minecraft Realms Service

```js
await api.getRealmStatus()
```

<details>
<summary>Output</summary>

True if you can access the Minecraft Realms Service. False if you cannot access the Minecraft Realms Service

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

() => Promise\<void>

Opens a Realm. Allows players to join

```js
await realm.open()
```

No output

---

#### close

() => Promise\<void>

Closes a Realm. Removes all current players and restricts joining

```js
await realm.close()
```

No output

---

#### delete

() => Promise\<void>

Deletes a Realm. This removes all worlds and the Realm itself beyond recovery

```js
await realm.delete()
```

No output

---

### opPlayer

(uuid: string) => Promise\<void>

OPs a player on the Realm

```js
await realm.opPlayer('a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

---

### deopPlayer

(uuid: string) => Promise\<void>

DEOPs a player on the Realm

```js
await realm.deopPlayer('a8005260a332457097a50bdbe48a9a21')
```

<details>
<summary>Output</summary>

No output

</details>

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

() => Promise\<RealmSubscriptionInfo>

Gets the basic subscription

```js
await realm.getSubscriptionInfo()
```

<details>
<summary>Output</summary>

```ts
{
  startDate: number
  daysLeft: number
  subscriptionType: string
}
```

</details>

---

#### getSubscriptionInfoDetailed

() => Promise\<RealmSubscriptionInfoDetailed>

Gets the detailed subscription info

```js
await realm.getSubscriptionInfoDetailed()
```

<details>
<summary>Output</summary>

```ts
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

---

#### changeActiveSlot

(realmId: string, slotId, number) => Promise\<void>

Changes the active world slot. Slot ID can be 1, 2, or 3

```js
await realm.changeActiveSlot('1234567', 1)
```

<details>
<summary>Output</summary>

No output

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
