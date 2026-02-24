import TrainingReportTrainingDelivery from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportTrainingDelivery.vue'

describe('TrainingReportTrainingDelivery.vue (extra)', () => {
  it('isNotDelivered is false when emailErrorUserCount is 0 or undefined', () => {
    expect(
      TrainingReportTrainingDelivery.computed.isNotDelivered.call({
        helperData: { emailErrorUserCount: 0 }
      })
    ).toBe(false)
    expect(
      TrainingReportTrainingDelivery.computed.isNotDelivered.call({ helperData: {} })
    ).toBe(false)
  })

  it('getNotDeliveredValue uses default when emailErrorUserCount missing', () => {
    expect(
      TrainingReportTrainingDelivery.computed.getNotDeliveredValue.call({
        helperData: {}
      })
    ).toBe(' not delivered')
  })
})
