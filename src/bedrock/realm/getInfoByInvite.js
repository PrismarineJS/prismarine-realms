const fetch = require('../../fetch')
const { BEDROCK_HOST } = require('../../constants')

module.exports = async (auth, options) => {
  return await auth.getBedrockAuth().then(fetch(`${BEDROCK_HOST}/worlds/v1/link/${options.inviteCode}`))
}
