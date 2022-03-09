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

#### constructor (username?: string, cacheDir?: string | CacheFactory, options?: MicrosoftAuthFlowOptions, codeCallback?: Function)

Extends the [Authflow](https://github.com/PrismarineJS/prismarine-auth#authflow) class from prismarine-auth and accepts the same parameters, you can see the documentation for this [here.](https://github.com/PrismarineJS/prismarine-auth#authflow)

## API

### Table of Contents

  - [Definitions](#definitions)
  - [Bedrock](#bedrock)
    - [Account](#account)
      - [getRealms()](#getrealms)
    - [Realm](#realm)
      - [getInfo(realmId: string)](#getinforealmid-string)
      - [getInfoByInvite(realmInviteCode: string)](#getinfobyinviterealminvitecode-string)
      - [getConnection(realmId: string)](#getconnectionrealmid-string)
      - [getBlocklist(realmId: string)](#getblocklistrealmid-string)
    - [Realm#Player](#realmplayer)
      - [invite(realmId: string, xuid: string)](#inviterealmid-string-xuid-string)
  - [Java](#java)
    - [Account](#account-1)
      - [getRealms()](#getrealms-1)
    - [Realm](#realm-1)
      - [getInfo(realmId: string)](#getinforealmid-string-1)
      - [getConnection(realmId: string)](#getconnectionrealmid-string-1)
    - [Realm#Player](#realmplayer-1)
      - [invite(realmId: string, xuid: string)](#inviterealmid-string-xuid-string-1)

### Definitions

| Param           | Type                 | Description                                                           |
| --------------- | -------------------- | --------------------------------------------------------------------- |
| realmId         | `string`             | The ID of the Realm                                                   |
| realmInviteCode | `string`             | The invite code for the Realm (Only on Bedrock)                       |
| username        | `string`             | The username of player                                                |
| uuid            | `string`             | The unique ID of the player, w/o hyphens                              |                       | xuid            | `string`             | The Xbox User ID of the targeted player                               |

---

## Bedrock

```js
const { RealmAPI } = require('prismarine-realms')

const api = new RealmAPI().Bedrock
```

### Account

#### getRealms()

Gets a list of Realms the authenticating account has joined or owns

```js
await api.account.getRealms()
```

### Realm

#### getInfo(realmId: string)

Gets detailed information about a Realm

```js
await api.realm.getInfo('1234567')
```

#### getInfoByInvite(realmInviteCode: string)

Gets detailed information about a Realm using the Realms invite code

```js
await api.realm.getInfoByInvite('AB1CD2EFA3B')
```

#### getConnection(realmId: string)

Gets a Realms ip/port

```js
await api.realm.getConnection('1234567')
```

#### getBlocklist(realmId: string)

Get a list of all banned players for an owned Realm

```js
await api.realm.getBlocklist('1234567')
```

### Realm#Player

#### invite(realmId: string, xuid: string)

Invite a player to an owned Realm

```js
await api.realm.player.invite('1234567', '1234567890')
```

## Java

```js
const { RealmAPI } = require('prismarine-realms')

const api = new RealmAPI().Java
```

### Account

#### getRealms()

Gets a list of Realms the authenticating account has joined or owns

```js
await api.account.getRealms()
```

### Realm

#### getInfo(realmId: string)

Gets detailed information about a Realm

```js
await api.realm.getInfo('1234567')
```

#### getConnection(realmId: string)

Gets a Realms ip/port

```js
await api.realm.getConnection('1234567')
```

### Realm#Player

#### invite(realmId: string, { uuid: string, name: string })

Invite a player to an owned Realm

```js
await api.realm.player.invite('1234567', { uuid: '3333dddd2222cccc1111bbbb0000aaaa', name: 'Steve' })
```
