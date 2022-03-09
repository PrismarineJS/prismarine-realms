const fetch = require('../../../fetch')
const { JAVA_HOST } = require('../../../constants')

module.exports = async (auth, options) => {
  return await auth.getJavaAuth().then(fetch(`${JAVA_HOST}/invites/${options.realmId}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: options.name,
      uuid: options.uuid
    })
  }))
}
