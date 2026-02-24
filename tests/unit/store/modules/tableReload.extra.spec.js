import tableReloadStore from '@/store/modules/tableReload'

describe('tableReload store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = { tableReload: false }
  })

  describe('mutations', () => {
    it('setTableReload sets tableReload', () => {
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })

    it('setTableReload with false', () => {
      state.tableReload = true
      tableReloadStore.mutations.setTableReload(state, false)
      expect(state.tableReload).toBe(false)
    })
  })

  describe('actions', () => {
    it('setTableReload commits mutation', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setTableReload', true)
    })

    it('setTableReload defaults to empty object', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit })
      expect(commit).toHaveBeenCalledWith('setTableReload', {})
    })
  })
})
