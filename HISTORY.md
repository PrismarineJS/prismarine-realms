## History

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
