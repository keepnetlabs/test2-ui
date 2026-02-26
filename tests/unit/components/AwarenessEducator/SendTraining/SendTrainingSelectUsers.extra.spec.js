jest.mock('@/api/targetUsers', () => ({
  searchAllTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

import SendTrainingSelectUsers from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsers.vue'
import { searchAllTargetGroups } from '@/api/targetUsers'

describe('SendTrainingSelectUsers.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed flags: isMultipleMethod, isMFADataSubmission, isMFAClickOnly', () => {
    expect(
      SendTrainingSelectUsers.computed.isMultipleMethod.call({
        selectedCampaign: { methodType: 'Multiple Method' }
      })
    ).toBe(true)

    expect(
      SendTrainingSelectUsers.computed.isMFADataSubmission.call({
        selectedCampaign: {
          methodType: 'MFA',
          scenarios: [{ landingPageTemplateInfo: { methodTypeId: 2 } }]
        }
      })
    ).toBe(true)

    expect(
      SendTrainingSelectUsers.computed.isMFAClickOnly.call({
        selectedCampaign: {
          methodType: 'MFA',
          scenarios: [{ landingPageTemplateInfo: { methodTypeId: 1 } }]
        }
      })
    ).toBe(true)
  })

  it('getTargetGroupErrorMessage switches by selected groups length', () => {
    const withSelection = SendTrainingSelectUsers.computed.getTargetGroupErrorMessage.call({
      formData: { targetGroupResourceIds: [{ value: 'a' }] },
      getTargetGroupErrorText: 'Required'
    })
    expect(withSelection).toBe('Required')

    const emptySelection = SendTrainingSelectUsers.computed.getTargetGroupErrorMessage.call({
      formData: { targetGroupResourceIds: [] }
    })
    expect(emptySelection).toContain('target')
  })

  it('getErrorText returns checkbox error, target count error, and empty success', () => {
    expect(
      SendTrainingSelectUsers.computed.getErrorText.call({
        targetUserCheckboxSelectionError: true,
        getTotalTargetUserCount: 0
      })
    ).toContain('At least one of the options')

    expect(
      SendTrainingSelectUsers.computed.getErrorText.call({
        targetUserCheckboxSelectionError: false,
        getTotalTargetUserCount: 0
      })
    ).toContain('At least one target user')

    expect(
      SendTrainingSelectUsers.computed.getErrorText.call({
        targetUserCheckboxSelectionError: false,
        getTotalTargetUserCount: 5
      })
    ).toBe('')
  })

  it('watch selectedRadioGroupIndex reset branch for val=0', () => {
    const resetCheckboxes = jest.fn()
    const ctx = {
      resetCheckboxes,
      totalTargetUserCount: 5,
      methodTypeId: 'x',
      selectedCampaign: { id: 1 },
      formData: {
        campaignResourceId: 'campaign-1',
        targetGroupResourceIds: [{ value: 'g1' }]
      }
    }
    SendTrainingSelectUsers.watch.selectedRadioGroupIndex.call(ctx, 0)
    expect(resetCheckboxes).toHaveBeenCalled()
    expect(ctx.totalTargetUserCount).toBe(0)
    expect(ctx.formData.campaignResourceId).toBe('')
    expect(ctx.selectedCampaign).toBeNull()
  })

  it('watch selectedRadioGroupIndex clears target groups and resets table when val=1', () => {
    const resetSelectableParams = jest.fn()
    const ctx = {
      formData: { targetGroupResourceIds: [{ value: 'g1' }] },
      $refs: {
        refTargetGroups: {
          $refs: {
            refGroupTable: {
              $refs: { refTable: { resetSelectableParams } }
            }
          }
        }
      }
    }
    SendTrainingSelectUsers.watch.selectedRadioGroupIndex.call(ctx, 1)
    expect(ctx.formData.targetGroupResourceIds).toEqual([])
    expect(resetSelectableParams).toHaveBeenCalled()
  })

  it('watch getTotalTargetUserCount updates totalTargetUserCount', () => {
    const ctx = { totalTargetUserCount: 0 }
    SendTrainingSelectUsers.watch.getTotalTargetUserCount.call(ctx, 22)
    expect(ctx.totalTargetUserCount).toBe(22)
  })

  it('handleTableSelectionChange maps fallback text/value correctly', () => {
    const ctx = { formData: { targetGroupResourceIds: [] } }
    SendTrainingSelectUsers.methods.handleTableSelectionChange.call(ctx, [
      { name: 'Group Name', resourceId: 'r-1' },
      { text: 'Group Text', value: 'r-2' }
    ])
    expect(ctx.formData.targetGroupResourceIds).toEqual([
      { text: 'Group Name', value: 'r-1', extraDatas: null },
      { text: 'Group Text', value: 'r-2', extraDatas: null }
    ])
  })

  it('callForTargetGroups sets response only on initial call', async () => {
    const ctx = {
      initial: true,
      responseOfTargetGroupsItems: null,
      axiosPayloadOfTargetGroups: {}
    }
    SendTrainingSelectUsers.methods.callForTargetGroups.call(ctx)
    await Promise.resolve()
    expect(ctx.responseOfTargetGroupsItems).toBeDefined()
    expect(ctx.initial).toBe(false)

    const previousResponse = ctx.responseOfTargetGroupsItems
    searchAllTargetGroups.mockResolvedValueOnce({ data: { data: ['new'] } })
    SendTrainingSelectUsers.methods.callForTargetGroups.call(ctx)
    await Promise.resolve()
    expect(ctx.responseOfTargetGroupsItems).toBe(previousResponse)
  })

  it('handleCampaignChange updates selected campaign and resets checkboxes', () => {
    const resetCheckboxes = jest.fn()
    const ctx = {
      selectedCampaign: null,
      methodTypeId: '',
      formData: { campaignResourceId: '' },
      resetCheckboxes
    }
    SendTrainingSelectUsers.methods.handleCampaignChange.call(ctx, {
      methodTypeId: 3,
      resourceId: 'campaign-77'
    })
    expect(ctx.selectedCampaign.resourceId).toBe('campaign-77')
    expect(ctx.methodTypeId).toBe(3)
    expect(ctx.formData.campaignResourceId).toBe('campaign-77')
    expect(resetCheckboxes).toHaveBeenCalled()
  })

  it('checkboxSelectionChange clears selection error flag', () => {
    const ctx = { targetUserCheckboxSelectionError: true }
    SendTrainingSelectUsers.methods.checkboxSelectionChange.call(ctx)
    expect(ctx.targetUserCheckboxSelectionError).toBe(false)
  })
})

