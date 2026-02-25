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
})
