import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReportTable from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReportTable.vue'

jest.mock('@/api/smishing', () => ({
  searchCampaignJobType: jest.fn().mockResolvedValue({
    data: {
      data: {
        results: [],
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 1
      }
    }
  })
}))

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignJobEmailActivity: jest.fn().mockResolvedValue({ data: { data: {} } })
}))

describe('SmishingReport SendingReport CampaignManagerReportSendingReportTable.vue', () => {
  const createWrapper = (propsData = {}, provide = {}) => {
    return shallowMount(CampaignManagerReportSendingReportTable, {
      propsData: {
        id: 'test-id',
        lastSendingStatusItems: [],
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => false,
        ...provide
      },
      stubs: {
        DataTable: true,
        Badge: true,
        CampaignManagerReportTimeZoneColumn: true,
        DefaultButtonRowAction: true,
        CampaignManagerReportSendingReportEvent: true
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
              { event: 'delivered', timestamp: '2024-01-01', mxServer: 'mx1' },
              { event: 'processed', timestamp: '2024-01-02' }
            ]
          }
        ]
      })
      expect(wrapper.vm.getEvents).toHaveLength(2)
      expect(wrapper.vm.getEvents[0].status).toBe('Delivered')
      expect(wrapper.vm.getEvents[0].mxServer).toBe('mx1')
    })

    it('returns empty array when extendedViewValue is empty', () => {
      const wrapper = createWrapper()
      wrapper.setData({ extendedViewValue: [] })
      expect(wrapper.vm.getEvents).toEqual([])
    })

    it('returns empty array when events is null', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [{ events: null }]
      })
      expect(wrapper.vm.getEvents).toEqual([])
    })

    it('returns empty array when extendedViewValue[0] has no events', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [{}]
      })
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
      expect(wrapper.vm.getNoEventMessage).toContain('Event history is only available')
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage for Error status', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getErrorMessage({ status: 'Error', jobResultMessage: 'Bounce' })
      ).toBe('Bounce')
    })

    it('returns jobResultMessage for Not Delivered status', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getErrorMessage({ status: 'Not Delivered', jobResultMessage: 'Failed' })
      ).toBe('Failed')
    })

    it('returns empty string for other statuses', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getErrorMessage({ status: 'Delivered' })).toBe('')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('returns false when Error and has jobResultMessage', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getTooltipDisabilityStatus({ status: 'Error', jobResultMessage: 'msg' })
      ).toBe(false)
    })

    it('returns true when Error but no jobResultMessage', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Error' })).toBe(true)
    })

    it('returns false when Not Delivered and has jobResultMessage', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getTooltipDisabilityStatus({
          status: 'Not Delivered',
          jobResultMessage: 'Bounce'
        })
      ).toBe(false)
    })

    it('returns true when Not Delivered but no jobResultMessage', () => {
      const wrapper = createWrapper()
      expect(
        wrapper.vm.getTooltipDisabilityStatus({ status: 'Not Delivered' })
      ).toBe(true)
    })

    it('returns true when status is not Error/Not Delivered', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTooltipDisabilityStatus({ status: 'Delivered' })).toBe(true)
    })
  })

  describe('getEventReason', () => {
    it('returns reason when present', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getEventReason({ reason: 'Bounce', eventName: 'bounce' })).toBe('Bounce')
    })

    it('returns processed message for processed event', () => {
      const wrapper = createWrapper()
      wrapper.setData({
        extendedViewValue: [{ originatingIP: '1.2.3.4' }]
      })
      expect(wrapper.vm.getEventReason({ eventName: 'processed' })).toContain('1.2.3.4')
    })

    it('returns delivered message for delivered event', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getEventReason({ eventName: 'delivered' })).toBe(
        'This email was delivered'
      )
    })

    it('returns empty string for unknown event', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getEventReason({ eventName: 'opened' })).toBe('')
    })
  })

  describe('handleSelectionChange', () => {
    it('emits on-selection-text-change', () => {
      const wrapper = createWrapper()
      wrapper.vm.handleSelectionChange(5)
      expect(wrapper.emitted('on-selection-text-change')).toEqual([[5]])
    })
  })
})
