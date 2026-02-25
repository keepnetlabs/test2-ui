import CampaignManagerReportOpenedItemDetailDialog from '@/components/QuishingCampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import QuishingService from '@/api/quishing'
import { ACTIVITY_TYPES } from '@/components/QuishingCampaignManagerReport/Opened/utils'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserEmailOpenedDetails: jest.fn()
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportOpenedItemDetailDialog.name).toBe(
      'CampaignManagerReportOpenedItemDetailDialog'
    )
  })

  it('computed title/subtitle are derived from item', () => {
    const ctx = { item: { openedCount: 3, firstName: 'John', lastName: 'Smith' } }
    expect(CampaignManagerReportOpenedItemDetailDialog.computed.getTitle.call(ctx)).toContain(
      '3 Time(s)'
    )
    expect(CampaignManagerReportOpenedItemDetailDialog.computed.getSubtitle.call(ctx)).toBe(
      'John Smith'
    )
  })

  it('callForData sets default activityType and maps table/pagination', async () => {
    QuishingService.searchCampaignJobUserEmailOpenedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ id: 1 }],
          totalNumberOfRecords: 4,
          totalNumberOfPages: 1,
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
    CampaignManagerReportOpenedItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(4)
    expect(ctx.tableData).toEqual([{ id: 1 }])
  })

  it('created updates activity column filterable items by sandbox visibility', () => {
    const col = { property: PROPERTY_STORE.ACTIVITYTYPE }
    const ctx = {
      isShowSandboxFromParent: true,
      tableOptions: { columns: [{ property: 'x' }, col] },
      serverSideProps: {},
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      callForData: jest.fn()
    }
    CampaignManagerReportOpenedItemDetailDialog.created.call(ctx)
    expect(ctx.serverSideProps.pageSize).toBe(5)
    expect(ctx.$set).toHaveBeenCalled()
    expect(ctx.tableOptions.columns[1].filterableItems).toHaveLength(2)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('mark-as toggles and row action helpers follow activity type branches', () => {
    const ctx = {
      callForData: jest.fn(),
      selectedRow: null,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      toggleShowSandboxActivityDialog:
        CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowSandboxActivityDialog,
      toggleShowMarkAsActivityDialog:
        CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsActivityDialog
    }
    const row = { resourceId: 'r1', activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true }
    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(ctx, row, true)
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)

    const helperCtx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] }
    }
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionDisabledStatus.call(
        helperCtx,
        { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false }
      )
    ).toBe(true)
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionText.call(helperCtx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('Mark as bot activity')
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    CampaignManagerReportOpenedItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
