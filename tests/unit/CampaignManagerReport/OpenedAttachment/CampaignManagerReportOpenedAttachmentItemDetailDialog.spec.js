jest.mock('@/api/phishingsimulator', () => ({
  searchCampaignJobUserAttachmentOpenedDetaiils: jest.fn()
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'OpenedTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    }))
  }
})

import CampaignManagerReportOpenedAttachmentItemDetailDialog from '@/components/CampaignManagerReport/OpenedAttachment/CampaignManagerReportOpenedAttachmentItemDetailDialog.vue'
import { searchCampaignJobUserAttachmentOpenedDetaiils } from '@/api/phishingsimulator'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportOpenedAttachmentItemDetailDialog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title/subtitle correctly', () => {
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getTitle.call({
        item: { attachmentOpenedCount: 5 }
      })
    ).toBe('Opened Attachment 5 Time(s)')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getTitle.call({
        item: {}
      })
    ).toBe('Opened Attachment 0 Time(s)')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.computed.getSubtitle.call({
        item: { firstName: 'A', lastName: 'B' }
      })
    ).toBe('A B')
  })

  it('created sets page size, filter options and triggers fetch', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const activityCol = { property: 'activityType' }
    const ctx = {
      serverSideProps: { pageSize: 0 },
      tableOptions: { columns: [activityCol] },
      isShowSandboxFromParent: false,
      $set: set,
      callForData: jest.fn()
    }
    CampaignManagerReportOpenedAttachmentItemDetailDialog.created.call(ctx)

    expect(ctx.serverSideProps.pageSize).toBe(5)
    expect(set).toHaveBeenCalledWith(activityCol, 'filterableItems', [
      { text: 'Human Activity', value: '0' }
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('callForData sets default activityType and maps response', async () => {
    searchCampaignJobUserAttachmentOpenedDetaiils.mockResolvedValue({
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
      isShowSandboxFromParent: true,
      item: { resourceId: 'row-1' },
      axiosPayload: {},
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 },
      tableData: [],
      setLoading: jest.fn()
    }

    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(searchCampaignJobUserAttachmentOpenedDetaiils).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'row-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData).toEqual([{ resourceId: 'r1' }])
  })

  it('toggle dialog methods and routing behavior work', () => {
    const ctx = {
      selectedRow: null,
      isShowMarkAsHumanActivityDialog: false,
      isShowMarkAsSandboxActivityDialog: false,
      callForData: jest.fn()
    }
    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.toggleShowMarkAsActivityDialog.call(
      ctx,
      { resourceId: 'h' },
      true
    )
    expect(ctx.callForData).toHaveBeenCalled()
    expect(ctx.isShowMarkAsHumanActivityDialog).toBe(true)

    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.toggleShowSandboxActivityDialog.call(
      ctx,
      { resourceId: 'b' },
      false
    )
    expect(ctx.isShowMarkAsSandboxActivityDialog).toBe(true)

    const routeCtx = {
      toggleShowSandboxActivityDialog: jest.fn(),
      toggleShowMarkAsActivityDialog: jest.fn()
    }
    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      routeCtx,
      { isChangedActivity: true, activityType: ACTIVITY_TYPES.HUMAN },
      true
    )
    expect(routeCtx.toggleShowSandboxActivityDialog).toHaveBeenCalled()
    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.toggleShowMarkAsDialog.call(
      routeCtx,
      { isChangedActivity: false, activityType: ACTIVITY_TYPES.HUMAN },
      false
    )
    expect(routeCtx.toggleShowMarkAsActivityDialog).toHaveBeenCalled()
  })

  it('row action helpers and close emit cover branches', () => {
    const ctx = {
      tableOptions: { rowActions: [{ icon: 'mdi-account-check', name: 'Mark as human activity' }] },
      $emit: jest.fn()
    }
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: false
      })
    ).toBe(true)
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.getRowActionDisabledStatus({
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe(false)
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.getRowActionIcon.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('mdi-account-cancel')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: true
      })
    ).toBe('Mark as bot activity')
    expect(
      CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.getRowActionText.call(ctx, {
        activityType: ACTIVITY_TYPES.BOT,
        isChangedActivity: false
      })
    ).toBe('Mark as human activity')

    CampaignManagerReportOpenedAttachmentItemDetailDialog.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})
