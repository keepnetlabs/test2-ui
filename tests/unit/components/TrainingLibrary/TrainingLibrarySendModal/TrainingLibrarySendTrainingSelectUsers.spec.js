import TrainingLibrarySendTrainingSelectUsers from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSelectUsers.vue'
import { searchAllTargetGroups } from '@/api/targetUsers'

jest.mock('@/api/targetUsers', () => ({
  searchAllTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

describe('TrainingLibrarySendTrainingSelectUsers.vue', () => {
  it('has correct component name', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.name).toBe('TrainingLibrarySendTrainingSelectUsers')
  })

  it('isProxy prop defaults to false', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.props.isProxy.default).toBe(false)
  })

  it('isSurvey prop defaults to false', () => {
    expect(TrainingLibrarySendTrainingSelectUsers.props.isSurvey.default).toBe(false)
  })

  it('isMultipleMethod/isMFADataSubmission/isMFAClickOnly computeds cover branches', () => {
    const multi = TrainingLibrarySendTrainingSelectUsers.computed.isMultipleMethod.call({
      selectedCampaign: { methodType: 'Multiple Method' }
    })
    const mfaDataSubmission =
      TrainingLibrarySendTrainingSelectUsers.computed.isMFADataSubmission.call({
        selectedCampaign: {
          methodType: 'MFA',
          scenarios: [{ landingPageTemplateInfo: { methodTypeId: 2 } }]
        }
      })
    const mfaClickOnly = TrainingLibrarySendTrainingSelectUsers.computed.isMFAClickOnly.call({
      selectedCampaign: {
        methodType: 'MFA',
        scenarios: [{ landingPageTemplateInfo: { methodTypeId: 1 } }]
      }
    })
    const noMatch = TrainingLibrarySendTrainingSelectUsers.computed.isMFADataSubmission.call({
      selectedCampaign: null
    })

    expect(multi).toBe(true)
    expect(mfaDataSubmission).toBe(true)
    expect(mfaClickOnly).toBe(true)
    expect(noMatch).toBe(false)
  })

  it('getTargetGroupErrorMessage switches based on selected group count', () => {
    const required = TrainingLibrarySendTrainingSelectUsers.computed.getTargetGroupErrorMessage.call({
      formData: { targetGroupResourceIds: [] },
      getTargetGroupErrorText: 'Required'
    })
    const fromText = TrainingLibrarySendTrainingSelectUsers.computed.getTargetGroupErrorMessage.call(
      {
        formData: { targetGroupResourceIds: [{ value: '1' }] },
        getTargetGroupErrorText: 'User required'
      }
    )

    expect(required.toLowerCase()).toContain('target group')
    expect(fromText).toBe('User required')
  })

  it('getErrorText prioritizes checkbox error then target user count', () => {
    const checkboxError = TrainingLibrarySendTrainingSelectUsers.computed.getErrorText.call({
      targetUserCheckboxSelectionError: true,
      getTotalTargetUserCount: 10
    })
    const noUsers = TrainingLibrarySendTrainingSelectUsers.computed.getErrorText.call({
      targetUserCheckboxSelectionError: false,
      getTotalTargetUserCount: 0
    })
    const noError = TrainingLibrarySendTrainingSelectUsers.computed.getErrorText.call({
      targetUserCheckboxSelectionError: false,
      getTotalTargetUserCount: 2
    })

    expect(checkboxError).toContain('At least one of the options')
    expect(noUsers).toContain('At least one target user')
    expect(noError).toBe('')
  })

  it('getTotalTargetUserCount sums only selected campaign stats', () => {
    const total = TrainingLibrarySendTrainingSelectUsers.computed.getTotalTargetUserCount.call({
      selectedCampaign: {
        scenarioStats: {
          openedEmail: 1,
          clickedEmail: 2,
          submittedEmail: 3,
          mfa: 4,
          attachmentOpenedEmail: 5,
          reportedEmail: 6
        }
      },
      formData: {
        userWhoOpenedEmail: true,
        userWhoClickedEmail: false,
        userWhoSubmittedData: true,
        userWhoSubmittedMFACode: true,
        userWhoDownloadedAttachment: false,
        userWhoReportedAsSuspicious: true
      }
    })

    expect(total).toBe(14)
  })

  it('resetCheckboxes clears all checkbox flags', () => {
    const ctx = {
      formData: {
        userWhoOpenedEmail: true,
        userWhoClickedEmail: true,
        userWhoSubmittedData: true,
        userWhoSubmittedMFACode: true,
        userWhoDownloadedAttachment: true,
        userWhoReportedAsSuspicious: true
      }
    }

    TrainingLibrarySendTrainingSelectUsers.methods.resetCheckboxes.call(ctx)
    expect(Object.values(ctx.formData)).not.toContain(true)
  })

  it('handleTableSelectionChange maps selected groups with text/value fallbacks', () => {
    const ctx = {
      selectedTargetGroups: [],
      formData: { targetGroupResourceIds: [] }
    }
    TrainingLibrarySendTrainingSelectUsers.methods.handleTableSelectionChange.call(ctx, [
      { text: 'Group A', value: '1' },
      { name: 'Group B', resourceId: '2' },
      null
    ])

    expect(ctx.formData.targetGroupResourceIds).toEqual([
      { text: 'Group A', value: '1', extraDatas: null },
      { text: 'Group B', value: '2', extraDatas: null }
    ])
  })

  it('handleCampaignChange stores campaign info and resets checkboxes', () => {
    const resetCheckboxes = jest.fn()
    const ctx = {
      selectedCampaign: null,
      methodTypeId: '',
      formData: { campaignResourceId: '' },
      resetCheckboxes
    }
    const item = { methodTypeId: 3, resourceId: 'camp-1' }

    TrainingLibrarySendTrainingSelectUsers.methods.handleCampaignChange.call(ctx, item)

    expect(ctx.selectedCampaign).toBe(item)
    expect(ctx.methodTypeId).toBe(3)
    expect(ctx.formData.campaignResourceId).toBe('camp-1')
    expect(resetCheckboxes).toHaveBeenCalled()
  })

  it('checkboxSelectionChange clears selection error', () => {
    const ctx = { targetUserCheckboxSelectionError: true }
    TrainingLibrarySendTrainingSelectUsers.methods.checkboxSelectionChange.call(ctx)
    expect(ctx.targetUserCheckboxSelectionError).toBe(false)
  })

  it('selectedRadioGroupIndex watcher resets campaign selection when switching to groups', () => {
    const resetCheckboxes = jest.fn()
    const ctx = {
      resetCheckboxes,
      totalTargetUserCount: 10,
      methodTypeId: '2',
      selectedCampaign: { id: 'x' },
      formData: { campaignResourceId: 'camp-1', targetGroupResourceIds: [{ value: '1' }] },
      $refs: {}
    }

    TrainingLibrarySendTrainingSelectUsers.watch.selectedRadioGroupIndex.call(ctx, 0)

    expect(resetCheckboxes).toHaveBeenCalled()
    expect(ctx.totalTargetUserCount).toBe(0)
    expect(ctx.formData.campaignResourceId).toBe('')
    expect(ctx.methodTypeId).toBe('')
    expect(ctx.selectedCampaign).toBe(null)
  })

  it('selectedRadioGroupIndex watcher clears groups and resets table when switching to campaign', () => {
    const resetSelectableParams = jest.fn()
    const ctx = {
      formData: { targetGroupResourceIds: [{ value: '1' }] },
      $refs: {
        refTargetGroups: {
          $refs: { refGroupTable: { $refs: { refTable: { resetSelectableParams } } } }
        }
      }
    }

    TrainingLibrarySendTrainingSelectUsers.watch.selectedRadioGroupIndex.call(ctx, 1)

    expect(ctx.formData.targetGroupResourceIds).toEqual([])
    expect(resetSelectableParams).toHaveBeenCalled()
  })

  it('getTotalTargetUserCount watcher updates totalTargetUserCount', () => {
    const ctx = { totalTargetUserCount: 0 }
    TrainingLibrarySendTrainingSelectUsers.watch.getTotalTargetUserCount.call(ctx, 9)
    expect(ctx.totalTargetUserCount).toBe(9)
  })

  it('callForTargetGroups sets response only on initial fetch and flips initial flag', async () => {
    searchAllTargetGroups.mockResolvedValueOnce({ data: { data: [{ id: 1 }] } })
    const ctx = {
      initial: true,
      axiosPayloadOfTargetGroups: {},
      responseOfTargetGroupsItems: null
    }

    TrainingLibrarySendTrainingSelectUsers.methods.callForTargetGroups.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(searchAllTargetGroups).toHaveBeenCalled()
    expect(ctx.responseOfTargetGroupsItems).toEqual({ data: { data: [{ id: 1 }] } })
    expect(ctx.initial).toBe(false)
  })
})
