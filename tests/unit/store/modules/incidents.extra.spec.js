import incidents from '@/store/modules/incidents'

describe('incidents store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(incidents.state))
  })

  describe('mutations', () => {
    it('setIncidents updates state', () => {
      const payload = { id: 1, title: 'Incident' }
      incidents.mutations.setIncidents(state, payload)
      expect(state.incidents).toEqual(payload)
    })
  })

  describe('actions', () => {
    it('setIncidents commits with payload', () => {
      const commit = jest.fn()
      incidents.actions.setIncidents({ commit }, { id: 1 })
      expect(commit).toHaveBeenCalledWith('setIncidents', { id: 1 })
    })

    it('setIncidents uses default empty object when no payload', () => {
      const commit = jest.fn()
      incidents.actions.setIncidents({ commit })
      expect(commit).toHaveBeenCalledWith('setIncidents', {})
    })
  })
})
