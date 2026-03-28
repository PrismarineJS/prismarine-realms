module.exports = class LivePlayerList {
  #api
  constructor (api, data) {
    this.#api = api
    let parsedPlayerList = data.playerList
    if (typeof parsedPlayerList === 'string') {
      try {
        parsedPlayerList = JSON.parse(parsedPlayerList)
      } catch (error) {
        parsedPlayerList = []
      }
    }
    Object.assign(this, {
      serverId: data.serverId,
      playerList: parsedPlayerList
    })
  }
}
