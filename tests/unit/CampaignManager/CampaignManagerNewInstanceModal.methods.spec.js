import CampaignManagerNewInstanceModal from '@/components/CampaignManager/CampaignManagerNewInstanceModal.vue'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

describe('CampaignManagerNewInstanceModal.methods', () => {
  it('isMFAScenarioSelected handles MFA, Multiple Method, and non-MFA cases', () => {
    const mfaCtx = { selectedRow: { method: 'MFA' } }
    expect(CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call(mfaCtx)).toBe(true)

    const multipleCtx = {
      selectedRow: {
        method: 'Multiple Method',
        methodDetail: JSON.stringify([{ method: 'Click' }, { method: 'MFA' }])
      }
    }
    expect(CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call(multipleCtx)).toBe(
      true
    )

    const plainCtx = { selectedRow: { method: ACTION_STATUSES.IDLE } }
    expect(CampaignManagerNewInstanceModal.computed.isMFAScenarioSelected.call(plainCtx)).toBe(
      false
    )
  })

  it('setActionButtonDisability and setTargetGroupLoading set flags', () => {
    const ctx = { isActionButtonDisabled: false, isTargetGroupLoading: false }

    CampaignManagerNewInstanceModal.methods.setActionButtonDisability.call(ctx, true)
    CampaignManagerNewInstanceModal.methods.setTargetGroupLoading.call(ctx, true)
    expect(ctx.isActionButtonDisabled).toBe(true)
    expect(ctx.isTargetGroupLoading).toBe(true)

    CampaignManagerNewInstanceModal.methods.setActionButtonDisability.call(ctx)
    CampaignManagerNewInstanceModal.methods.setTargetGroupLoading.call(ctx)
    expect(ctx.isActionButtonDisabled).toBe(false)
    expect(ctx.isTargetGroupLoading).toBe(false)
  })

  it('handleTableSelectionChange maps resource ids and names to form values', () => {
    const ctx = { formValues: { targetGroupResourceIds: [] } }
    const items = [
      { text: 'TG1', value: 'r1' },
      { name: 'TG2', resourceId: 'r2' },
      null
    ]

    CampaignManagerNewInstanceModal.methods.handleTableSelectionChange.call(ctx, items)

    expect(ctx.formValues.targetGroupResourceIds).toEqual([
      { text: 'TG1', value: 'r1', extraDatas: null },
      { text: 'TG2', value: 'r2', extraDatas: null }
    ])
  })

  it('addDefaultTargetGroupItems skips when already selected or empty defaults', () => {
    const nextTick = jest.fn()
    const handleChange = jest.fn()
    const ctxWithSelection = {
      formValues: { targetGroupResourceIds: [{ value: 'x' }] },
      $nextTick: nextTick,
      handleTargetGroupsResourceIdsChange: handleChange
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxWithSelection, [
      { value: 'a' }
    ])
    expect(nextTick).not.toHaveBeenCalled()

    const ctxWithEmptyDefaults = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: nextTick,
      handleTargetGroupsResourceIdsChange: handleChange
    }
    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctxWithEmptyDefaults, [])
    expect(nextTick).not.toHaveBeenCalled()
  })

  it('addDefaultTargetGroupItems schedules default selection when eligible', () => {
    const handleChange = jest.fn()
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      formValues: { targetGroupResourceIds: [] },
      $nextTick: nextTick,
      handleTargetGroupsResourceIdsChange: handleChange
    }
    const defaults = [{ value: 'a' }]

    CampaignManagerNewInstanceModal.methods.addDefaultTargetGroupItems.call(ctx, defaults)

    expect(nextTick).toHaveBeenCalled()
    expect(handleChange).toHaveBeenCalledWith(defaults)
  })

  it('callForTargetGroupsUserCount sets totalTargetUserCount to 0 for empty selection', async () => {
    const ctx = {
      formValues: { targetGroupResourceIds: [] },
      totalTargetUserCount: 99
    }

    await CampaignManagerNewInstanceModal.methods.callForTargetGroupsUserCount.call(ctx)
    expect(ctx.totalTargetUserCount).toBe(0)
  })

  it('callForCalculateSendingInfo returns early when required inputs are missing', () => {
    const debounce = jest.fn()
    const ctx = {
      formValues: { targetGroupResourceIds: [] },
      totalTargetUserCount: 0,
      inputDistributionFormData: { distributionDelayEvery: 20 },
      debounce
    }

    CampaignManagerNewInstanceModal.methods.callForCalculateSendingInfo.call(ctx)
    expect(debounce).not.toHaveBeenCalled()
  })
})
