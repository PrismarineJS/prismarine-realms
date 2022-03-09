const fetch = require('../../fetch')
const { BEDROCK_HOST } = require('../../constants')

module.exports = async (auth, options) => {
  const host = await auth.getBedrockAuth().then(fetch(`${BEDROCK_HOST}/worlds/${options.realmId}/join`))
  const [ip, port] = host.address.split(':')
  return { ip, port, ...host }
}
