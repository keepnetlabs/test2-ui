import rightColumn from '@/store/modules/rightColumn'

describe('rightColumn Vuex Module', () => {
  describe('State', () => {
    it('should have initial state', () => {
      expect(rightColumn.state.reloadRightColumnData).toBe(false)
    })
  })

  describe('Getters', () => {
    it('getReloadRightColumnData should return state value', () => {
      const state = { reloadRightColumnData: true }
      expect(rightColumn.getters.getReloadRightColumnData(state)).toBe(true)
    })

    it('getReloadRightColumnData should return false for false state', () => {
      const state = { reloadRightColumnData: false }
      expect(rightColumn.getters.getReloadRightColumnData(state)).toBe(false)
    })
  })

  describe('Mutations', () => {
    it('setReloadRightColumnData should update state', () => {
      const state = { reloadRightColumnData: false }
      rightColumn.mutations.setReloadRightColumnData(state, true)
      expect(state.reloadRightColumnData).toBe(true)
    })

    it('setReloadRightColumnData should handle false values', () => {
      const state = { reloadRightColumnData: true }
      rightColumn.mutations.setReloadRightColumnData(state, false)
      expect(state.reloadRightColumnData).toBe(false)
    })
  })

  describe('Actions', () => {
    it('changeReloadRightColumnData should commit mutation', () => {
      const commit = jest.fn()
      const payload = true
      rightColumn.actions.changeReloadRightColumnData({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', payload)
    })
  })
})
