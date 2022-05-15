# prismarine-realms
[![NPM version](https://img.shields.io/npm/v/prismarine-realms.svg)](http://npmjs.com/package/prismarine-realms)
[![Build Status](https://github.com/PrismarineJS/prismarine-realms/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-realms/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-realms)

Minecraft Realm interface for Minecraft Java and Bedrock editions, providing a stable API to start/stop Realms, and obtain Realm information such as connection addresses.

Minecraft Realms is a subscription based service provided by Mojang where users can host, create and manage their own private Minecraft servers.

## Installation
```shell
npm install prismarine-realms
```

## Usage

### RealmAPI

#### .from(authflow: Authflow, platform: 'bedrock' | 'java')

Takes an **Authflow** instance from [prismarine-auth](https://github.com/PrismarineJS/prismarine-auth), you can see the documentation for this [here.](https://github.com/PrismarineJS/prismarine-auth#authflow)

## API

### Definitions

| Param           | Type                 | Description                                                           |
| --------------- | -------------------- | --------------------------------------------------------------------- |
| realmId         | `string`             | The ID of the Realm                                                   |
| realmInviteCode | `string`             | The invite code for the Realm. This can be used an unlimited amount of times and allows anyone with the code to join the Realm (Only on Bedrock)                                                                |
| invitationId    | `string`             | The ID of the invitation. This can only be used by the player it is sent to and expires after use (Only on Bedrock)                                                                                                |
| username        | `string`             | The username of player                                                |
| uuid            | `string`             | The unique ID of the player, without hyphens                          |
| xuid            | `string`             | The Xbox User ID of the targeted player                               |

---

```js
const { Authflow } = require('prismarine-auth') 
const { RealmAPI } = require('prismarine-realms')

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock')
```

#### getRealms(): Promise<Realm[]>

Returns a list of Realms the authenticating account has joined or owns.

```js
await api.getRealms()
```


#### getRealm(realmId: string): Promise<Realm>

Gets detailed information about a Realm if owned

```js
await api.getRealm('1234567')
```

#### getRealmFromInvite(realmInviteCode: string, invite: boolean): Promise<Realm>

*(Bedrock Edition Only)* Gets detailed information about a Realm from the invite code and adds it to the authenticating accounts Realms list if not present. If invite is false, the Realm will not be added to the authenticating accounts Realms list.

```js
await api.getRealmFromInvite('AB1CD2EFA3B') // https://realms.gg/AB1CD2EFA3B will work as well
```

#### getRealmInvite(realmId: string): Promise<RealmInivte>

*(Bedrock Edition Only)* Gets the invite code for a Realm

```js
await api.getRealmInvite('1234567')
```

#### refreshRealmInvite(realmId: string): Promise<RealmInivte>

*(Bedrock Edition Only)* Refreshes the invite code for a Realm (Note: This will invalidate the previous invite code)

```js
await api.refreshRealmInvite('1234567')
```

#### getPendingInviteCount(): Promise<number>

*(Bedrock Edition Only)* Gets the number of pending invites for the authenticating account

```js
await api.getPendingInviteCount()
```

#### getPendingInvites(): Promise<RealmPlayerInvite[]>

*(Bedrock Edition Only)* Gets a list of pending invites for the authenticating account

```js
await api.getPendingInvites()
```

#### acceptRealmInvitation(invitationId: string): Promise<void>

*(Bedrock Edition Only)* Accepts a pending invite for the authenticating account

```js
await api.acceptRealmInvitation('1234567')
```

#### rejectRealmInvitation(invitationId: string): Promise<void>

*(Bedrock Edition Only)* Rejects a pending invite for the authenticating account

```js
await api.rejectRealmInvitation('1234567')
```

#### getAddress(): Promise<{ host, port }>

Gets the address for the Realm.

```js
const realm = await api.getRealm('1234567')

await realm.getAddress()
```

#### invitePlayer(uuid: string, name: string): Promise<void>

Invites a player to the Realm

```js
const realm = await api.getRealm('1234567')

await realm.invitePlayer('a8005260a332457097a50bdbe48a9a21', 'Steve')
```

#### open(): Promise<void>

Opens a Realm. Allows players to join

```js
const realm = await api.getRealm('1234567')

await realm.open()
```

#### close(): Promise<void>

Closes a Realm. Removes all current players and restricts joining

```js
const realm = await api.getRealm('1234567')

await realm.close()
```

---
