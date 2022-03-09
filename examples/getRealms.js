const { RealmAPI } = require('prismarine-realms')

const api = new RealmAPI('test', './').Bedrock // Bedrock || Java

api.account.getRealms().then(console.log)
