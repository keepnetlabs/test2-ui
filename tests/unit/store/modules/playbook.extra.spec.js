import playbook from '@/store/modules/playbook'

jest.mock('@/api/playbook', () => ({
  searchPlaybook: jest.fn()
}))

describe('playbook store (extra coverage)', () => {
  const { searchPlaybook } = require('@/api/playbook')

  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(playbook.state))
    jest.clearAllMocks()
  })

  describe('getters', () => {
    it('playbookListGetter returns state', () => {
      state.playbookList = [{ id: 1 }]
      expect(playbook.getters.playbookListGetter(state)).toEqual([{ id: 1 }])
    })
  })

  describe('mutations', () => {
    it('SET_PLAYBOOK_LIST assigns payload.data to state', () => {
      playbook.mutations.SET_PLAYBOOK_LIST(state, {
        data: { results: [{ id: 1 }] }
      })
      expect(state.playbookList).toEqual({ results: [{ id: 1 }] })
    })
  })

  describe('actions', () => {
    it('getPlaybookList commits on success', async () => {
      searchPlaybook.mockResolvedValue({
        data: { data: { results: [{ id: 1 }] } }
      })
      const commit = jest.fn()
      await playbook.actions.getPlaybookList({ commit }, {})
      expect(commit).toHaveBeenCalledWith('SET_PLAYBOOK_LIST', expect.any(Object))
    })

    it('getPlaybookList commits error state on catch', async () => {
      searchPlaybook.mockRejectedValue(new Error('API error'))
      const commit = jest.fn()
      await playbook.actions.getPlaybookList({ commit }, {})
      expect(commit).toHaveBeenCalledWith('common/SET_ERROR_MESSAGE', 'Error when getting playbook list', {
        root: true
      })
    })
  })
})
