const fetch = require('../../../fetch')
const { BEDROCK_HOST } = require('../../../constants')

module.exports = async (auth, options) => {
  return await auth.getBedrockAuth().then(fetch(`${BEDROCK_HOST}/invites/${options.realmId}/invite/update`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ invites: { [options.xuid]: 'ADD' } })
  }))
}
