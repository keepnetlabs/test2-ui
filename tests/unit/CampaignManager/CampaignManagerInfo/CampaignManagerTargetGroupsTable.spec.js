import CampaignManagerTargetGroupsTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupsTable.vue'

// Helpers
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => ['filter1']),
  columnFilterCleared: jest.fn(() => [])
}))

jest.mock('@/api/targetUsers', () => ({
  searchAllTargetGroups: jest.fn().mockResolvedValue({}),
  searchTargetGroups: jest.fn().mockResolvedValue({})
}))

jest.mock('@/api/callback', () => ({
  getTargetGroupsForCurrentCompany: jest.fn().mockResolvedValue({})
}))


describe('CampaignManagerTargetGroupsTable.vue', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      $emit: jest.fn(),
      $nextTick: jest.fn((cb) => cb()),
      setLoading: jest.fn(),
      callForData: jest.fn(),
      setDefaultResponseParams: jest.fn(),
      resetPageNumber: jest.fn(),
      axiosPayload: {
        filter: { FilterGroups: [ { FilterItems: [] }, { FilterItems: [] } ] }
      },
      serverSideProps: {
        pageNumber: 1
      },
      defaultServerSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 1,
        pageNumber: 1,
        results: []
      },
      tableData: [],
      highlightedRow: {},
      $refs: {
        refTable: {
          isColumnFilterActive: false,
          getSelectedObjectAndSelectRowsByRowKey: jest.fn()
        }
      },
      CONSTANTS: { ascending: 'ascending' }
    }
    jest.clearAllMocks()
  })

  describe('data()', () => {
    it('initializes layout properly with company column', () => {
      const cmpData = CampaignManagerTargetGroupsTable.data.call({ isShowCompanyColumn: true })
      expect(cmpData.tableOptions.columns.length).toBe(4) // 3 base + 1 company
      expect(cmpData.tableOptions.columns[1].property).toBe('companyName')
    })
    
    it('initializes layout properly without company column', () => {
      const cmpData = CampaignManagerTargetGroupsTable.data.call({ isShowCompanyColumn: false })
      expect(cmpData.tableOptions.columns.length).toBe(3) // 3 base only
      expect(cmpData.tableOptions.columns[0].property).toBe('name')
    })
  })

  describe('watchers', () => {
    it('highlightedRow emits highlighted-row-change format consistently', () => {
      CampaignManagerTargetGroupsTable.watch.highlightedRow.call(ctx, { row: 1 })
      expect(ctx.$emit).toHaveBeenCalledWith('on-highlighted-row-change', { row: 1 })
    })

    it('responseOfTargetGroupsItems calls setDefaultResponseParams', () => {
      CampaignManagerTargetGroupsTable.watch.responseOfTargetGroupsItems.call(ctx, 'resp')
      expect(ctx.setDefaultResponseParams).toHaveBeenCalledWith('resp')
    })
  })

  describe('created hook', () => {
    it('calls callForData if isCallApiWhenCreated is true', () => {
      ctx.isCallApiWhenCreated = true
      CampaignManagerTargetGroupsTable.created.call(ctx)
      expect(ctx.callForData).toHaveBeenCalled()
    })
    
    it('skips callForData if isCallApiWhenCreated is false', () => {
      ctx.isCallApiWhenCreated = false
      CampaignManagerTargetGroupsTable.created.call(ctx)
      expect(ctx.callForData).not.toHaveBeenCalled()
    })
  })

  describe('methods - callForData branching', () => {
    const { searchAllTargetGroups, searchTargetGroups } = require('@/api/targetUsers')
    const CallbackService = require('@/api/callback')

    beforeEach(() => {
      ctx.callForData = CampaignManagerTargetGroupsTable.methods.callForData
      ctx.defaultSelectedTargetGroupResourceIds = []
    })

    it('uses CallbackService API when isCallback is true', async () => {
      ctx.isCallback = true
      CallbackService.getTargetGroupsForCurrentCompany.mockResolvedValueOnce('resp')
      
      await ctx.callForData.call(ctx)
      
      expect(ctx.setLoading).toHaveBeenCalledWith(true)
      expect(CallbackService.getTargetGroupsForCurrentCompany).toHaveBeenCalled()
      expect(ctx.setDefaultResponseParams).toHaveBeenCalledWith('resp')
    })

    it('uses searchAllTargetGroups when isAllGroups is true', async () => {
      ctx.isAllGroups = true
      searchAllTargetGroups.mockResolvedValueOnce('respAll')
      
      await ctx.callForData.call(ctx)
      
      expect(searchAllTargetGroups).toHaveBeenCalled()
      expect(ctx.setDefaultResponseParams).toHaveBeenCalledWith('respAll')
    })

    it('uses searchTargetGroups when both isCallback and isAllGroups are false', async () => {
      searchTargetGroups.mockResolvedValueOnce('respNormal')
      ctx.defaultSelectedTargetGroupResourceIds = ['a', 'b']
      
      await ctx.callForData.call(ctx)
      
      expect(ctx.axiosPayload.selectTargetUserResourceIds).toBe('a,b')
      expect(searchTargetGroups).toHaveBeenCalledWith(ctx.axiosPayload, true)
      expect(ctx.setDefaultResponseParams).toHaveBeenCalledWith('respNormal')
    })
  })

  describe('methods - setDefaultResponseParams fallback and array management branching', () => {
    beforeEach(() => {
      ctx.setDefaultResponseParams = CampaignManagerTargetGroupsTable.methods.setDefaultResponseParams
    })

    it('sets highlighted row and hides empty stat block when results are returned', () => {
      const fakeResponse = { data: { data: { totalNumberOfRecords: 1, results: [{ id: 1 }] } } }
      ctx.setDefaultResponseParams.call(ctx, fakeResponse)

      expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
      expect(ctx.tableData.length).toBe(1)
      expect(ctx.highlightedRow).toEqual({ id: 1 })
      expect(ctx.$emit).toHaveBeenCalledWith('update:empty', false)
    })

    it('manages empty result fallbacks perfectly', () => {
      ctx.setDefaultResponseParams.call(ctx, null)

      expect(ctx.tableData.length).toBe(0)
      expect(ctx.highlightedRow).toEqual({})
      expect(ctx.$emit).toHaveBeenCalledWith('update:empty', true)
      expect(ctx.setLoading).toHaveBeenCalledWith(false)
    })
  })

  describe('methods - smaller methods', () => {
    it('setLoading mutates is-loading update boolean via explicit event payload mapping', () => {
      CampaignManagerTargetGroupsTable.methods.setLoading.call(ctx, true)
      expect(ctx.$emit).toHaveBeenCalledWith('update:is-loading', true)
    })

    it('columnFilterChanged delegates to util functions', () => {
      CampaignManagerTargetGroupsTable.methods.columnFilterChanged.call(ctx, 'a')
      expect(columnFilterChanged).toHaveBeenCalledWith('a', ctx.axiosPayload)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('columnFilterCleared delegates to util functions', () => {
      CampaignManagerTargetGroupsTable.methods.columnFilterCleared.call(ctx, 'b')
      expect(columnFilterCleared).toHaveBeenCalledWith('b', ctx.axiosPayload)
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('searchChangedFilter inserts object correctly within array boundaries', () => {
      CampaignManagerTargetGroupsTable.methods.searchChangedFilter.call(ctx, ['foo'])
      expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual(['foo'])
      expect(ctx.callForData).toHaveBeenCalled()
    })

    it('serverSide methods manage page logic safely', () => {
      CampaignManagerTargetGroupsTable.methods.serverSidePageNumberChanged.call(ctx, 3)
      expect(ctx.axiosPayload.pageNumber).toBe(3)

      CampaignManagerTargetGroupsTable.methods.serverSideSizeChanged.call(ctx, 100)
      expect(ctx.axiosPayload.pageSize).toBe(100)
      expect(ctx.resetPageNumber).toHaveBeenCalled()
    })

    it('sortChanged maps ascending bool from CONSTANTS comparison correctly', () => {
      CampaignManagerTargetGroupsTable.methods.sortChanged.call(ctx, { order: 'ascending', prop: 'id' })
      expect(ctx.axiosPayload.ascending).toBe(true)
      expect(ctx.axiosPayload.orderBy).toBe('id')

      CampaignManagerTargetGroupsTable.methods.sortChanged.call(ctx, { order: 'descending', prop: 'name' })
      expect(ctx.axiosPayload.ascending).toBe(false)
    })

    it('handleRowClick assigns param seamlessly', () => {
      CampaignManagerTargetGroupsTable.methods.handleRowClick.call(ctx, 'row')
      expect(ctx.highlightedRow).toBe('row')
    })
  })
})
