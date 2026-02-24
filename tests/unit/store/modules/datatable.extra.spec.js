import datatableStore from '@/store/modules/datatable'

describe('datatable store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = { tables: {} }
  })

  describe('mutations', () => {
    it('setTable stores payload by key', () => {
      datatableStore.mutations.setTable(state, {
        key: 'usersTable',
        page: 1,
        size: 10
      })
      expect(state.tables.usersTable).toEqual({ page: 1, size: 10 })
    })
    it('setTable removes key from payload', () => {
      datatableStore.mutations.setTable(state, {
        key: 't1',
        page: 2
      })
      expect(state.tables.t1).not.toHaveProperty('key')
    })
  })

  describe('actions', () => {
    it('setTable commits mutation', () => {
      const commit = jest.fn()
      datatableStore.actions.setTable({ commit }, { key: 't1', page: 1 })
      expect(commit).toHaveBeenCalledWith('setTable', { key: 't1', page: 1 })
    })
    it('setTable defaults to empty object', () => {
      const commit = jest.fn()
      datatableStore.actions.setTable({ commit })
      expect(commit).toHaveBeenCalledWith('setTable', {})
    })
  })
})
