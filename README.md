# prismarine-realms
[![NPM version](https://img.shields.io/npm/v/prismarine-realms.svg)](http://npmjs.com/package/prismarine-realms)
[![Build Status](https://github.com/PrismarineJS/prismarine-realms/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-realms/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-realms)

Node.JS Wrapper around both the Java & Bedrock Realms API

## Installation
```shell
npm install prismarine-realms
```

## Usage

### RealmAPI

#### constructor (authflow?: Authflow, platform: 'bedrock' | 'java')

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

const api = new RealmAPI(authflow, 'bedrock')
```

#### getRealms(): Promise<Realm[]>

Gets a list of Realms the authenticating account has joined or owns

```js
await api.getRealms()
```


#### getRealm(realmId: string): Promise<Realm>

Gets detailed information about a Realm if owned

```js
await api.getRealm('1234567')
```

#### getAddress(): Promise<Address>

Gets the address for the Realm

```js
const realm = await api.getRealm('1234567')

await realm.getAddress()
```
