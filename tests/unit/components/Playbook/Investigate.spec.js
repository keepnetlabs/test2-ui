jest.mock('@/api/targetUsers', () => ({
  getTargetUsers: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  searchTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

import Investigate from '@/components/Playbook/Investigate.vue'

describe('Playbook Investigate.vue', () => {
  it('getParentIndex returns index prop', () => {
    const ctx = { index: 5 }
    expect(Investigate.computed.getParentIndex.call(ctx)).toBe(5)
  })

  it('handleRadioGroup clears targetUsers', () => {
    const ctx = {
      investigateData: { targetUserType: 'Groups', targetUsers: ['g1'] },
      $forceUpdate: jest.fn()
    }
    Investigate.methods.handleRadioGroup.call(ctx)
    expect(ctx.investigateData.targetUsers).toEqual([])
  })

  describe('setTargetUsers', () => {
    it('appends results when already initialized', () => {
      const ctx = {
        isTargetUsersInitialized: true,
        specificUserItems: [{ email: 'existing@test.com' }],
        investigateData: {}
      }
      Investigate.methods.setTargetUsers.call(ctx, {
        data: { data: { results: [{ email: 'new@test.com' }] } }
      })
      expect(ctx.specificUserItems).toHaveLength(2)
      expect(ctx.isTargetUsersInitialized).toBe(true)
    })

    it('maps autocomplete users and sets flag on first call with autocomplete data', () => {
      const ctx = {
        isTargetUsersInitialized: false,
        specificUserItems: [],
        investigateData: {
          targetUsersForAutocomplete: [{ name: 'user@test.com', id: 1 }]
        }
      }
      Investigate.methods.setTargetUsers.call(ctx, {
        data: { data: { results: [{ email: 'api@test.com' }] } }
      })
      expect(ctx.isTargetUsersInitialized).toBe(true)
      expect(ctx.specificUserItems.some((u) => u.email === 'user@test.com')).toBe(true)
      expect(ctx.specificUserItems.some((u) => u.email === 'api@test.com')).toBe(true)
    })

    it('appends results and sets flag on first call without autocomplete data', () => {
      const ctx = {
        isTargetUsersInitialized: false,
        specificUserItems: [],
        investigateData: { targetUsersForAutocomplete: [] }
      }
      Investigate.methods.setTargetUsers.call(ctx, {
        data: { data: { results: [{ email: 'api@test.com' }] } }
      })
      expect(ctx.isTargetUsersInitialized).toBe(true)
      expect(ctx.specificUserItems).toHaveLength(1)
    })

    it('handles empty results gracefully', () => {
      const ctx = {
        isTargetUsersInitialized: true,
        specificUserItems: [{ email: 'keep@test.com' }],
        investigateData: {}
      }
      Investigate.methods.setTargetUsers.call(ctx, {
        data: { data: { results: [] } }
      })
      expect(ctx.specificUserItems).toHaveLength(1)
    })
  })
})
