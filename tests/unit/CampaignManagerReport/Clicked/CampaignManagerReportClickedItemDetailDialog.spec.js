jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailClickedDetails: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 5,
      orderBy: 'ClickedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportClickedItemDetailDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClickedItemDetailDialog.vue'
import { searchCampaignJobUserEmailClickedDetails } from '@/api/phishingsimulator'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportClickedItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title/subtitle handle defaults', () => {
    expect(
      CampaignManagerReportClickedItemDetailDialog.computed.getTitle.call({
        item: { clickedCount: 4 }
      })
    ).toBe('Clicked Link 4 Time(s)')
    expect(
      CampaignManagerReportClickedItemDetailDialog.computed.getTitle.call({
        item: {}
      })
    ).toBe('Clicked Link 0 Time(s)')
    expect(
      CampaignManagerReportClickedItemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'Jane', lastName: 'Doe' }
      })
    ).toBe('Jane Doe')
  })

  it('created hook sets pageSize and calls callForData', () => {
    const ctx = {
      serverSideProps: { pageSize: 0 },
      callForData: jest.fn()
    }
    CampaignManagerReportClickedItemDetailDialog.created.call(ctx)
    expect(ctx.serverSideProps.pageSize).toBe(5)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData fetches detail rows and sets paging values', async () => {
    searchCampaignJobUserEmailClickedDetails.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: 'r1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      isShowSandboxFromParent: false,
      item: { resourceId: 'user-1' },
      axiosPayload: { filter: {} },
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportClickedItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(searchCampaignJobUserEmailClickedDetails).toHaveBeenCalledWith(ctx.axiosPayload, 'user-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1' }])
  })

  it('callForData sets sandbox activityType when parent sandbox is true', async () => {
    searchCampaignJobUserEmailClickedDetails.mockResolvedValue({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      isShowSandboxFromParent: true,
      item: { resourceId: 'user-2' },
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }
    CampaignManagerReportClickedItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.axiosPayload.activityType).toBe(2)
  })

  it('dialog toggles and close emit work', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      selectedRow: null,
      isShowMarkAsSandboxActivityDialog: false,
      isShowMarkAsHumanActivityDialog: false,
      callForData: jest.fn()
    }

    CampaignManagerReportClickedItemDetailDialog.methods.handleClose.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowSandboxActivityDialog.call(
      ctx,
      { resourceId: 'x' }
    )
    expect(ctx.selectedRow).toEqual({ resourceId: 'x' })
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsActivityDialog.call(
      ctx,
      { resourceId: 'y' },
      true
    )
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.selectedRow).toEqual({ resourceId: 'y' })
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)
  })

  it('toggleShowMarkAsDialog routes to correct dialog by row status', () => {
    const toggleSandbox = jest.fn()
    const toggleHuman = jest.fn()
    const ctx = {
      toggleShowSandboxActivityDialog: toggleSandbox,
      toggleShowMarkAsActivityDialog: toggleHuman
    }

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: true, activityType: ACTIVITY_TYPES.HUMAN },
      true
    )
    expect(toggleSandbox).toHaveBeenCalled()

    CampaignManagerReportClickedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: false, activityType: ACTIVITY_TYPES.HUMAN },
      false
    )
    expect(toggleHuman).toHaveBeenCalled()
  })

  it('row action text/icon/disabled helpers cover branches', () => {
    const ctx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] }
    }
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: false
      })
    ).toBe(true)
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe(false)
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionIcon.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('mdi-account-cancel')
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('Mark as bot activity')
    expect(
      CampaignManagerReportClickedItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe('Mark as human activity')
  })
})
