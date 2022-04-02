/* eslint-env mocha */
const { expect, use } = require('chai')
const chaiAsPromised = require('chai-as-promised')

use(chaiAsPromised)

const PlatformTypes = ['java', 'bedrock']

const { RealmAPI } = require('prismarine-realms')
const { Authflow } = require('prismarine-auth')

const authflow = new Authflow()

describe('RealmAPI', () => {
  it('should error if an Authflow instance isn\'t provided', () => {
    expect(() => RealmAPI.from(null, 'bedrock')).to.throw('Need to proive an Authflow instance to use the Realm API https://github.com/PrismarineJS/prismarine-auth')
  })
  it('should error if a valid platform isn\'t provided', () => {
    expect(() => RealmAPI.from(authflow, 'foo')).to.throw(`Platform provided is not valid. Must be ${PlatformTypes.join(' | ')}`)
  })
})
