import common from '@/store/modules/common'

jest.mock('@/api/common', () => ({ getTimezones: jest.fn().mockResolvedValue({ data: { data: [] } }) }))
jest.mock('@/api/settings', () => ({
  getSystemUserSettings: jest.fn().mockResolvedValue({
    data: { data: { timeZoneId: 'UTC', timeZoneName: 'UTC' } }
  })
}))
jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345')
}))

describe('common store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(common.state))
  })

  describe('getters', () => {
    it('getActivePageRouterName returns state value', () => {
      state.activePageRouterName = 'Reports'
      expect(common.getters.getActivePageRouterName(state)).toBe('Reports')
    })

    it('getSelectedTimeZone returns state value', () => {
      state.selectedTimeZone = 'UTC'
      expect(common.getters.getSelectedTimeZone(state)).toBe('UTC')
    })

    it('getSelectedTimeZoneName returns state value', () => {
      state.selectedTimeZoneName = 'UTC'
      expect(common.getters.getSelectedTimeZoneName(state)).toBe('UTC')
    })
  })

  describe('mutations', () => {
    it('SET_ACTIVE_TRAINING_TYPE updates state', () => {
      common.mutations.SET_ACTIVE_TRAINING_TYPE(state, 'Infographic')
      expect(state.activeTrainingType).toBe('Infographic')
    })

    it('SET_IS_LOADING increments isLoading', () => {
      state.isLoading = 0
      common.mutations.SET_IS_LOADING(state, 1)
      expect(state.isLoading).toBe(1)
      common.mutations.SET_IS_LOADING(state, -1)
      expect(state.isLoading).toBe(0)
    })

    it('SET_CREATE_SNACKBAR appends to snackbars', () => {
      state.snackbars = []
      common.mutations.SET_CREATE_SNACKBAR(state, { message: 'Test', id: '1' })
      expect(state.snackbars).toHaveLength(1)
      expect(state.snackbars[0].message).toBe('Test')
    })

    it('SET_CLOSE_SNACKBAR removes matching item', () => {
      const item = { id: '1', message: 'Remove me' }
      state.snackbars = [item, { id: '2', message: 'Keep' }]
      common.mutations.SET_CLOSE_SNACKBAR(state, item)
      expect(state.snackbars).toHaveLength(1)
      expect(state.snackbars[0].id).toBe('2')
    })
  })

  describe('actions', () => {
    it('setIsShowLeavingDialog commits show and callback', () => {
      const commit = jest.fn()
      const payload = { show: true, callback: jest.fn() }
      common.actions.setIsShowLeavingDialog({ commit }, payload)
      expect(commit).toHaveBeenCalledWith('SET_IS_SHOW_LEAVING_DIALOG', true)
      expect(commit).toHaveBeenCalledWith('SET_LEAVING_DIALOG_CALLBACK', payload.callback)
    })

    it('createSnackBar commits with id', () => {
      const commit = jest.fn()
      common.actions.createSnackBar({ commit }, { message: 'Hi' })
      expect(commit).toHaveBeenCalledWith(
        'SET_CREATE_SNACKBAR',
        expect.objectContaining({ message: 'Hi', status: true, id: '12345' })
      )
    })

    it('setActiveTrainingType commits payload', () => {
      const commit = jest.fn()
      common.actions.setActiveTrainingType({ commit }, 'Poster')
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_TRAINING_TYPE', 'Poster')
    })
  })
})
