/**
 * Formats the Java authentication data into header format
 * @param {Array} res The result from the request that contains the token and profile data
 * @returns The formatted cookies used for authentication with the Realms API
 */
function formatJavaAuth (res) {
  if (!res.profile?.id || !res.profile?.name) throw new Error('Failed to obtain profile data, does the authenticating account own minecraft?')
  return ['cookie', `sid=token:${res.token}:${res.profile.id}; user=${res.profile.name}; version=0.0.0`]
}

/**
 * Formats the XBL3.0 authentication data into header format
 * @param {Array} res The result from the request that contains the user hash and XSTSToken
 * @returns The formatted authentication data used for authentication with the Realms API
 */
function formatBedrockAuth (res) {
  return ['authorization', `XBL3.0 x=${res.userHash};${res.XSTSToken}`]
}

module.exports = {
  formatJavaAuth,
  formatBedrockAuth
}
