const fetch = require('../../fetch')
const { JAVA_HOST } = require('../../constants')

module.exports = async (auth, options) => {
  const host = await auth.getJavaAuth().then(fetch(`${JAVA_HOST}/worlds/v1/${options.realmId}/join/pc`))
  const [ip, port] = host.address.split(':')
  return { ip, port, ...host }
}
