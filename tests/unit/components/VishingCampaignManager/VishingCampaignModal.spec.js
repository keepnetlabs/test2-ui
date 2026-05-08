import VishingCampaignModal from '@/components/VishingCampaignManager/VishingCampaignModal.vue'
import labels from '@/model/constants/labels'

describe('VishingCampaignModal.vue', () => {
  it('getTitle returns New Vishing Campaign when not edit', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: false })
    ).toBe('New Vishing Campaign')
  })

  it('getTitle returns Edit Vishing Campaign when edit and not duplicate', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: true, isDuplicate: false })
    ).toBe('Edit Vishing Campaign')
  })

  it('getTitle returns Duplicate Vishing Campaign when duplicate', () => {
    expect(
      VishingCampaignModal.computed.getTitle.call({ isEdit: true, isDuplicate: true })
    ).toBe('Duplicate Vishing Campaign')
  })

  it('has data and computed', () => {
    expect(VishingCampaignModal.data).toBeDefined()
    expect(VishingCampaignModal.computed.getTitle).toBeDefined()
  })

  it('getSaveText maps schedule types to launch, save, or schedule label', () => {
    expect(
      VishingCampaignModal.computed.getSaveText.call({ formValues: { scheduleType: '1' } })
    ).toBe(labels.Launch)
    expect(
      VishingCampaignModal.computed.getSaveText.call({ formValues: { scheduleType: '2' } })
    ).toBe(labels.Save)
    expect(
      VishingCampaignModal.computed.getSaveText.call({ formValues: { scheduleType: '3' } })
    ).toBe(labels.Schedule)
  })

  it('isScheduledTimeDisabled is false only for schedule type 3', () => {
    expect(
      VishingCampaignModal.computed.isScheduledTimeDisabled.call({ formValues: { scheduleType: '3' } })
    ).toBe(false)
    expect(
      VishingCampaignModal.computed.isScheduledTimeDisabled.call({ formValues: { scheduleType: '1' } })
    ).toBe(true)
  })

  it('getDistributionTimeText pluralizes day and week labels', () => {
    const fn = VishingCampaignModal.computed.getDistributionTimeText
    expect(
      fn.call({ formValues: { sendCallsOverType: 'days', distributionOverDays: 2 } })
    ).toBe('days')
    expect(
      fn.call({ formValues: { sendCallsOverType: 'days', distributionOverDays: 1 } })
    ).toBe('day')
    expect(
      fn.call({ formValues: { sendCallsOverType: 'weeks', distributionOverDays: 3 } })
    ).toBe('weeks')
    expect(
      fn.call({ formValues: { sendCallsOverType: 'weeks', distributionOverDays: 1 } })
    ).toBe('week')
  })

  it('getDistributionOverDaysValueErrorMessage enforces 1 to 6 inclusive', () => {
    const fn = VishingCampaignModal.computed.getDistributionOverDaysValueErrorMessage
    expect(fn.call({ formValues: { distributionOverDays: 0 } })).toBe('Enter a number between 1 and 6')
    expect(fn.call({ formValues: { distributionOverDays: 7 } })).toBe('Enter a number between 1 and 6')
    expect(fn.call({ formValues: { distributionOverDays: '' } })).toBe('Enter a number between 1 and 6')
    expect(fn.call({ formValues: { distributionOverDays: 4 } })).toBe('')
  })

  it('getTotalActiveUsersWithPhoneNumber sums Yes counts for active target groups only', () => {
    const ctx = {
      userCountDetailResponse: {
        data: {
          data: [
            { status: 'Active', hasPhoneNumber: [{ status: 'Yes', count: 4 }] },
            { status: 'Inactive', hasPhoneNumber: [{ status: 'Yes', count: 100 }] },
            { status: 'Active', hasPhoneNumber: [{ status: 'No', count: 0 }] }
          ]
        }
      }
    }
    expect(VishingCampaignModal.computed.getTotalActiveUsersWithPhoneNumber.call(ctx)).toBe(4)
  })

  it('getTargetGroupItems returns only active rows from user count response', () => {
    const rows = [
      { status: 'Active', id: 1 },
      { status: 'Paused', id: 2 }
    ]
    expect(
      VishingCampaignModal.computed.getTargetGroupItems.call({
        userCountDetailResponse: { data: { data: rows } }
      })
    ).toEqual([{ status: 'Active', id: 1 }])
  })
})
