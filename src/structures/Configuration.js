module.exports = class Configuration {
  #api
  constructor (api, data) {
    this.#api = api

    if (this.#api.platform === 'bedrock') {
      this.description = data.description
      this.options = data.options
    } else {
      this.configuration = data
    }
  }
}
