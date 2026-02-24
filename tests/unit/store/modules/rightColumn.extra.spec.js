import rightColumn from '@/store/modules/rightColumn'

describe('rightColumn store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(rightColumn.state))
  })

  describe('getters', () => {
    it('getReloadRightColumnData returns state value', () => {
      state.reloadRightColumnData = true
      expect(rightColumn.getters.getReloadRightColumnData(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    it('setReloadRightColumnData updates state', () => {
      rightColumn.mutations.setReloadRightColumnData(state, true)
      expect(state.reloadRightColumnData).toBe(true)
    })
  })

  describe('actions', () => {
    it('changeReloadRightColumnData commits mutation', () => {
      const commit = jest.fn()
      rightColumn.actions.changeReloadRightColumnData({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', true)
    })
  })
})
