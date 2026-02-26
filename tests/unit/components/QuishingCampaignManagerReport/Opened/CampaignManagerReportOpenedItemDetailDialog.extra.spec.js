import CampaignManagerReportOpenedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import { ACTIVITY_TYPES } from '@/components/QuishingCampaignManagerReport/Opened/utils'

describe('CampaignManagerReportOpenedItemDetailDialog.vue (extra)', () => {
  it('created keeps filters unchanged when activity column is missing', () => {
    const ctx = {
      isShowSandboxFromParent: false,
      tableOptions: { columns: [{ property: 'dateOpened' }] },
      serverSideProps: {},
      $set: jest.fn(),
      callForData: jest.fn()
    }

    CampaignManagerReportOpenedItemDetailDialog.created.call(ctx)

    expect(ctx.serverSideProps.pageSize).toBe(5)
    expect(ctx.$set).not.toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('toggleShowMarkAsDialog falls back to human dialog branch', () => {
    const ctx = {
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      selectedRow: null,
      callForData: jest.fn(),
      toggleShowMarkAsActivityDialog:
        CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsActivityDialog,
      toggleShowSandboxActivityDialog:
        CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowSandboxActivityDialog
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { activityType: ACTIVITY_TYPES.BOT, isChangedActivity: false },
      false
    )

    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(false)
    expect(ctx.callForData).not.toHaveBeenCalled()
  })

  it('toggle sandbox/human dialogs call refresh only when forceUpdate=true', () => {
    const ctx = {
      callForData: jest.fn(),
      selectedRow: null,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowSandboxActivityDialog.call(
      ctx,
      { id: 's1' },
      true
    )
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsActivityDialog.call(
      ctx,
      { id: 'h1' },
      false
    )
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)
  })

  it('row action helpers return default icon/text for non-human changed rows', () => {
    const ctx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] }
    }
    const row = { activityType: ACTIVITY_TYPES.BOT, isChangedActivity: false }

    expect(CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionIcon.call(ctx, row)).toBe(
      'mdi-account-check'
    )
    expect(CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionText.call(ctx, row)).toBe(
      'Mark as human activity'
    )
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionDisabledStatus.call(ctx, row)
    ).toBe(false)
  })
})
