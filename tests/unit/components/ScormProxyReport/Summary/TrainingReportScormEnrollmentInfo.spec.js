import TrainingReportScormEnrollmentInfo from '@/components/ScormProxyReport/Summary/TrainingReportScormEnrollmentInfo.vue'

describe('TrainingReportScormEnrollmentInfo.vue', () => {
  const { computed, methods } = TrainingReportScormEnrollmentInfo

  it('computes visible items and audience source flags', () => {
    const items = {
      'Target Users': { show: true, value: 4 },
      'Non-Target Users': { show: true, value: 1 },
      Hidden: { show: false, value: 'x' },
      targetGroupCount: { show: false, value: 3 }
    }

    expect(computed.getItems.call({ items })).toEqual({
      'Target Users': 4,
      'Non-Target Users': 1
    })

    expect(computed.isFromUserGroups.call({ type: 'userGroups' })).toBe(true)
    expect(computed.isFromPhishingCampaign.call({ type: 'phishingCampaign' })).toBe(true)
  })

  it('computes audience/body text values', () => {
    const items = {
      'Target Users': { value: 1 },
      'Non-Target Users': { value: 2 },
      targetGroupCount: { value: 5 }
    }

    expect(
      computed.getAudienceText.call({
        isFromUserGroups: true,
        isFromPhishingCampaign: false,
        items
      })
    ).toBe('5 user groups')

    expect(
      computed.getAudienceText.call({
        isFromUserGroups: false,
        isFromPhishingCampaign: true,
        items
      })
    ).toBe('a phishing campaign results')

    expect(computed.getBodyValue.call({ items })).toBe('1 user')
    expect(computed.getNonTargetUsersValue.call({ items })).toBe('2 users')
    expect(computed.getBodyValue.call({ items: {} })).toBe('0 user')
  })

  it('emits audienceClick on handleAudienceClick', () => {
    const emit = jest.fn()
    methods.handleAudienceClick.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('audienceClick')
  })
})
