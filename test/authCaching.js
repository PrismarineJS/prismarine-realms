/* eslint-env mocha */
const { expect } = require('chai')

const Rest = require('../src/rest')

describe('Auth Caching', () => {
  it('should cache the auth token and reuse it on subsequent calls', async () => {
    let callCount = 0
    const fakeAuthflow = {
      getMinecraftJavaToken: () => {
        callCount++
        return Promise.resolve({ token: 'test-token', profile: { id: 'test-id', name: 'Steve' } })
      }
    }

    const rest = new Rest(fakeAuthflow, 'java', { authCacheTtl: 5000 })

    const first = await rest.getAuthHeader()
    const second = await rest.getAuthHeader()

    expect(callCount).to.equal(1)
    expect(first).to.deep.equal(second)
  })

  it('should expire cache after TTL', async () => {
    let callCount = 0
    const fakeAuthflow = {
      getMinecraftJavaToken: () => {
        callCount++
        return Promise.resolve({ token: 'token-' + callCount, profile: { id: 'test-id', name: 'Steve' } })
      }
    }

    const rest = new Rest(fakeAuthflow, 'java', { authCacheTtl: 50 })

    await rest.getAuthHeader()
    expect(callCount).to.equal(1)

    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 60))

    await rest.getAuthHeader()
    expect(callCount).to.equal(2)
  })

  it('should deduplicate concurrent in-flight auth requests', async () => {
    let callCount = 0
    const fakeAuthflow = {
      getMinecraftJavaToken: () => {
        callCount++
        // Simulate slow auth
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ token: 'test-token', profile: { id: 'test-id', name: 'Steve' } })
          }, 50)
        })
      }
    }

    const rest = new Rest(fakeAuthflow, 'java', { authCacheTtl: 5000 })

    // Fire three concurrent requests
    const results = await Promise.all([
      rest.getAuthHeader(),
      rest.getAuthHeader(),
      rest.getAuthHeader()
    ])

    expect(callCount).to.equal(1)
    expect(results[0]).to.deep.equal(results[1])
    expect(results[1]).to.deep.equal(results[2])
  })

  it('should not cache when authCacheTtl is 0', async () => {
    let callCount = 0
    const fakeAuthflow = {
      getMinecraftJavaToken: () => {
        callCount++
        return Promise.resolve({ token: 'token-' + callCount, profile: { id: 'test-id', name: 'Steve' } })
      }
    }

    const rest = new Rest(fakeAuthflow, 'java', { authCacheTtl: 0 })

    await rest.getAuthHeader()
    await rest.getAuthHeader()

    expect(callCount).to.equal(2)
  })

  it('should clear in-flight state on auth error so retries can succeed', async () => {
    let callCount = 0
    const fakeAuthflow = {
      getMinecraftJavaToken: () => {
        callCount++
        if (callCount === 1) {
          return Promise.reject(new Error('auth failed'))
        }
        return Promise.resolve({ token: 'test-token', profile: { id: 'test-id', name: 'Steve' } })
      }
    }

    const rest = new Rest(fakeAuthflow, 'java', { authCacheTtl: 5000 })

    try {
      await rest.getAuthHeader()
    } catch (e) {
      expect(e.message).to.equal('auth failed')
    }

    // Should retry successfully after error
    const result = await rest.getAuthHeader()
    expect(callCount).to.equal(2)
    expect(result).to.be.an('array')
  })
})
