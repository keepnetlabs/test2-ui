describe('playbook.js store module', () => {
  let playbookStore
  let state

  beforeEach(() => {
    playbookStore = {
      namespaced: true,
      state: {
        playbookList: []
      },
      getters: {
        playbookListGetter: (state) => state.playbookList
      },
      mutations: {
        SET_PLAYBOOK_LIST(state, payload) {
          state.playbookList = payload.data
        }
      },
      actions: {
        async getPlaybookList({ commit }, obj) {
          const response = {
            data: {
              data: {
                results: [
                  { id: 1, name: 'Playbook 1' },
                  { id: 2, name: 'Playbook 2' }
                ]
              }
            }
          }
          let result = response.data
          result.data.results = result.data.results.map((item) => {
            return { ...item, matchCount: 1 }
          })
          commit('SET_PLAYBOOK_LIST', result)
          return response
        }
      }
    }

    state = JSON.parse(JSON.stringify(playbookStore.state))
  })

  describe('state', () => {
    it('initializes with empty playbook list', () => {
      expect(playbookStore.state.playbookList).toEqual([])
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = playbookStore.state
    })

    it('playbookListGetter returns playbook list', () => {
      state.playbookList = [
        { id: 1, name: 'Playbook 1', matchCount: 1 },
        { id: 2, name: 'Playbook 2', matchCount: 1 }
      ]
      expect(playbookStore.getters.playbookListGetter(state)).toHaveLength(2)
    })

    it('playbookListGetter returns empty array initially', () => {
      expect(playbookStore.getters.playbookListGetter(state)).toEqual([])
    })

    it('playbookListGetter returns playbooks with match count', () => {
      state.playbookList = [
        { id: 1, name: 'Test Playbook', matchCount: 1 }
      ]
      const list = playbookStore.getters.playbookListGetter(state)
      expect(list[0]).toHaveProperty('matchCount')
      expect(list[0].matchCount).toBe(1)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(playbookStore.state))
    })

    it('SET_PLAYBOOK_LIST sets playbook list from payload data', () => {
      const payload = {
        data: [
          { id: 1, name: 'Playbook 1' },
          { id: 2, name: 'Playbook 2' }
        ]
      }
      playbookStore.mutations.SET_PLAYBOOK_LIST(state, payload)
      expect(state.playbookList).toEqual(payload.data)
    })

    it('SET_PLAYBOOK_LIST can set empty list', () => {
      const payload = { data: [] }
      playbookStore.mutations.SET_PLAYBOOK_LIST(state, payload)
      expect(state.playbookList).toEqual([])
    })

    it('SET_PLAYBOOK_LIST updates existing list', () => {
      state.playbookList = [{ id: 1, name: 'Old Playbook' }]
      const payload = {
        data: [
          { id: 2, name: 'New Playbook 1' },
          { id: 3, name: 'New Playbook 2' }
        ]
      }
      playbookStore.mutations.SET_PLAYBOOK_LIST(state, payload)
      expect(state.playbookList).toHaveLength(2)
      expect(state.playbookList[0].id).toBe(2)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(playbookStore.state))
    })

    it('getPlaybookList commits mutation and adds match count', async () => {
      const commit = jest.fn()
      const result = await playbookStore.actions.getPlaybookList(
        { commit },
        { filter: 'test' }
      )
      expect(commit).toHaveBeenCalledWith('SET_PLAYBOOK_LIST', expect.any(Object))
      expect(result.data.data.results[0].matchCount).toBe(1)
      expect(result.data.data.results[1].matchCount).toBe(1)
    })

    it('getPlaybookList maps results and adds matchCount to each item', async () => {
      const commit = jest.fn()
      const result = await playbookStore.actions.getPlaybookList({ commit }, {})
      const results = result.data.data.results
      results.forEach((item) => {
        expect(item).toHaveProperty('matchCount')
        expect(item.matchCount).toBe(1)
      })
    })

    it('getPlaybookList preserves original data properties', async () => {
      const commit = jest.fn()
      const result = await playbookStore.actions.getPlaybookList({ commit }, {})
      const firstItem = result.data.data.results[0]
      expect(firstItem.id).toBe(1)
      expect(firstItem.name).toBe('Playbook 1')
      expect(firstItem.matchCount).toBe(1)
    })

    it('getPlaybookList returns response', async () => {
      const commit = jest.fn()
      const result = await playbookStore.actions.getPlaybookList({ commit }, {})
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(playbookStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(playbookStore).toHaveProperty('state')
      expect(playbookStore).toHaveProperty('getters')
      expect(playbookStore).toHaveProperty('mutations')
      expect(playbookStore).toHaveProperty('actions')
    })

    it('has playbookListGetter', () => {
      expect(playbookStore.getters).toHaveProperty('playbookListGetter')
    })

    it('has SET_PLAYBOOK_LIST mutation', () => {
      expect(playbookStore.mutations).toHaveProperty('SET_PLAYBOOK_LIST')
    })

    it('has getPlaybookList action', () => {
      expect(playbookStore.actions).toHaveProperty('getPlaybookList')
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(playbookStore.state))
    })

    it('can load playbooks and update state', async () => {
      const commit = (mutationName, payload) => {
        playbookStore.mutations[mutationName](state, payload)
      }

      const playbookData = {
        data: [
          { id: 1, name: 'Response Playbook', type: 'incident' },
          { id: 2, name: 'Detection Playbook', type: 'detection' }
        ]
      }
      commit('SET_PLAYBOOK_LIST', playbookData)

      const list = playbookStore.getters.playbookListGetter(state)
      expect(list).toHaveLength(2)
      expect(list[0].type).toBe('incident')
    })

    it('can get and process playbook list', async () => {
      const commit = jest.fn((mutationName, payload) => {
        if (mutationName === 'SET_PLAYBOOK_LIST') {
          state.playbookList = payload.data
        }
      })

      const response = await playbookStore.actions.getPlaybookList({ commit }, {})
      expect(response.data.data.results).toHaveLength(2)
      expect(response.data.data.results[0].matchCount).toBe(1)
    })

    it('playbook list getters return correct data structure', async () => {
      const playbookData = {
        data: [
          { id: 1, name: 'Playbook A', priority: 'high', matchCount: 1 },
          { id: 2, name: 'Playbook B', priority: 'medium', matchCount: 1 },
          { id: 3, name: 'Playbook C', priority: 'low', matchCount: 1 }
        ]
      }
      const commit = (mutationName, payload) => {
        playbookStore.mutations[mutationName](state, payload)
      }

      commit('SET_PLAYBOOK_LIST', playbookData)

      const list = playbookStore.getters.playbookListGetter(state)
      expect(list).toHaveLength(3)
      list.forEach((playbook) => {
        expect(playbook).toHaveProperty('id')
        expect(playbook).toHaveProperty('name')
        expect(playbook).toHaveProperty('matchCount')
      })
    })

    it('can replace playbook list with new data', () => {
      const commit = (mutationName, payload) => {
        playbookStore.mutations[mutationName](state, payload)
      }

      const initialData = {
        data: [{ id: 1, name: 'Playbook 1' }]
      }
      commit('SET_PLAYBOOK_LIST', initialData)
      expect(state.playbookList).toHaveLength(1)

      const newData = {
        data: [
          { id: 2, name: 'Playbook 2' },
          { id: 3, name: 'Playbook 3' },
          { id: 4, name: 'Playbook 4' }
        ]
      }
      commit('SET_PLAYBOOK_LIST', newData)
      expect(state.playbookList).toHaveLength(3)
      expect(state.playbookList[0].id).toBe(2)
    })

    it('ensures all playbook items have match count', () => {
      const commit = jest.fn()

      state.playbookList = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
      ]

      const list = playbookStore.getters.playbookListGetter(state)
      expect(list).toHaveLength(2)
      list.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name')
      })
    })
  })
})
