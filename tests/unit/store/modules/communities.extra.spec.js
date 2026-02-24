import communitiesStore from '@/store/modules/communities'

describe('communities store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = { communities: {} }
  })

  describe('mutations', () => {
    it('setCommunities sets communities', () => {
      const payload = { id: 'c1', name: 'Community 1' }
      communitiesStore.mutations.setCommunities(state, payload)
      expect(state.communities).toEqual(payload)
    })

    it('setCommunities with empty object', () => {
      state.communities = { id: 'c1' }
      communitiesStore.mutations.setCommunities(state, {})
      expect(state.communities).toEqual({})
    })
  })

  describe('actions', () => {
    it('setCommunities commits mutation', () => {
      const commit = jest.fn()
      const payload = { id: 'c1' }
      communitiesStore.actions.setCommunities({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setCommunities', payload)
    })

    it('setCommunities defaults to empty object', () => {
      const commit = jest.fn()
      communitiesStore.actions.setCommunities({ commit })
      expect(commit).toHaveBeenCalledWith('setCommunities', {})
    })
  })
})
