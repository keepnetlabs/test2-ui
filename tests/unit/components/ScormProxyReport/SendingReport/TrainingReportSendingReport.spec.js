const mockBlob = {}
import { shallowMount } from '@vue/test-utils'
import TrainingReportSendingReport from '@/components/ScormProxyReport/SendingReport/TrainingReportSendingReport.vue'

jest.mock('@/api/awarenessEducator', () => ({
  sendingReportTrainingReport: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  }),
  resendTrainingSendingReportList: jest.fn().mockResolvedValue({}),
  getTrainingReportSendingReportDetails: jest.fn().mockResolvedValue({ data: { data: {} } }),
  exportSendingReport: jest.fn().mockResolvedValue(mockBlob)
}))

describe('ScormProxyReport SendingReport TrainingReportSendingReport.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportSendingReport, {
      propsData: {
        id: 'test-id',
        isSurvey: false,
        ...propsData
      },
      stubs: {
        DataTable: true,
        Badge: true,
        CampaignManagerReportHeader: true,
        TrainingReportResendDialog: true,
        TrainingReportSendingReportExtendedView: true
      }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getEvents', () => {
    it('returns mapped events from extendedViewValue', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [
          {
            events: [
              { event: 'delivered', timestamp: '2024-01-01', mxServer: 'mx1' }
            ]
          }
        ]
      })
      expect(wrapper.vm.getEvents).toHaveLength(1)
      expect(wrapper.vm.getEvents[0].status).toBe('Delivered')
    })

    it('returns empty array when extendedViewValue is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({ extendedViewValue: [] })
      expect(wrapper.vm.getEvents).toEqual([])
    })
  })

  describe('getNoEventMessage', () => {
    it('returns Sendgrid message when provider is Sendgrid', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
      })
      expect(wrapper.vm.getNoEventMessage).toContain('Activity details will be available')
    })

    it('returns SMTP message for other providers', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [{ serviceProvider: 'Custom SMTP' }]
      })
      expect(wrapper.vm.getNoEventMessage).toContain('Event history is only available for SMTP')
    })
  })

  describe('getEventReason', () => {
    it('returns reason when present', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getEventReason({ reason: 'Bounce', event: 'bounce' })
      ).toBe('Bounce')
    })

    it('returns delivered message for delivered event', () => {
      const wrapper = createWrapper()
      wrapper.setData({ extendedViewValue: [{}] })
      expect(
        wrapper.vm.getEventReason({ event: 'delivered' })
      ).toBe('This email was delivered')
    })
  })
})

