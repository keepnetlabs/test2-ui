import CampaignManagerReportClickedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import { ACTIVITY_TYPES } from '@/components/QuishingCampaignManagerReport/Opened/utils'

describe('CampaignManagerReportClickedItemDetailDialog.vue (extra)', () => {
  it('data() printout branch has no row actions and no add button', () => {
    const data = CampaignManagerReportClickedItemDetailDialog.data.call({
      getQuishingTypePrintOut: () => true,
      isShowSandboxFromParent: false
    })

    expect(data.isQuishingTypePrintout).toBe(true)
    expect(data.tableOptions.rowActions).toEqual([])
    expect(data.tableOptions.addButton).toEqual({ show: false })
    expect(data.tableOptions.columns.some((c) => c.property === 'activityType')).toBe(false)
  })

  it('toggleShowMarkAsDialog routes to sandbox dialog for changed human activity', () => {
    const ctx = {
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      selectedRow: null,
      callForData: jest.fn(),
      toggleShowMarkAsActivityDialog:
        CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsActivityDialog,
      toggleShowSandboxActivityDialog:
        CampaignManagerReportClickedItemDetailDialog.methods.toggleShowSandboxActivityDialog
    }

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true },
      false
    )

    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(false)
  })

  it('row action helpers return default icon/text for non-human changed rows', () => {
    const ctx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] }
    }
    const row = { activityType: ACTIVITY_TYPES.SYSTEM, isChangedActivity: false }

    expect(CampaignManagerReportClickedItemDetailDialog.methods.getRowActionIcon.call(ctx, row)).toBe(
      'mdi-account-check'
    )
    expect(CampaignManagerReportClickedItemDetailDialog.methods.getRowActionText.call(ctx, row)).toBe(
      'Mark as human activity'
    )
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionDisabledStatus.call(ctx, row)
    ).toBe(false)
  })
})
