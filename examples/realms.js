const { RealmAPI } = require('prismarine-realms')

const [, , platform] = process.argv

if (!platform) {
  console.log('Usage: node realms.js <platform>')
  process.exit(1)
}

const api = new RealmAPI(undefined, platform)

api.getRealms().then(console.log)
