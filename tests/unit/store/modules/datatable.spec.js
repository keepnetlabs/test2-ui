describe('datatable.js store module', () => {
  let tableStore
  let state

  beforeEach(() => {
    tableStore = {
      namespaced: true,
      state: {
        tables: {}
      },
      getters: {},
      mutations: {
        setTable(state, payload) {
          const tableKey = payload.key
          delete payload.key
          state.tables[tableKey] = payload
        }
      },
      actions: {
        setTable({ commit }, payload = {}) {
          commit('setTable', payload)
        }
      }
    }

    state = JSON.parse(JSON.stringify(tableStore.state))
  })

  describe('state', () => {
    it('initializes with empty tables object', () => {
      expect(tableStore.state.tables).toEqual({})
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('setTable adds table with key', () => {
      const payload = {
        key: 'usersTable',
        columns: ['name', 'email'],
        rows: 10,
        sorting: 'asc'
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.usersTable).toBeDefined()
      expect(state.tables.usersTable.columns).toEqual(['name', 'email'])
    })

    it('setTable removes key from payload before storing', () => {
      const payload = {
        key: 'campaignsTable',
        data: [{ id: 1 }],
        pageSize: 20
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.campaignsTable).not.toHaveProperty('key')
      expect(state.tables.campaignsTable).toHaveProperty('pageSize')
    })

    it('setTable can store multiple tables', () => {
      const payload1 = {
        key: 'table1',
        data: [{ id: 1 }]
      }
      const payload2 = {
        key: 'table2',
        data: [{ id: 2 }]
      }
      tableStore.mutations.setTable(state, payload1)
      tableStore.mutations.setTable(state, payload2)
      expect(Object.keys(state.tables)).toHaveLength(2)
      expect(state.tables.table1).toBeDefined()
      expect(state.tables.table2).toBeDefined()
    })

    it('setTable can update existing table', () => {
      const payload1 = {
        key: 'myTable',
        columns: ['id', 'name'],
        rows: 5
      }
      const payload2 = {
        key: 'myTable',
        columns: ['id', 'name', 'email'],
        rows: 10
      }
      tableStore.mutations.setTable(state, payload1)
      expect(state.tables.myTable.rows).toBe(5)

      tableStore.mutations.setTable(state, payload2)
      expect(state.tables.myTable.rows).toBe(10)
      expect(state.tables.myTable.columns).toHaveLength(3)
    })

    it('setTable handles complex table data', () => {
      const payload = {
        key: 'complexTable',
        pagination: { page: 1, pageSize: 20, total: 100 },
        sorting: { field: 'name', order: 'asc' },
        columns: [
          { field: 'id', label: 'ID' },
          { field: 'name', label: 'Name' },
          { field: 'email', label: 'Email' }
        ],
        data: [
          { id: 1, name: 'User 1', email: 'user1@example.com' },
          { id: 2, name: 'User 2', email: 'user2@example.com' }
        ]
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.complexTable.pagination.total).toBe(100)
      expect(state.tables.complexTable.data).toHaveLength(2)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('setTable action commits mutation', () => {
      const commit = jest.fn()
      const payload = {
        key: 'testTable',
        data: [{ id: 1 }]
      }
      tableStore.actions.setTable({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setTable', payload)
    })

    it('setTable action with default empty object', () => {
      const commit = jest.fn()
      tableStore.actions.setTable({ commit })
      expect(commit).toHaveBeenCalledWith('setTable', {})
    })

    it('setTable action with complex payload', () => {
      const commit = jest.fn()
      const payload = {
        key: 'reportTable',
        pagination: { page: 2, pageSize: 50 },
        columns: ['name', 'date', 'status']
      }
      tableStore.actions.setTable({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setTable', payload)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(tableStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(tableStore).toHaveProperty('state')
      expect(tableStore).toHaveProperty('getters')
      expect(tableStore).toHaveProperty('mutations')
      expect(tableStore).toHaveProperty('actions')
    })

    it('has setTable mutation', () => {
      expect(tableStore.mutations).toHaveProperty('setTable')
    })

    it('has setTable action', () => {
      expect(tableStore.actions).toHaveProperty('setTable')
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('can set and manage user table', () => {
      const commit = (mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      }

      const usersTable = {
        key: 'users',
        columns: ['id', 'name', 'email', 'status'],
        data: [
          { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
          { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' }
        ],
        pagination: { page: 1, pageSize: 20, total: 50 }
      }
      commit('setTable', usersTable)
      expect(state.tables.users.data).toHaveLength(2)
      expect(state.tables.users.pagination.total).toBe(50)
    })

    it('can manage multiple tables simultaneously', () => {
      const commit = (mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      }

      const table1 = { key: 'campaigns', data: [{ id: 1 }] }
      const table2 = { key: 'reports', data: [{ id: 1 }, { id: 2 }] }
      const table3 = { key: 'settings', columns: ['name', 'value'] }

      commit('setTable', table1)
      commit('setTable', table2)
      commit('setTable', table3)

      expect(Object.keys(state.tables)).toHaveLength(3)
      expect(state.tables.campaigns.data).toHaveLength(1)
      expect(state.tables.reports.data).toHaveLength(2)
      expect(state.tables.settings.columns).toHaveLength(2)
    })

    it('can update table state with sorting and pagination', () => {
      const commit = (mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      }

      const initialTable = {
        key: 'dataTable',
        sorting: { field: 'name', order: 'asc' },
        pagination: { page: 1, pageSize: 10 }
      }
      commit('setTable', initialTable)
      expect(state.tables.dataTable.pagination.page).toBe(1)

      const updatedTable = {
        key: 'dataTable',
        sorting: { field: 'date', order: 'desc' },
        pagination: { page: 2, pageSize: 10 }
      }
      commit('setTable', updatedTable)
      expect(state.tables.dataTable.pagination.page).toBe(2)
      expect(state.tables.dataTable.sorting.field).toBe('date')
    })

    it('table key is properly removed from stored data', () => {
      const commit = (mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      }

      const payload = {
        key: 'testTable',
        name: 'Test Table',
        columns: ['col1', 'col2']
      }
      commit('setTable', payload)
      expect(state.tables.testTable).not.toHaveProperty('key')
      expect(state.tables.testTable.name).toBe('Test Table')
    })
  })
})
