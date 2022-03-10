const debug = require('debug')('prismarine-realms')

async function checkStatus (res) {
  if (res.ok) {
    const contentType = res.headers.get('content-type')
    return (contentType === 'application/json') ? res.json() : res.text()
  } else {
    debug('Request fail', res)
    const body = await res.text()
    throw new Error(`${res.status} ${res.statusText} ${body}`)
  }
};

function formatJavaAuth (res) {
  if (!res.profile?.id || !res.profile?.name) throw new Error('Failed to obtain profile data, does the authenticating account own minecraft?')
  return { cookie: `sid=token:${res.token}:${res.profile.id}; user=${res.profile.name}; version=0.0.0`, 'User-Agent': 'MinecraftLauncher/2.2.10675' }
}

function formatBedrockAuth (res) {
  return { authorization: `XBL3.0 x=${res.userHash};${res.XSTSToken}`, 'User-Agent': 'MCPE/UWP' }
}

module.exports = {
  checkStatus,
  formatJavaAuth,
  formatBedrockAuth
}
