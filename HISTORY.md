## History

### 1.5.0
* [Update CI to Node 24 (#75)](https://github.com/PrismarineJS/prismarine-realms/commit/670e3f864b09c32b19aba991073e6e5c5f5ec8b3) (thanks @rom1504)
* [Add Live Player List (#71)](https://github.com/PrismarineJS/prismarine-realms/commit/30d1d0a1d7fefb567829cf7dbcd47dd1a7710be3) (thanks @raymondjxu)
* [Fix publish condition and node version for npm-publish v4 (#74)](https://github.com/PrismarineJS/prismarine-realms/commit/f651404b3668b06c8f01d36a0a2934658bc07515) (thanks @rom1504)
* [Switch to trusted publishing via OIDC (#73)](https://github.com/PrismarineJS/prismarine-realms/commit/46143077afa4a87c6865cf97cbccd2b1dcc7387f) (thanks @rom1504)
* [Bump nock from 13.5.6 to 14.0.11 (#70)](https://github.com/PrismarineJS/prismarine-realms/commit/fe324e1d19bd0597a7d2d93b471cf8f8f22ac77f) (thanks @dependabot[bot])

### 1.4.1
* [Fix RelyingParty in requests, revert #60 (#67)](https://github.com/PrismarineJS/prismarine-realms/commit/03dc434248c7c4a2a912a7ab510e6a7d7afec0bf) (thanks @NoVa-Gh0ul)

### 1.4.0
* [Create commands.yml](https://github.com/PrismarineJS/prismarine-realms/commit/c712fe83272952605cb2079f1113b7a8bf600e8a) (thanks @extremeheat)
* [feat: Add realm .changeRealmNameAndDescription (#62)](https://github.com/PrismarineJS/prismarine-realms/commit/487635c4dee2bfb08da0702edf4d6f94421a6314) (thanks @BlythT)
* [fix: use new bedrock endpoint (#60)](https://github.com/PrismarineJS/prismarine-realms/commit/5f86889417376180fe4f0a5e338ecc63e7492ba4) (thanks @IanTapply22)
* [Bump mocha from 10.8.2 to 11.0.1 (#50)](https://github.com/PrismarineJS/prismarine-realms/commit/6f6267b5e7f16b2a0c3edd47a691deecb0805895) (thanks @dependabot[bot])
* [Add support for MCBE Preview Realms (#44)](https://github.com/PrismarineJS/prismarine-realms/commit/a602ed3e1476acf417cc16f5d05c1ef3abfa0e0c) (thanks @MrDiamond64)
* [Expand API and expose more realm config data (#40)](https://github.com/PrismarineJS/prismarine-realms/commit/866ce6af503c29ecb29e9b4a3dfe05191ef34a1a) (thanks @undefined)

### 1.3.2
* Retry 5xx errors with exponential backoff (@LucienHH)

### 1.3.1
* Use fs.promises over fs/promises (@extremeheat)

### 1.3.0
* import Authflow into index.d.ts (@jojomatik) [#35](https://github.com/PrismarineJS/prismarine-realms/pull/35)
* Add Realm backup & world download endpoints (@LucienHH) [#30](https://github.com/PrismarineJS/prismarine-realms/pull/30)
* Move docs to API.md (@LucienHH) [#24](https://github.com/PrismarineJS/prismarine-realms/pull/24)

### 1.2.0
* Fix typo in index.d.ts
* Add invite endpoints

### 1.1.1
* Fix missing debug dependency
* Retry 5 times for pc realm address endpoint

### 1.1.0

* Add getRealmFromInvite endpoint
* Add retry for server errors and getAddress return host/port
* Update doc and platform type handling

### 1.0.0

* initial implementation
