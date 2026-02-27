import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups.vue'

describe('CampaignManagerTargetGroups.vue', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      search: '',
      highlightedRow: {},
      debounce: jest.fn((cb) => cb()), // directly execute callback to bypass timers
      $refs: {
        refGroupTable: {
          searchChangedFilter: jest.fn()
        }
      }
    }
  })

  describe('watch', () => {
    it('search watcher calls debounce and triggers searchChangedFilter with correct payload', () => {
      // simulate search change
      CampaignManagerTargetGroups.watch.search.call(ctx, 'test-query')
      
      expect(ctx.debounce).toHaveBeenCalled()
      expect(ctx.$refs.refGroupTable.searchChangedFilter).toHaveBeenCalledWith(
        [
          { FieldName: 'Name', Operator: 'Contains', Value: 'test-query' },
          { FieldName: 'Priority', Operator: 'Contains', Value: 'test-query' },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: 'test-query' },
          { FieldName: 'CompanyName', Operator: 'Contains', Value: 'test-query' }
        ],
        'test-query'
      )
    })
  })

  describe('methods', () => {
    it('handleHiglightedRowChange sets the highlightedRow variable', () => {
      const rowData = { resourceId: '123', name: 'row name' }
      CampaignManagerTargetGroups.methods.handleHiglightedRowChange.call(ctx, rowData)
      
      expect(ctx.highlightedRow).toEqual(rowData)
    })
  })
})
