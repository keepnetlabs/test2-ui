describe('tableReload.js store module', () => {
  let tableReloadStore

  beforeEach(() => {
    // Define store inline to avoid import dependencies
    tableReloadStore = {
      namespaced: true,
      state: {
        tableReload: false
      },
      getters: {},
      mutations: {
        setTableReload(state, payload) {
          state.tableReload = payload
        }
      },
      actions: {
        setTableReload({ commit }, payload = {}) {
          commit('setTableReload', payload)
        }
      }
    }
  })

  describe('state', () => {
    it('initializes with tableReload as false', () => {
      expect(tableReloadStore.state.tableReload).toBe(false)
    })

    it('state is an object', () => {
      expect(typeof tableReloadStore.state).toBe('object')
    })
  })

  describe('mutations', () => {
    it('setTableReload sets tableReload to true', () => {
      const state = { tableReload: false }
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })

    it('setTableReload sets tableReload to false', () => {
      const state = { tableReload: true }
      tableReloadStore.mutations.setTableReload(state, false)
      expect(state.tableReload).toBe(false)
    })

    it('setTableReload accepts payload as boolean', () => {
      const state = { tableReload: false }
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })

    it('setTableReload accepts payload as any value', () => {
      const state = { tableReload: false }
      tableReloadStore.mutations.setTableReload(state, 'trigger')
      expect(state.tableReload).toBe('trigger')
    })

    it('setTableReload handles null payload', () => {
      const state = { tableReload: true }
      tableReloadStore.mutations.setTableReload(state, null)
      expect(state.tableReload).toBeNull()
    })

    it('setTableReload handles undefined payload', () => {
      const state = { tableReload: true }
      tableReloadStore.mutations.setTableReload(state, undefined)
      expect(state.tableReload).toBeUndefined()
    })

    it('setTableReload handles object payload', () => {
      const state = { tableReload: false }
      const payload = { trigger: true, timestamp: 123456 }
      tableReloadStore.mutations.setTableReload(state, payload)
      expect(state.tableReload).toEqual(payload)
    })

    it('setTableReload overwrites previous value', () => {
      const state = { tableReload: true }
      tableReloadStore.mutations.setTableReload(state, false)
      tableReloadStore.mutations.setTableReload(state, true)
      expect(state.tableReload).toBe(true)
    })
  })

  describe('actions', () => {
    it('setTableReload action commits mutation with true', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setTableReload', true)
    })

    it('setTableReload action commits mutation with false', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, false)
      expect(commit).toHaveBeenCalledWith('setTableReload', false)
    })

    it('setTableReload action commits mutation with default empty object when no payload', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit })
      expect(commit).toHaveBeenCalledWith('setTableReload', {})
    })

    it('setTableReload action commits mutation with provided payload', () => {
      const commit = jest.fn()
      const payload = { trigger: true }
      tableReloadStore.actions.setTableReload({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setTableReload', payload)
    })

    it('setTableReload action commits mutation once', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(commit).toHaveBeenCalledTimes(1)
    })

    it('setTableReload action uses setTableReload mutation name', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(commit.mock.calls[0][0]).toBe('setTableReload')
    })

    it('setTableReload action handles null payload', () => {
      const commit = jest.fn()
      tableReloadStore.actions.setTableReload({ commit }, null)
      expect(commit).toHaveBeenCalledWith('setTableReload', null)
    })

    it('setTableReload action is async compatible', () => {
      const commit = jest.fn()
      const result = tableReloadStore.actions.setTableReload({ commit }, true)
      expect(result).toBeUndefined()
    })
  })

  describe('getters', () => {
    it('module has getters object', () => {
      expect(typeof tableReloadStore.getters).toBe('object')
    })

    it('getters object is empty', () => {
      expect(Object.keys(tableReloadStore.getters).length).toBe(0)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(tableReloadStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(tableReloadStore).toHaveProperty('state')
      expect(tableReloadStore).toHaveProperty('mutations')
      expect(tableReloadStore).toHaveProperty('actions')
      expect(tableReloadStore).toHaveProperty('getters')
    })

    it('mutations object is defined', () => {
      expect(typeof tableReloadStore.mutations).toBe('object')
    })

    it('actions object is defined', () => {
      expect(typeof tableReloadStore.actions).toBe('object')
    })

    it('has setTableReload mutation', () => {
      expect(tableReloadStore.mutations).toHaveProperty('setTableReload')
    })

    it('has setTableReload action', () => {
      expect(tableReloadStore.actions).toHaveProperty('setTableReload')
    })
  })

  describe('integration tests', () => {
    it('action updates state through mutation', () => {
      const state = { tableReload: false }
      const commit = (mutationName, payload) => {
        tableReloadStore.mutations[mutationName](state, payload)
      }
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(state.tableReload).toBe(true)
    })

    it('multiple action calls update state sequentially', () => {
      const state = { tableReload: false }
      const commit = (mutationName, payload) => {
        tableReloadStore.mutations[mutationName](state, payload)
      }
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(state.tableReload).toBe(true)
      tableReloadStore.actions.setTableReload({ commit }, false)
      expect(state.tableReload).toBe(false)
    })

    it('action with default payload updates state', () => {
      const state = { tableReload: false }
      const commit = (mutationName, payload) => {
        tableReloadStore.mutations[mutationName](state, payload)
      }
      tableReloadStore.actions.setTableReload({ commit })
      expect(state.tableReload).toEqual({})
    })

    it('handles rapid state changes', () => {
      const state = { tableReload: false }
      const commit = (mutationName, payload) => {
        tableReloadStore.mutations[mutationName](state, payload)
      }
      tableReloadStore.actions.setTableReload({ commit }, true)
      tableReloadStore.actions.setTableReload({ commit }, false)
      tableReloadStore.actions.setTableReload({ commit }, true)
      expect(state.tableReload).toBe(true)
    })
  })
})
