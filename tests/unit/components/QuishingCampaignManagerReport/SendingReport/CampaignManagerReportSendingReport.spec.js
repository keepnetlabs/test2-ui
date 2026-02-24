import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReport from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReport.vue'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

describe('QuishingCampaignManagerReport CampaignManagerReportSendingReport.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSendingReport, {
      propsData: {
        id: 'q1',
        instanceGroup: 'g1',
        customFields: [],
        formDetails: {},
        apiResponse: {},
        ...propsData
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportSendingReportTable: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getReportSubtitle returns Quishing email delivery when not printout', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getReportSubtitle).toContain('email delivery')
  })

  it('getReportSubtitle returns Quishing delivery when isQuishingTypePrintout', () => {
    const wrapper = mountComponent({
      apiResponse: {
        data: {
          data: {
            scenarios: [
              {
                scenarioInfo: { templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT }
              }
            ]
          }
        }
      }
    })
    expect(wrapper.vm.getReportSubtitle).toContain('delivery details')
    expect(wrapper.vm.getReportSubtitle).not.toContain('email')
  })

  it('getLastSendingStatusItems returns userStatuses from formDetails', () => {
    const wrapper = mountComponent({
      formDetails: { userStatuses: [{ id: 1, name: 'Sent' }] }
    })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([{ id: 1, name: 'Sent' }])
  })

  it('getLastSendingStatusItems returns empty array when formDetails missing', () => {
    const wrapper = mountComponent({ formDetails: undefined })
    expect(wrapper.vm.getLastSendingStatusItems).toEqual([])
  })

  it('isQuishingTypePrintout returns true when templateType is individual', () => {
    const wrapper = mountComponent({
      apiResponse: {
        data: {
          data: {
            scenarios: [
              { scenarioInfo: { templateType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT } }
            ]
          }
        }
      }
    })
    expect(wrapper.vm.isQuishingTypePrintout).toBe(true)
  })

  it('isQuishingTypePrintout returns false when templateType is email', () => {
    const wrapper = mountComponent({
      apiResponse: {
        data: {
          data: {
            scenarios: [{ scenarioInfo: { templateType: QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL } }]
          }
        }
      }
    })
    expect(wrapper.vm.isQuishingTypePrintout).toBe(false)
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(5)
    expect(wrapper.vm.resendItemCount).toBe(5)
  })

  it('handleOnResend sets resendPayload and opens dialog', () => {
    const wrapper = mountComponent()
    const payload = { items: ['u1'] }
    wrapper.vm.handleOnResend(payload)
    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnDetail sets selectedRow and calls toggleShowDetailDialog', () => {
    const wrapper = mountComponent()
    wrapper.vm.toggleShowDetailDialog = jest.fn()
    wrapper.vm.handleOnDetail({ resourceId: 'r1' })
    expect(wrapper.vm.selectedRow).toEqual({ resourceId: 'r1' })
    expect(wrapper.vm.toggleShowDetailDialog).toHaveBeenCalled()
  })
})
