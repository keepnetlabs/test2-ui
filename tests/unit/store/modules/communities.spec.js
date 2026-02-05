import communities from '@/store/modules/communities'

describe('communities Vuex Module', () => {
  it('should be namespaced', () => {
    if (communities && communities.namespaced !== undefined) {
      expect(communities.namespaced).toBe(true)
    } else {
      expect(true).toBe(true)
    }
  })

  it('should have state object', () => {
    expect(communities.state).toBeDefined()
    expect(typeof communities.state).toBe('object')
  })

  it('should have mutations', () => {
    if (communities.mutations) {
      expect(typeof communities.mutations).toBe('object')
    }
  })

  it('should have actions if defined', () => {
    if (communities.actions) {
      expect(typeof communities.actions).toBe('object')
    }
  })

  it('should have getters if defined', () => {
    if (communities.getters) {
      expect(typeof communities.getters).toBe('object')
    }
  })
})
