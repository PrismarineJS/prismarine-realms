module.exports = class Realm {
  constructor (api, data) {
    this.api = api
    Object.assign(this, data)
  }

  async getAddress () {
    return this.api.getRealmAddress(this.id)
  }

  async invitePlayer (uuid, name) {
    return this.api.invitePlayer(this.id, uuid, name)
  }
}
