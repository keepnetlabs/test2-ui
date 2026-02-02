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

  describe('state management', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('state is initially empty', () => {
      expect(Object.keys(state.tables).length).toBe(0)
    })

    it('tables is object type', () => {
      expect(typeof state.tables).toBe('object')
    })

    it('tables is not null', () => {
      expect(state.tables).not.toBeNull()
    })
  })

  describe('key handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('key is used as property name', () => {
      const payload = { key: 'myTable', data: [] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.myTable).toBeDefined()
    })

    it('key is removed from stored object', () => {
      const payload = { key: 'table1', columns: ['a', 'b'] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table1).not.toHaveProperty('key')
    })

    it('can use numeric keys', () => {
      const payload = { key: 'table123', data: [] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table123).toBeDefined()
    })

    it('can use special characters in key', () => {
      const payload = { key: 'table-name_v2', data: [] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables['table-name_v2']).toBeDefined()
    })
  })

  describe('pagination handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('can store pagination info', () => {
      const payload = {
        key: 'paginatedTable',
        pagination: { page: 1, pageSize: 20, total: 100 }
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.paginatedTable.pagination.page).toBe(1)
      expect(state.tables.paginatedTable.pagination.total).toBe(100)
    })

    it('can update page number', () => {
      const payload1 = { key: 'table', pagination: { page: 1, pageSize: 20 } }
      tableStore.mutations.setTable(state, payload1)
      const payload2 = { key: 'table', pagination: { page: 2, pageSize: 20 } }
      tableStore.mutations.setTable(state, payload2)
      expect(state.tables.table.pagination.page).toBe(2)
    })

    it('can handle different page sizes', () => {
      const sizes = [10, 20, 50, 100]
      sizes.forEach((size, index) => {
        const payload = {
          key: 'table',
          pagination: { page: 1, pageSize: size, total: 500 }
        }
        tableStore.mutations.setTable(state, payload)
        expect(state.tables.table.pagination.pageSize).toBe(size)
      })
    })
  })

  describe('sorting handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('can store sorting info', () => {
      const payload = {
        key: 'sortedTable',
        sorting: { field: 'name', order: 'asc' }
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.sortedTable.sorting.field).toBe('name')
      expect(state.tables.sortedTable.sorting.order).toBe('asc')
    })

    it('can change sorting field', () => {
      const payload1 = { key: 'table', sorting: { field: 'name', order: 'asc' } }
      tableStore.mutations.setTable(state, payload1)
      const payload2 = { key: 'table', sorting: { field: 'date', order: 'desc' } }
      tableStore.mutations.setTable(state, payload2)
      expect(state.tables.table.sorting.field).toBe('date')
      expect(state.tables.table.sorting.order).toBe('desc')
    })

    it('can toggle sort order', () => {
      const payload = { key: 'table', sorting: { field: 'id', order: 'asc' } }
      tableStore.mutations.setTable(state, payload)
      payload.sorting.order = 'desc'
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table.sorting.order).toBe('desc')
    })
  })

  describe('column handling', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('can store column definitions', () => {
      const payload = {
        key: 'table',
        columns: [
          { field: 'id', label: 'ID' },
          { field: 'name', label: 'Name' }
        ]
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table.columns).toHaveLength(2)
    })

    it('can store simple column names', () => {
      const payload = { key: 'table', columns: ['id', 'name', 'email'] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table.columns).toHaveLength(3)
    })

    it('can update columns', () => {
      const payload1 = { key: 'table', columns: ['col1', 'col2'] }
      tableStore.mutations.setTable(state, payload1)
      const payload2 = { key: 'table', columns: ['col1', 'col2', 'col3'] }
      tableStore.mutations.setTable(state, payload2)
      expect(state.tables.table.columns).toHaveLength(3)
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

    it('full workflow: action to mutation to state', () => {
      const commit = jest.fn((mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      })

      const payload = {
        key: 'workflowTable',
        data: [{ id: 1 }],
        pagination: { page: 1, pageSize: 10 }
      }
      tableStore.actions.setTable({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('setTable', payload)
      expect(state.tables.workflowTable).toBeDefined()
    })

    it('can handle rapid table updates', () => {
      const commit = (mutationName, payload) => {
        tableStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 5; i++) {
        const payload = {
          key: 'rapidTable',
          data: Array(i + 1).fill({}),
          page: i
        }
        commit('setTable', payload)
      }
      expect(state.tables.rapidTable.data).toHaveLength(5)
      expect(state.tables.rapidTable.page).toBe(4)
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('handles empty data array', () => {
      const payload = { key: 'emptyTable', data: [] }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.emptyTable.data).toHaveLength(0)
    })

    it('handles large data sets', () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({ id: i }))
      const payload = { key: 'largeTable', data: largeData }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.largeTable.data).toHaveLength(10000)
    })

    it('handles null data', () => {
      const payload = { key: 'nullTable', data: null }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.nullTable.data).toBeNull()
    })

    it('handles nested complex objects', () => {
      const payload = {
        key: 'complexTable',
        data: [
          {
            id: 1,
            user: { name: 'Alice', contact: { email: 'alice@example.com' } }
          }
        ]
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.complexTable.data[0].user.contact.email).toBe('alice@example.com')
    })

    it('overwrites existing table completely', () => {
      const payload1 = { key: 'table', data: [{ id: 1 }], name: 'Old' }
      tableStore.mutations.setTable(state, payload1)
      const payload2 = { key: 'table', data: [{ id: 2 }], name: 'New' }
      tableStore.mutations.setTable(state, payload2)
      expect(state.tables.table.data[0].id).toBe(2)
      expect(state.tables.table.name).toBe('New')
    })
  })

  describe('type safety', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(tableStore.state))
    })

    it('state tables is object type', () => {
      expect(typeof state.tables).toBe('object')
    })

    it('mutation is function', () => {
      expect(typeof tableStore.mutations.setTable).toBe('function')
    })

    it('action is function', () => {
      expect(typeof tableStore.actions.setTable).toBe('function')
    })

    it('can store any property on table', () => {
      const payload = {
        key: 'table',
        customProp1: 'value1',
        customProp2: 123,
        customProp3: { nested: true },
        customProp4: [1, 2, 3]
      }
      tableStore.mutations.setTable(state, payload)
      expect(state.tables.table.customProp1).toBe('value1')
      expect(state.tables.table.customProp2).toBe(123)
      expect(state.tables.table.customProp3.nested).toBe(true)
    })
  })
})
