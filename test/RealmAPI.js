/* eslint-env mocha */
const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const { RealmAPI } = require('prismarine-realms')

describe('RealmAPI', () => {
  it('should error if an Authflow instance isn\'t provided', () => {
    expect(() => RealmAPI.from(null, 'bedrock')).to.throw('Need to proive an Authflow instance to use the Realm API https://github.com/PrismarineJS/prismarine-auth')
  })
})
