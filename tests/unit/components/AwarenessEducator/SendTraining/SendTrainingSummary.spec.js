import SendTrainingSummary from '@/components/AwarenessEducator/SendTraining/SendTrainingSummary.vue'

describe('SendTrainingSummary.vue', () => {
  it('getTotalTargetGroupsAndUsersCount builds summary text', () => {
    const text = SendTrainingSummary.computed.getTotalTargetGroupsAndUsersCount.call({
      formData: { selectedTargetGroups: [{}, {}] },
      getTotalActiveUsers: 5
    })
    expect(text).toContain('5 active user(s)')
    expect(text).toContain('2 group(s)')
  })

  it('watch isShowTrainingEmail emits and resets flag', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit, isShowTrainingEmail: true }
    SendTrainingSummary.watch.isShowTrainingEmail.call(ctx, true)
    expect(emit).toHaveBeenCalledWith('on-show-training-summary')
    expect(ctx.isShowTrainingEmail).toBe(false)
  })
})

