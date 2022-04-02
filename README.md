# prismarine-realms
[![NPM version](https://img.shields.io/npm/v/prismarine-realms.svg)](http://npmjs.com/package/prismarine-realms)
[![Build Status](https://github.com/PrismarineJS/prismarine-realms/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-realms/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-realms)

Node.JS Wrapper around both the Java & Bedrock Realms API. Minecraft Realms is a subscription based service provided by Mojang where users can create/manage their own private server. The intention of this package is to provide easy access to the internal API used to manage Realms such as opening/closing a Realm, managing players, getting host information and much more. 

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
| uuid            | `string`             | The unique ID of the player, w/o hyphens                              |
| xuid            | `string`             | The Xbox User ID of the targeted player                               |

---

```js
const { Authflow } = require('prismarine-auth') 
const { RealmAPI } = require('prismarine-realms')

const authflow = new Authflow()

const api = RealmAPI.from(authflow, 'bedrock')
```

#### getRealms()

Gets a list of Realms the authenticating account has joined or owns

```js
await api.getRealms()
```


#### getRealm(realmId: string)

Gets detailed information about a Realm if owned

```js
await api.getRealm('1234567')
```

#### getAddress()

Gets the address for the Realm

```js
const realm = await api.getRealm('1234567')

await realm.getAddress()
```

#### invitePlayer(uuid: string, name: string)

Invites a player to the Realm

```js
const realm = await api.getRealm('1234567')

await realm.invitePlayer('a8005260a332457097a50bdbe48a9a21', 'Steve')
```

#### open()

Opens a Realm. Allows players to join

```js
const realm = await api.getRealm('1234567')

await realm.open()
```

#### close()

Closes a Realm. Removes all current players and restricts joining

```js
const realm = await api.getRealm('1234567')

await realm.close()
```

---

### Using prismarine-realms with Mineflayer, Node Minecraft Protocol and Bedrock Protocol

Prismarine-auth is used in Mineflayer to allow quick connection to owned/joined Realms by providing a `pickRealm` function which should return a single Realm instance. It will then handle getting the host information and connect your bot to that Realm. The process of getting the Realms connection is handled in the protocol libraries meaning the same options can be passed there as well.

#### Mineflayer 

```js
const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  username: 'example',
  auth: 'microsoft',
  realms: {
    pickRealm: (realms) => realms.find(realm => realm.name === 'My Realm')
  }
})
```

#### Node Minecraft Protocol

```js
const protocol = require('minecraft-protocol');

const client = protocol.createClient({
  username: 'example',
  auth: 'microsoft',
  realms: {
    pickRealm: (realms) => realms.find(realm => realm.name === 'My Realm')
  }
});
```

#### Bedrock Protocol

```js
const protocol = require('bedrock-protocol');

const client = protocol.createClient({
  username: 'example',
  realms: {
    pickRealm: (realms) => realms.find(realm => realm.name === 'My Realm')
  }
});
```