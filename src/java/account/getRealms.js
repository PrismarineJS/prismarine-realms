const fetch = require('../../fetch')
const { JAVA_HOST } = require('../../constants')

module.exports = async (auth) => {
  return await auth.getJavaAuth().then(fetch(`${JAVA_HOST}/worlds`))
}
