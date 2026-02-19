jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'groupName', Value: 'x' }]),
  columnFilterCleared: jest.fn(() => [])
}))

import TrainingReportSummaryAudienceDetails from '@/components/AwarenessEducator/TrainingReport/Summary/TrainingReportSummaryAudienceDetails.vue'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

describe('TrainingReportSummaryAudienceDetails.vue', () => {
  const { computed, methods } = TrainingReportSummaryAudienceDetails

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes modal metadata and campaign fallbacks', () => {
    expect(computed.getTitle.call({})).toBe('Audience Details')
    expect(computed.getSubtitle.call({ type: 'userGroups' })).toBe('By User Groups')
    expect(computed.getSubtitle.call({ type: 'phishingCampaign' })).toBe('By Campaign')
    expect(computed.getModalSize.call({ type: 'userGroups' })).toBe('1000')
    expect(computed.getModalSize.call({ type: 'phishingCampaign' })).toBe('480')
    expect(computed.isFromUserGroups.call({ type: 'userGroups' })).toBe(true)
    expect(computed.isFromPhishingCampaign.call({ type: 'phishingCampaign' })).toBe(true)

    expect(computed.getCampaignName.call({ phishingCampaign: {} })).toBe('Campaign Name')
    expect(computed.getCampaignDescription.call({ phishingCampaign: {} })).toBe('')
    expect(computed.getCriteria.call({ phishingCampaign: {} })).toEqual([
      'Clicked',
      'Submitted Data',
      'Reported',
      'Opened Email'
    ])
  })

  it('column filter handlers update payload and trigger refresh', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      callForData
    }

    methods.columnFilterChanged.call(ctx, { FieldName: 'groupName', Value: 'x' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'groupName', Value: 'x' }
    ])

    methods.columnFilterCleared.call(ctx, 'groupName')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(callForData).toHaveBeenCalledTimes(2)
  })

  it('pagination and sorting methods update payload and refresh', () => {
    const callForData = jest.fn()
    const resetPageNumber = methods.resetPageNumber
    const ctx = {
      CONSTANTS: { ascending: 'ascending' },
      axiosPayload: { pageNumber: 3, pageSize: 10, ascending: false, orderBy: 'groupName' },
      serverSideProps: { pageNumber: 3, pageSize: 10 },
      callForData,
      resetPageNumber
    }

    methods.serverSidePageNumberChanged.call(ctx, 2)
    expect(ctx.axiosPayload.pageNumber).toBe(2)

    methods.serverSideSizeChanged.call(ctx, 25)
    expect(ctx.axiosPayload.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)

    methods.sortChanged.call(ctx, { order: 'ascending', prop: 'userCount' })
    expect(ctx.axiosPayload.ascending).toBe(true)
    expect(ctx.axiosPayload.orderBy).toBe('userCount')
    expect(callForData).toHaveBeenCalledTimes(3)
  })

  it('handleSearchChange keeps searchable columns and refreshes', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      tableOptions: {
        columns: [
          { property: 'groupName', filterableType: 'text' },
          { property: 'dateCreated', filterableType: 'date' }
        ]
      },
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForData
    }

    methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'groupName', Value: 'sales' },
              { FieldName: 'unknown', Value: 'x' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'groupName', Value: 'sales' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('close and view-report actions emit/redirect correctly', () => {
    const emit = jest.fn()
    methods.handleClose.call({ $emit: emit })
    expect(emit).toHaveBeenCalledWith('close')

    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    const ctx = {
      phishingCampaign: { resourceId: 'camp-1' },
      $router: {
        resolve: jest.fn(() => ({ href: '/reports/campaign-reports/campaign-report/camp-1' }))
      }
    }

    methods.handleViewReportClick.call(ctx)

    expect(ctx.$router.resolve).toHaveBeenCalledWith(
      '/reports/campaign-reports/campaign-report/camp-1'
    )
    expect(openSpy).toHaveBeenCalledWith('/reports/campaign-reports/campaign-report/camp-1', '_blank')
    openSpy.mockRestore()
  })
})
