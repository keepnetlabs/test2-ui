import tableReloadStore from '@/store/modules/tableReload'

describe('tableReload Vuex Module', () => {
  describe('State', () => {
    it('should have tableReload initialized as false', () => {
      expect(tableReloadStore.state.tableReload).toBe(false)
    })
  })

  describe('Mutations', () => {
    it('setTableReload should update tableReload state', () => {
      const state = { tableReload: false }
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })

    it('setTableReload should handle object payloads', () => {
      const state = { tableReload: false }
      const payload = { test: 'data' }
      tableReloadStore.mutations.setTableReload(state, payload)
      expect(state.tableReload).toEqual(payload)
    })

    it('setTableReload should handle empty payloads', () => {
      const state = { tableReload: true }
      tableReloadStore.mutations.setTableReload(state, {})
      expect(state.tableReload).toEqual({})
    })
  })

  describe('Actions', () => {
    it('setTableReload action should commit mutation', () => {
      const commit = jest.fn()
      const payload = { key: 'value' }
      tableReloadStore.actions.setTableReload({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setTableReload', payload)
    })

    it('setTableReload action should work with default payload', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit })
      expect(commit).toHaveBeenCalledWith('setTableReload', {})
    })
  })

  describe('Namespacing', () => {
    it('should be namespaced', () => {
      expect(tableReloadStore.namespaced).toBe(true)
    })
  })
})
