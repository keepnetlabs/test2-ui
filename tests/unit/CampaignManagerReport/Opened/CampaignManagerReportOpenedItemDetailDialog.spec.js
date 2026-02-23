jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserEmailOpenedDetails: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 5,
      orderBy: 'OpenedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportOpenedItemDetailDialog from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpenedItemDetailDialog.vue'
import { searchCampaignJobUserEmailOpenedDetails } from '@/api/phishingsimulator'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed title/subtitle handle values and fallbacks', () => {
    expect(
      CampaignManagerReportOpenedItemDetailDialog.computed.getTitle.call({
        item: { openedCount: 2 }
      })
    ).toBe('Opened Email 2 Time(s)')
    expect(
      CampaignManagerReportOpenedItemDetailDialog.computed.getTitle.call({ item: {} })
    ).toBe('Opened Email 0 Time(s)')
    expect(
      CampaignManagerReportOpenedItemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'John', lastName: 'Doe' }
      })
    ).toBe('John Doe')
  })

  it('created sets page size, activity filter options and triggers data fetch', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const activityCol = { property: 'activityType' }
    const ctx = {
      serverSideProps: { pageSize: 0 },
      tableOptions: { columns: [activityCol] },
      isShowSandboxFromParent: true,
      $set: set,
      callForData: jest.fn()
    }

    CampaignManagerReportOpenedItemDetailDialog.created.call(ctx)
    expect(ctx.serverSideProps.pageSize).toBe(5)
    expect(set).toHaveBeenCalledWith(
      activityCol,
      'filterableItems',
      expect.arrayContaining([{ text: 'Human Activity', value: '0' }, { text: 'Bot Activity', value: '1' }])
    )
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData maps response and sets default activityType', async () => {
    searchCampaignJobUserEmailOpenedDetails.mockResolvedValue({
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
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(0)
    expect(searchCampaignJobUserEmailOpenedDetails).toHaveBeenCalledWith(ctx.axiosPayload, 'user-1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1' }])
  })

  it('toggle methods open related dialogs and optionally refresh', () => {
    const ctx = {
      selectedRow: null,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      callForData: jest.fn()
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsActivityDialog.call(
      ctx,
      { resourceId: 'a' },
      true
    )
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.selectedRow).toEqual({ resourceId: 'a' })
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowSandboxActivityDialog.call(
      ctx,
      { resourceId: 'b' },
      false
    )
    expect(ctx.selectedRow).toEqual({ resourceId: 'b' })
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)
  })

  it('toggleShowMarkAsDialog routes based on activity state', () => {
    const toggleSandbox = jest.fn()
    const toggleHuman = jest.fn()
    const ctx = {
      toggleShowSandboxActivityDialog: toggleSandbox,
      toggleShowMarkAsActivityDialog: toggleHuman
    }

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: true, activityType: ACTIVITY_TYPES.HUMAN },
      true
    )
    expect(toggleSandbox).toHaveBeenCalled()

    CampaignManagerReportOpenedItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      ctx,
      { isChangedActivity: false, activityType: ACTIVITY_TYPES.HUMAN },
      false
    )
    expect(toggleHuman).toHaveBeenCalled()
  })

  it('row action helpers and close emit cover branches', () => {
    const ctx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] },
      $emit: jest.fn()
    }

    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: false
      })
    ).toBe(true)
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe(false)
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionIcon.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('mdi-account-cancel')
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('Mark as bot activity')
    expect(
      CampaignManagerReportOpenedItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe('Mark as human activity')

    CampaignManagerReportOpenedItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
