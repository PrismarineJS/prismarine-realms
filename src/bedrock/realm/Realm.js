const _GetBlocklist = require('./getBlocklist')
const _GetConnection = require('./getConnection')
const _GetInfoByInvite = require('./getInfoByInvite')
const _GetInfo = require('./getInfo')
const _InvitePlayer = require('./player/invite')

module.exports = (auth) => {
  return {
    player: {
      invite: (realmId, xuid) => _InvitePlayer(auth, { realmId, xuid })
    },
    getBlocklist: (realmId) => _GetBlocklist(auth, { realmId }),
    getConnection: (realmId) => _GetConnection(auth, { realmId }),
    getInfo: (realmId) => _GetInfo(auth, { realmId }),
    getInfoByInvite: (inviteCode) => _GetInfoByInvite(auth, { inviteCode })
  }
}
