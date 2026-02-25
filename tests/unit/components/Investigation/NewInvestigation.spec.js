import NewInvestigation from '@/components/Investigation/NewInvestigation.vue'

describe('NewInvestigation.vue', () => {
  it('changeStep decrements step when going back from step 2', () => {
    const ctx = {
      step: 2,
      $refs: {}
    }
    NewInvestigation.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(1)
  })

  it('data returns step and isActionButtonDisabled', () => {
    const data = NewInvestigation.data()
    expect(data.step).toBe(1)
    expect(data.isActionButtonDisabled).toBe(false)
  })
})
