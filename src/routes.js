module.exports = (type = 'default') => {
  switch (type) {
    case 'default':
      return {
        Realms: () => {
          return '/worlds'
        },
        Realm: (realmId) => {
          return `/worlds/${realmId}`
        }
      }
    case 'bedrock':
      return {
        RealmAddress: (realmId) => {
          return `/worlds/${realmId}/join`
        },
        InviteUpdate: (realmId) => {
          return `/invites/${realmId}/invite/update`
        }
      }
    case 'java':
      return {
        RealmAddress: (realmId) => {
          return `/worlds/v1/${realmId}/join/pc`
        },
        InviteUpdate: (realmId) => {
          return `/invites/${realmId}`
        }
      }
  }
}
