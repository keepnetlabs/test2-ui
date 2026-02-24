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

    it('setTable stores under undefined key when payload has no key', () => {
      datatableStore.mutations.setTable(state, {
        page: 3,
        size: 20
      })
      expect(state.tables.undefined).toEqual({ page: 3, size: 20 })
    })

    it('setTable overwrites existing table entry with same key', () => {
      datatableStore.mutations.setTable(state, { key: 't1', page: 1 })
      datatableStore.mutations.setTable(state, { key: 't1', page: 9, size: 99 })
      expect(state.tables.t1).toEqual({ page: 9, size: 99 })
    })

    it('setTable mutates original payload by removing key', () => {
      const payload = { key: 'origin', page: 4 }
      datatableStore.mutations.setTable(state, payload)
      expect(payload.key).toBeUndefined()
      expect(payload.page).toBe(4)
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

    it('setTable with explicit undefined payload still uses default empty object', () => {
      const commit = jest.fn()
      datatableStore.actions.setTable({ commit }, undefined)
      expect(commit).toHaveBeenCalledWith('setTable', {})
    })
  })
})
