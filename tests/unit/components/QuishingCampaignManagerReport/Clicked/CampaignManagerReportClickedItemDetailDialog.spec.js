import CampaignManagerReportClickedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import QuishingService from '@/api/quishing'
import { ACTIVITY_TYPES } from '@/components/QuishingCampaignManagerReport/Opened/utils'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailClickedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportClickedItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportClickedItemDetailDialog.name).toBe(
      'CampaignManagerReportClickedItemDetailDialog'
    )
  })

  it('computed title and subtitle are derived from row data', () => {
    const ctx = {
      item: {
        clickedCount: 4,
        firstName: 'Jane',
        lastName: 'Doe'
      }
    }
    expect(CampaignManagerReportClickedItemDetailDialog.computed.getTitle.call(ctx)).toContain(
      '4 Time(s)'
    )
    expect(CampaignManagerReportClickedItemDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'Jane Doe'
    )
  })

  it('callForData sets activityType default and maps result/pagination', async () => {
    QuishingService.searchCampaignJobUserEmailClickedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      isShowSandboxFromParent: false,
      item: { resourceId: 'u1' },
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: []
    }

    CampaignManagerReportClickedItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('dialog toggle methods cover force update and state switch', () => {
    const row = { resourceId: 'r1', activityType: 2, isChangedActivity: true }
    const ctx = {
      callForData: jest.fn(),
      selectedRow: null,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false
    }

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsActivityDialog.call(
      ctx,
      row,
      true
    )
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowSandboxActivityDialog.call(
      ctx,
      row
    )
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)
  })

  it('row action helpers and close event behave as expected', () => {
    const actionCtx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] }
    }
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionDisabledStatus.call(
        actionCtx,
        { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false }
      )
    ).toBe(true)
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionIcon.call(actionCtx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('mdi-account-cancel')
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionText.call(actionCtx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('Mark as bot activity')

    const emitCtx = { $emit: jest.fn() }
    CampaignManagerReportClickedItemDetailDialog.methods.handleClose.call(emitCtx)
    expect(emitCtx.$emit).toHaveBeenCalledWith('on-close')
  })
})
