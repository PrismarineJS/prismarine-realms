module.exports = class Realm {
  #api
  constructor (api, data) {
    this.#api = api
    Object.assign(this, {
      id: data.id,
      remoteSubscriptionId: data.remoteSubscriptionId,
      owner: data.owner,
      ownerUUID: data.ownerUUID,
      name: data.name,
      motd: data.motd,
      defaultPermission: data.defaultPermission,
      state: data.state,
      daysLeft: data.daysLeft,
      expired: data.expired,
      expiredTrial: data.expiredTrial,
      gracePeriod: data.gracePeriod,
      worldType: data.worldType,
      players: data.players,
      maxPlayers: data.maxPlayers,
      minigameName: data.minigameName,
      minigameId: data.minigameId,
      minigameImage: data.minigameImage,
      activeSlot: data.activeSlot,
      slots: data.slots,
      member: data.member,
      clubId: data.clubId,
      subscriptionRefreshStatus: data.subscriptionRefreshStatus
    })
  }

  async getAddress () {
    return this.#api.getRealmAddress(this.id)
  }

  async invitePlayer (uuid, name) {
    return this.#api.invitePlayer(this.id, uuid, name)
  }

  async open () {
    return this.#api.changeRealmState(this.id, 'open')
  }

  async close () {
    return this.#api.changeRealmState(this.id, 'close')
  }

  async delete () {
    return this.#api.deleteRealm(this.id)
  }

  async getWorldDownload () {
    return this.#api.getRealmWorldDownload(this.id, this.activeSlot, 'latest')
  }

  async getBackups () {
    return this.#api.getRealmBackups(this.id, this.activeSlot)
  }

  async getSubscriptionInfo (detailed = false) {
    return this.#api.getRealmSubscriptionInfo(this.id, detailed)
  }

  async changeActiveSlot (slotId) {
    return this.#api.changeRealmActiveSlot(this.id, slotId)
  }

  async changeNameAndDescription (name, description) {
    return this.#api.changeRealmNameAndDescription(this.id, name, description)
  }
}
