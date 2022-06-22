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

## Table of Contents
  - [Bedrock & Java](#bedrock--java)
    - [getRealms](#getrealms)
    - [getRealm](#getrealm)
  - [Bedrock Only](#bedrock-only)
    - [getRealmFromInvite](#getrealmfrominvite)
    - [getRealmInvite](#getrealminvite)
    - [refreshRealmInvite](#refreshrealminvite)
    - [getPendingInviteCount](#getpendinginvitecount)
    - [getPendingInvites](#getpendinginvites)
    - [acceptRealmInvitation](#acceptrealminvitation)
    - [rejectRealmInvitation](#rejectrealminvitation)
  - [Structures](#structures)
    - [Realm](#realm)
      - [getAddress](#getaddress)
      - [invitePlayer](#inviteplayer)
      - [open](#open)
      - [close](#close)

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

No output

---

### rejectRealmInvitation

(invitationId: string) => Promise\<void>

Rejects a pending invite for the authenticating account

```js
await api.rejectRealmInvitation('1234567')
```

No output

---

## Structures

### Realm

```js
{
    getAddress(): Promise<Address>
    invitePlayer(uuid: string, name: string): Promise<Realm>
    open(): Promise<void>
    close(): Promise<void>
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
