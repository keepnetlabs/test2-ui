import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'

describe('CampaignManagerReportSummaryCards.vue', () => {
  const baseItems = {
    noResponse: { userCount: 10, userPercent: '10' },
    openedEmail: { userCount: 20, userPercent: '20' },
    clickedEmail: { userCount: 5, userPercent: '5' },
    submittedEmail: { userCount: 2, userPercent: '2' },
    phishingReporter: { userCount: 1, userPercent: '1' },
    mfa: { userCount: 3, userPercent: '3' },
    attachmentOpenedEmail: { userCount: 4, userPercent: '4' }
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryCards, {
      propsData: {
        items: baseItems,
        method: 1,
        multipleType: [],
        isLoading: false,
        ...propsData
      },
      stubs: {
        CampaignManagerReportSummaryInfoCard: true
      }
    })

  it('returns method-based defaults when no multipleType', () => {
    const wrapper = createWrapper({ method: 1, multipleType: [] })

    expect(wrapper.vm.getFirstCardTitle).toBe('No Response')
    expect(wrapper.vm.getSecondCardLabel).toBe('Phishing Reporters')
    expect(wrapper.vm.getThirdCardLabel).toBe('Opened Email')
    expect(wrapper.vm.getFourthCardLabel).toBe('Clicked Link')
  })

  it('switches to all-types branch when all multipleType values are true', () => {
    const wrapper = createWrapper({ multipleType: [true, true, true, true] })

    expect(wrapper.vm.isCampaignHasAllTypes).toBe(true)
    expect(wrapper.vm.getFirstCardTitle).toBe('Clicked Link')
    expect(wrapper.vm.getSecondCardLabel).toBe('Submitted MFA Code')
    expect(wrapper.vm.getThirdCardLabel).toBe('Submitted Data')
    expect(wrapper.vm.getFourthCardLabel).toBe('Opened Attachment')
  })

  it('maps data getters from items payload', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getNoResponseData).toEqual(baseItems.noResponse)
    expect(wrapper.vm.getOpenedData).toEqual(baseItems.openedEmail)
    expect(wrapper.vm.getOpenedAttachmentData).toEqual(baseItems.attachmentOpenedEmail)
    expect(wrapper.vm.getSubmittedData).toEqual(baseItems.submittedEmail)
    expect(wrapper.vm.getClickedData).toEqual(baseItems.clickedEmail)
    expect(wrapper.vm.getPhishingReporterData).toEqual(baseItems.phishingReporter)
    expect(wrapper.vm.getMfaData).toEqual(baseItems.mfa)
  })
})
