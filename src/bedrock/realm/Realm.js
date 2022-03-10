module.exports = (auth) => {
  return {
    player: {
      invite: (realmId, xuid) => require('./player/invite')(auth, { realmId, xuid })
    },
    getBlocklist: (realmId) => require('./getBlocklist')(auth, { realmId }),
    getConnection: (realmId) => require('./getConnection')(auth, { realmId }),
    getInfo: (realmId) => require('./getInfo')(auth, { realmId }),
    getInfoByInvite: (inviteCode) => require('./getInfoByInvite')(auth, { inviteCode })
  }
}
