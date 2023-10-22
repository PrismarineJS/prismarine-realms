const fs = require('fs').promises
const fetch = require('node-fetch')

module.exports = class Download {
  #api
  constructor (api, data) {
    this.#api = api
    this.downloadUrl = data.downloadLink ?? data.downloadUrl
    if (this.#api.platform === 'bedrock') {
      this.token = data.token
      this.size = data.size
      this.fileExtension = '.mcworld'
    } else {
      this.resourcePackUrl = data.resourcePackUrl
      this.resourcePackHash = data.resourcePackHash
      this.fileExtension = '.tar.gz'
    }
  }

  /**
   * Writes the buffer of a Realms world to a directory
   * @param {string} directory The directory to write the world download to
   * @returns The downloaded world in buffer form and written to the specified directory
   */
  async writeToDirectory (directory) {
    return this.#downloadWorld().then(buffer => fs.writeFile(`${directory}/world${this.fileExtension}`, buffer))
  }

  /**
   * Retrieves the buffer of a Realms world
   * @returns The buffer form of the Realms world
   */
  async getBuffer () {
    return this.#downloadWorld()
  }

  /**
   * Downloads the world for the Realm in mcworld format for Bedrock Edition or tar.gz format for Java Edition
   * @returns A promise that resolves to a buffer of the world
   */
  async #downloadWorld () {
    const res = await fetch(this.downloadUrl, {
      headers: (this.token) ? { Authorization: `Bearer ${this.token}` } : {}
    })

    if (!res.ok) throw new Error(`Failed to download world: ${res.status} ${res.statusText}`)

    return await res.buffer()
  }
}
