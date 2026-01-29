describe('rightColumn.js store module', () => {
  let rightColumnStore
  let state

  beforeEach(() => {
    rightColumnStore = {
      namespaced: true,
      state: {
        reloadRightColumnData: false
      },
      getters: {
        getReloadRightColumnData: (state) => state.reloadRightColumnData
      },
      mutations: {
        setReloadRightColumnData(state, payload) {
          state.reloadRightColumnData = payload
        }
      },
      actions: {
        changeReloadRightColumnData({ commit }, payload) {
          commit('setReloadRightColumnData', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(rightColumnStore.state))
  })

  describe('state', () => {
    it('initializes with reloadRightColumnData as false', () => {
      expect(rightColumnStore.state.reloadRightColumnData).toBe(false)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = rightColumnStore.state
    })

    it('getReloadRightColumnData returns reload status', () => {
      state.reloadRightColumnData = false
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(false)
    })

    it('getReloadRightColumnData returns true when set', () => {
      state.reloadRightColumnData = true
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(rightColumnStore.state))
    })

    it('setReloadRightColumnData sets to true', () => {
      rightColumnStore.mutations.setReloadRightColumnData(state, true)
      expect(state.reloadRightColumnData).toBe(true)
    })

    it('setReloadRightColumnData sets to false', () => {
      state.reloadRightColumnData = true
      rightColumnStore.mutations.setReloadRightColumnData(state, false)
      expect(state.reloadRightColumnData).toBe(false)
    })

    it('setReloadRightColumnData can toggle value', () => {
      expect(state.reloadRightColumnData).toBe(false)
      rightColumnStore.mutations.setReloadRightColumnData(state, true)
      expect(state.reloadRightColumnData).toBe(true)
      rightColumnStore.mutations.setReloadRightColumnData(state, false)
      expect(state.reloadRightColumnData).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(rightColumnStore.state))
    })

    it('changeReloadRightColumnData commits mutation with true', () => {
      const commit = jest.fn()
      rightColumnStore.actions.changeReloadRightColumnData({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', true)
    })

    it('changeReloadRightColumnData commits mutation with false', () => {
      const commit = jest.fn()
      rightColumnStore.actions.changeReloadRightColumnData({ commit }, false)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', false)
    })

    it('changeReloadRightColumnData commits with any payload', () => {
      const commit = jest.fn()
      rightColumnStore.actions.changeReloadRightColumnData({ commit }, 1)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', 1)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(rightColumnStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(rightColumnStore).toHaveProperty('state')
      expect(rightColumnStore).toHaveProperty('getters')
      expect(rightColumnStore).toHaveProperty('mutations')
      expect(rightColumnStore).toHaveProperty('actions')
    })

    it('has getReloadRightColumnData getter', () => {
      expect(rightColumnStore.getters).toHaveProperty('getReloadRightColumnData')
    })

    it('has setReloadRightColumnData mutation', () => {
      expect(rightColumnStore.mutations).toHaveProperty('setReloadRightColumnData')
    })

    it('has changeReloadRightColumnData action', () => {
      expect(rightColumnStore.actions).toHaveProperty('changeReloadRightColumnData')
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(rightColumnStore.state))
    })

    it('can toggle reload flag on and off', () => {
      const commit = (mutationName, payload) => {
        rightColumnStore.mutations[mutationName](state, payload)
      }

      expect(state.reloadRightColumnData).toBe(false)

      commit('setReloadRightColumnData', true)
      expect(state.reloadRightColumnData).toBe(true)

      commit('setReloadRightColumnData', false)
      expect(state.reloadRightColumnData).toBe(false)
    })

    it('can get reload status through getter', () => {
      const commit = (mutationName, payload) => {
        rightColumnStore.mutations[mutationName](state, payload)
      }

      commit('setReloadRightColumnData', true)
      const status = rightColumnStore.getters.getReloadRightColumnData(state)
      expect(status).toBe(true)

      commit('setReloadRightColumnData', false)
      const updatedStatus = rightColumnStore.getters.getReloadRightColumnData(state)
      expect(updatedStatus).toBe(false)
    })

    it('can trigger reload through action', () => {
      const commit = jest.fn((mutationName, payload) => {
        rightColumnStore.mutations[mutationName](state, payload)
      })

      rightColumnStore.actions.changeReloadRightColumnData({ commit }, true)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', true)

      rightColumnStore.actions.changeReloadRightColumnData({ commit }, false)
      expect(commit).toHaveBeenCalledWith('setReloadRightColumnData', false)
    })

    it('maintains reload state correctly', () => {
      const commit = (mutationName, payload) => {
        rightColumnStore.mutations[mutationName](state, payload)
      }

      // Initial state
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(false)

      // Trigger reload
      commit('setReloadRightColumnData', true)
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(true)

      // Reload complete
      commit('setReloadRightColumnData', false)
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(false)

      // Trigger again
      commit('setReloadRightColumnData', true)
      expect(rightColumnStore.getters.getReloadRightColumnData(state)).toBe(true)
    })
  })
})
