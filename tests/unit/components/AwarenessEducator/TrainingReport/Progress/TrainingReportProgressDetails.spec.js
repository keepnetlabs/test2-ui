jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getProgressDetailsTable: jest.fn(() =>
      Promise.resolve({
        data: {
          data: [{ sessionRank: 1, trackingInfo: { userAgent: 'Chrome', browserName: 'Chrome' } }]
        }
      })
    )
  }
}))

import TrainingReportProgressDetails from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgressDetails.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportProgressDetails.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportProgressDetails.name).toBe('TrainingReportProgressDetails')
  })

  it('getSubtitle joins first and last name', () => {
    expect(
      TrainingReportProgressDetails.computed.getSubtitle.call({
        item: { firstName: 'Ada', lastName: 'Lovelace' }
      })
    ).toBe('Ada Lovelace')
  })

  it('callForData fetches and maps trackingInfo', async () => {
    const ctx = {
      item: { enrollmentId: 'e1', targetUserResourceId: 'u1' },
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportProgressDetails.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.getProgressDetailsTable).toHaveBeenCalledWith('e1', 'u1')
    expect(ctx.tableData[0].userAgent).toBe('Chrome')
    expect(ctx.setLoading).toHaveBeenCalled()
  })

  it('handleClose emits on-close', () => {
    const $emit = jest.fn()
    TrainingReportProgressDetails.methods.handleClose.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })
})
