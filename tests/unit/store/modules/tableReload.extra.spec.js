import tableReloadStore from '@/store/modules/tableReload'

describe('tableReload store module (extra coverage)', () => {
  describe('real module', () => {
    it('exports the real tableReload store', () => {
      expect(tableReloadStore).toBeDefined()
      expect(tableReloadStore.namespaced).toBe(true)
    })

    it('state.tableReload initial value is false', () => {
      expect(tableReloadStore.state.tableReload).toBe(false)
    })

    it('setTableReload mutation updates state', () => {
      const state = { tableReload: false }
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })

    it('setTableReload action commits with payload', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setTableReload', true)
    })

    it('setTableReload action uses default payload {} when not provided', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit })
      expect(commit).toHaveBeenCalledWith('setTableReload', {})
    })
  })
})
