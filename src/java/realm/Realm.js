module.exports = (auth) => {
  return {
    player: {
      invite: (realmId, { name, uuid }) => require('./player/invite')(auth, { realmId, name, uuid })
    },
    getConnection: (realmId) => require('./getConnection')(auth, { realmId }),
    getInfo: (realmId) => require('./getInfo')(auth, { realmId })
  }
}
