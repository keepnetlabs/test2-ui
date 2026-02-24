import auth from '@/store/modules/auth'

jest.mock('jwt-decode', () => jest.fn(() => ({ sub: 'user-1' })))
jest.mock('@/utils/functions', () => ({ setGlobalUserData: jest.fn() }))

describe('auth store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(auth.state))
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('getters', () => {
    it('getTimezoneFormat returns timeFormat and dateFormat', () => {
      state.timeFormat = '12h'
      state.dateFormat = 'MM/dd/yyyy'
      expect(auth.getters.getTimezoneFormat(state)).toEqual({
        timeFormat: '12h',
        dateFormat: 'MM/dd/yyyy'
      })
    })

    it('companyUpdateRequired returns state value', () => {
      state.companyUpdateRequired = true
      expect(auth.getters.companyUpdateRequired(state)).toBe(true)
    })
  })

  describe('mutations', () => {
    it('SET_CURRENTUSER with isSelectCompany and null data returns early', () => {
      auth.mutations.SET_CURRENTUSER(state, {
        isSelectCompany: true,
        currentUserData: null
      })
      expect(state.user).toEqual({})
    })

    it('SET_CURRENTUSER with isSelectCompany uses localStorage for selectedCompanyName', () => {
      localStorage.setItem('selectedCompanyName', 'Stored Company')
      auth.mutations.SET_CURRENTUSER(state, {
        isSelectCompany: true,
        currentUserData: {
          userCompany: { name: 'API Company', id: 'c1', logoPath: '/logo.png' },
          firstName: 'John',
          role: { name: 'Admin' }
        },
        permissions: []
      })
      expect(state.selectedCompanyName).toBe('Stored Company')
    })

    it('SET_FORMATS only updates dateFormat when provided', () => {
      state.dateFormat = null
      state.timeFormat = null
      auth.mutations.SET_FORMATS(state, { dateFormat: 'dd/MM/yyyy' })
      expect(state.dateFormat).toBe('dd/MM/yyyy')
      expect(state.timeFormat).toBeNull()
    })

    it('SET_FORMATS only updates timeFormat when provided', () => {
      state.timeFormat = null
      auth.mutations.SET_FORMATS(state, { timeFormat: '24h' })
      expect(state.timeFormat).toBe('24h')
    })

    it('SET_COMPANY_UPDATE_REQUIRED updates state', () => {
      auth.mutations.SET_COMPANY_UPDATE_REQUIRED(state, true)
      expect(state.companyUpdateRequired).toBe(true)
    })
  })

  describe('actions', () => {
    it('setCompanyName commits SET_COMPANY_NAME', () => {
      const commit = jest.fn()
      auth.actions.setCompanyName({ commit }, 'Acme Corp')
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_NAME', 'Acme Corp')
    })

    it('setCompanyUpdateRequired commits SET_COMPANY_UPDATE_REQUIRED', () => {
      const commit = jest.fn()
      auth.actions.setCompanyUpdateRequired({ commit }, true)
      expect(commit).toHaveBeenCalledWith('SET_COMPANY_UPDATE_REQUIRED', true)
    })
  })
})
