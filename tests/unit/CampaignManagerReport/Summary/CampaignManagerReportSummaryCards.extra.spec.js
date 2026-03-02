import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'

describe('CampaignManagerReportSummaryCards.vue (extra branch coverage)', () => {
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

  it('click+data+attachment combination drives expected labels/classes', () => {
    const wrapper = createWrapper({ multipleType: [true, true, true, false] })
    expect(wrapper.vm.isCampaignHasClickOnlyAndDataSubmissionAndAttachment).toBe(true)
    expect(wrapper.vm.getFirstCardTitle).toBe('Phishing Reporter')
    expect(wrapper.vm.getSecondCardLabel).toBe('Clicked Link')
    expect(wrapper.vm.getThirdCardLabel).toBe('Submitted Data')
    expect(wrapper.vm.getFourthCardLabel).toBe('Opened Attachment')
    expect(wrapper.vm.getThirdCardClass).toBe('campaign-manager-report-summary-info-card--submitted-data')
  })

  it('attachment+mfa+click-only combination maps to mfa/card class branches', () => {
    const wrapper = createWrapper({ multipleType: [true, false, true, true] })
    expect(wrapper.vm.isCampaignAttachmentAndMfaClickOnly).toBe(true)
    expect(wrapper.vm.getSecondCardLabel).toBe('Clicked Link')
    expect(wrapper.vm.getThirdCardLabel).toBe('Submitted MFA Code')
    expect(wrapper.vm.getFourthCardLabel).toBe('Opened Attachment')
    expect(wrapper.vm.getFourthCardClass).toBe(
      'campaign-manager-report-summary-info-card--opened-attachment-data'
    )
  })

  it('attachment+mfa+data-submission combination maps icon/color related branches', () => {
    const wrapper = createWrapper({ multipleType: [false, true, true, true] })
    expect(wrapper.vm.isCampaignAttachmentAndMfaDataSubmission).toBe(true)
    expect(wrapper.vm.getSecondCardLabel).toBe('Opened Attachment')
    expect(wrapper.vm.getThirdCardLabel).toBe('Submitted Data')
    expect(wrapper.vm.getFourthCardLabel).toBe('Submitted MFA Code')
    expect(wrapper.vm.getThirdCardColor).toBe('#B83A3A')
  })

  it('method-only branches (2 and 3) map second/third/fourth labels', () => {
    const methodTwo = createWrapper({ method: 2, multipleType: [] })
    expect(methodTwo.vm.getSecondCardLabel).toBe('Phishing Reporters')
    expect(methodTwo.vm.getThirdCardLabel).toBe('Clicked Link')
    expect(methodTwo.vm.getFourthCardLabel).toBe('Submitted Data')
    expect(methodTwo.vm.getFourthCardClass).toBe('campaign-manager-report-summary-info-card--submitted-data')

    const methodThree = createWrapper({ method: 3, multipleType: [] })
    expect(methodThree.vm.getSecondCardLabel).toBe('Phishing Reporters')
    expect(methodThree.vm.getThirdCardLabel).toBe('Opened Email')
    expect(methodThree.vm.getFourthCardLabel).toBe('Opened Attachment')
    expect(methodThree.vm.getFourthCardClass).toBe(
      'campaign-manager-report-summary-info-card--opened-attachment-data'
    )
  })

  it('click-only+mfa combination shows PhishingReporters in second card', () => {
    const wrapper = createWrapper({ multipleType: [true, false, false, true] })
    expect(wrapper.vm.isCampaignClickOnlyAndMfa).toBe(true)
    expect(wrapper.vm.getSecondCardLabel).toBe('Phishing Reporters')
    expect(wrapper.vm.getThirdCardLabel).toBe('Clicked Link')
    expect(wrapper.vm.getFourthCardLabel).toBe('Submitted MFA Code')
  })

  it('data-submission+mfa combination shows PhishingReporters in second card', () => {
    const wrapper = createWrapper({ multipleType: [false, true, false, true] })
    expect(wrapper.vm.isCampaignDataSubmissionAndMfa).toBe(true)
    expect(wrapper.vm.getSecondCardLabel).toBe('Phishing Reporters')
    expect(wrapper.vm.getThirdCardLabel).toBe('Submitted Data')
    expect(wrapper.vm.getFourthCardLabel).toBe('Submitted MFA Code')
  })

  it('data getters return empty objects when items is missing', () => {
    const wrapper = createWrapper({ items: undefined })
    expect(wrapper.vm.getNoResponseData).toEqual({})
    expect(wrapper.vm.getOpenedData).toEqual({})
    expect(wrapper.vm.getOpenedAttachmentData).toEqual({})
    expect(wrapper.vm.getSubmittedData).toEqual({})
    expect(wrapper.vm.getClickedData).toEqual({})
    expect(wrapper.vm.getPhishingReporterData).toEqual({})
    expect(wrapper.vm.getMfaData).toEqual({})
  })
})
