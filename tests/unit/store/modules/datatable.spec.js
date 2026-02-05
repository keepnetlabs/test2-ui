import tableStore from '@/store/modules/datatable'

describe('datatable Vuex Module', () => {
  describe('State', () => {
    it('should initialize with empty tables object', () => {
      expect(tableStore.state.tables).toEqual({})
    })
  })

  describe('Mutations', () => {
    it('setTable should add table to state', () => {
      const state = { tables: {} }
      const payload = { key: 'myTable', data: 'test' }
      tableStore.mutations.setTable(state, payload)
      
      expect(state.tables.myTable).toEqual({ data: 'test' })
    })

    it('setTable should remove key from payload', () => {
      const state = { tables: {} }
      const payload = { key: 'table1', name: 'Test Table', columns: 5 }
      tableStore.mutations.setTable(state, payload)
      
      expect(state.tables.table1).toEqual({ name: 'Test Table', columns: 5 })
      expect(state.tables.table1.key).toBeUndefined()
    })

    it('setTable should update existing table', () => {
      const state = { tables: { myTable: { oldData: true } } }
      const payload = { key: 'myTable', newData: true }
      tableStore.mutations.setTable(state, payload)
      
      expect(state.tables.myTable).toEqual({ newData: true })
    })

    it('setTable should handle multiple tables', () => {
      const state = { tables: {} }
      tableStore.mutations.setTable(state, { key: 'table1', data: 1 })
      tableStore.mutations.setTable(state, { key: 'table2', data: 2 })
      
      expect(Object.keys(state.tables).length).toBe(2)
      expect(state.tables.table1.data).toBe(1)
      expect(state.tables.table2.data).toBe(2)
    })
  })

  describe('Actions', () => {
    it('setTable action should commit mutation', () => {
      const commit = jest.fn()
      const payload = { key: 'test', value: 'data' }
      tableStore.actions.setTable({ commit }, payload)
      
      expect(commit).toHaveBeenCalledWith('setTable', payload)
    })

    it('setTable action should work with default payload', () => {
      const commit = jest.fn()
      tableStore.actions.setTable({ commit })
      
      expect(commit).toHaveBeenCalledWith('setTable', {})
    })
  })

  describe('Namespacing', () => {
    it('module should be namespaced', () => {
      expect(tableStore.namespaced).toBe(true)
    })
  })
})
