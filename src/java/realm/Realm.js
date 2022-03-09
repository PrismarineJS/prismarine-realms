const _GetRealmConnection = require('./getConnection')
const _GetRealmInfo = require('./getInfo')
const _InvitePlayer = require('./player/invite')

module.exports = (auth) => {
  return {
    player: {
      invite: (realmId, { name, uuid }) => _InvitePlayer(auth, { realmId, name, uuid })
    },
    getConnection: (realmId) => _GetRealmConnection(auth, { realmId }),
    getInfo: (realmId) => _GetRealmInfo(auth, { realmId })
  }
}
