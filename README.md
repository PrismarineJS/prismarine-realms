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
| realmInviteCode | `string`             | The invite code for the Realm (Only on Bedrock)                       |
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

#### getRealmFromInvite(realmInviteCode: string): Promise<Realm>

*(Bedrock Edition Only)* Gets detailed information about a Realm from the invite code

```js
await api.getRealmFromInvite('AB1CD2EFA3B') // https://realms.gg/AB1CD2EFA3B will work as well
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
