import useDistributionComputed from '@/hooks/awareness-educator/useDistributionComputed'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'

describe('useDistributionComputed', () => {
  const { computed } = useDistributionComputed

  it('getDistributionTextRenderStatus returns false when no targets', () => {
    expect(
      computed.getDistributionTextRenderStatus.call({
        totalTargetUserCount: 0,
        inputDistributionFormData: {}
      })
    ).toBe(false)
  })

  it('builds distribution text for single and phishing multi target modes', () => {
    expect(
      computed.getDistributionText.call({
        totalTargetUserCount: 1,
        inputDistributionFormData: { distributionTypeId: DISTRIBUTION_TYPES.PHISHING }
      })
    ).toBe('Sending an email will start immediately for a single user.')

    const ctx = {
      totalTargetUserCount: 10,
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        sendingLimit: 5,
        distributionDelayEvery: 2
      },
      getSelectedSmtpDelayOverTimeType: 'minutes',
      getApproximatedTime: '4 minutes'
    }
    expect(computed.getDistributionText.call(ctx)).toContain('Sending 5 emails every 2 minutes')
  })

  it('formats getEmailOverMinutes and approximated time', () => {
    expect(computed.getEmailOverMinutes.call({ batchEverySendSecond: 0.3 })).toBe('00:01')
    expect(computed.getEmailOverMinutes.call({ batchEverySendSecond: 75.2 })).toBe('015:1.25')

    expect(computed.getApproximatedTime.call({ totalSendSecond: 0 })).toBe('1 second')
    expect(computed.getApproximatedTime.call({ totalSendSecond: 3665 })).toContain('1 hour')
  })
})
