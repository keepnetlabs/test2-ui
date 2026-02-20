jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportSummary: jest.fn(),
  getScormProxyTrainingReportSummary: jest.fn(),
  getTrainingReportFormDetails: jest.fn()
}))

import ScormProxyReport from '@/views/ScormProxyReport.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ScormProxyReport.vue', () => {
  const { methods, computed } = ScormProxyReport

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed id/getTrainingName/isScormProxy return expected values', () => {
    expect(computed.id.call({ $route: { params: { id: 'tr-1' } } })).toBe('tr-1')
    expect(
      computed.getTrainingName.call({
        $store: { state: { common: { activePageRouterName: 'Phishing 101' } } }
      })
    ).toBe('Phishing 101')
    expect(computed.getTrainingName.call({ $store: { state: {} } })).toBe('Training Name')
    expect(computed.isScormProxy.call({ trainingSummary: { isScormProxy: true } })).toBe(true)
    expect(computed.isScormProxy.call({ trainingSummary: null })).toBe(false)
  })

  it('created hook calls form details and summary loaders', () => {
    const callForFormDetails = jest.fn()
    const callForSummary = jest.fn()
    const ctx = { callForFormDetails, callForSummary }

    ScormProxyReport.created.call(ctx)

    expect(callForFormDetails).toHaveBeenCalledTimes(1)
    expect(callForSummary).toHaveBeenCalledTimes(1)
  })

  it('callForFormDetails stores response payload', async () => {
    AwarenessEducatorService.getTrainingReportFormDetails.mockResolvedValueOnce({
      data: { data: { timeZones: [] } }
    })
    const ctx = { formDetails: null }

    methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportFormDetails).toHaveBeenCalledTimes(1)
    expect(ctx.formDetails).toEqual({ timeZones: [] })
  })

  it('callForSummary updates summary data and handles survey tab labels', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Training A',
          trainingDetails: { hasQuiz: true }
        }
      }
    })
    AwarenessEducatorService.getScormProxyTrainingReportSummary.mockResolvedValueOnce({
      data: { data: { completionRate: 88 } }
    })

    const dispatch = jest.fn()
    const ctx = {
      id: 't-1',
      isLoading: false,
      isSurvey: false,
      trainingSummary: null,
      scormTrainingSummary: null,
      tabItems: [
        { label: 'Summary' },
        { label: 'Users' },
        { label: 'Opened Training Email' },
        { label: 'Clicked Training Link' },
        { label: 'Progress' },
        { label: 'Exam Results' },
        { label: 'No Response' },
        { label: 'Sending Report' }
      ],
      $store: { dispatch }
    }

    methods.callForSummary.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportSummary).toHaveBeenCalledWith('t-1')
    expect(AwarenessEducatorService.getScormProxyTrainingReportSummary).toHaveBeenCalledWith('t-1')
    expect(ctx.trainingSummary.name).toBe('Training A')
    expect(ctx.isSurvey).toBe(true)
    expect(ctx.tabItems[2].label).toBeTruthy()
    expect(ctx.tabItems[3].label).toBeTruthy()
    expect(ctx.tabItems).toHaveLength(7)
    expect(ctx.scormTrainingSummary).toEqual({ completionRate: 88 })
    expect(dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Training A')
    expect(ctx.isLoading).toBe(false)
  })

  it('callForSummary keeps tab items intact when training has no quiz', async () => {
    AwarenessEducatorService.getTrainingReportSummary.mockResolvedValueOnce({
      data: {
        data: {
          name: 'Training B',
          trainingDetails: { hasQuiz: false }
        }
      }
    })
    AwarenessEducatorService.getScormProxyTrainingReportSummary.mockResolvedValueOnce({
      data: { data: {} }
    })
    const ctx = {
      id: 't-2',
      isLoading: false,
      isSurvey: false,
      trainingSummary: null,
      scormTrainingSummary: null,
      tabItems: [{}, {}, {}, {}, {}, {}, {}, {}],
      $store: { dispatch: jest.fn() }
    }

    methods.callForSummary.call(ctx)
    await flushPromises()

    expect(ctx.isSurvey).toBe(false)
    expect(ctx.tabItems).toHaveLength(8)
    expect(ctx.isLoading).toBe(false)
  })
})
