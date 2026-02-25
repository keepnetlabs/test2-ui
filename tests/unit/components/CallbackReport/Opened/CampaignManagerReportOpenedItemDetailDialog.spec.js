import CallbackService from '@/api/callback'
import CampaignManagerReportOpenedItemDetailDialog from '@/components/CallbackReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

jest.mock('@/api/callback', () => ({
  getEmailOpenedUserDetails: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('CampaignManagerReportOpenedItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title and subtitle reflect selected item', () => {
    const ctx = { item: { openedCount: 3, firstName: 'Ada', lastName: 'Lovelace' } }

    expect(CampaignManagerReportOpenedItemDetailDialog.computed.getTitle.call(ctx)).toBe(
      'Opened Email 3 Time(s)'
    )
    expect(CampaignManagerReportOpenedItemDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'Ada Lovelace'
    )
  })

  it('callForData sets default activityType based on parent sandbox flag', async () => {
    CallbackService.getEmailOpenedUserDetails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      item: { resourceId: 'mail-1' },
      isShowSandboxFromParent: true,
      axiosPayload: {},
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await CampaignManagerReportOpenedItemDetailDialog.methods.callForData.call(ctx)

    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(CallbackService.getEmailOpenedUserDetails).toHaveBeenCalledWith(
      'mail-1',
      expect.objectContaining({ activityType: 2 })
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('toggleShowMarkAsDialog branches by activity type and change status', () => {
    const ctx = {
      toggleShowSandboxActivityDialog: jest.fn(),
      toggleShowMarkAsActivityDialog: jest.fn()
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: true, activityType: ACTIVITY_TYPES.HUMAN },
      true
    )
    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: false, activityType: ACTIVITY_TYPES.HUMAN },
      false
    )

    expect(ctx.toggleShowSandboxActivityDialog).toHaveBeenCalledTimes(1)
    expect(ctx.toggleShowMarkAsActivityDialog).toHaveBeenCalledTimes(1)
  })

  it('row action helpers return expected values', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Mark as human activity', icon: 'mdi-account-check' }] }
    }
    const changedHuman = { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true }
    const unchangedHuman = { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false }

    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionDisabledStatus(unchangedHuman)
    ).toBe(true)
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionIcon.call(ctx, changedHuman)
    ).toBe('mdi-account-cancel')
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionText.call(ctx, changedHuman)
    ).toBe('Mark as bot activity')
  })

  it('handleClose emits close event', () => {
    const ctx = { $emit: jest.fn() }

    CampaignManagerReportOpenedItemDetailDialog.methods.handleClose.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
