import TrainingReportSMSSummary from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSMSSummary.vue'

describe('TrainingReportSMSSummary.vue (extra)', () => {
  it('getItems deletes keys when show is false', () => {
    const ctx = {
      items: {
        A: { show: true, value: 'a' },
        B: { show: false, value: 'b' }
      }
    }
    expect(TrainingReportSMSSummary.computed.getItems.call(ctx)).toEqual({ A: 'a' })
  })

  it('getDeliveryValue handles undefined helperData', () => {
    expect(TrainingReportSMSSummary.computed.getDeliveryValue.call({})).toBe('0 sent')
  })
})
