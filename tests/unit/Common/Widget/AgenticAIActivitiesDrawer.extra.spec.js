import AgenticAIActivitiesDrawer from '@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue'

describe('AgenticAIActivitiesDrawer.vue (extra branch coverage)', () => {
  describe('normalizeStatus', () => {
    it('returns capitalized status when not in map and not empty', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'pending')).toBe(
        'Pending'
      )
    })

    it('returns status when empty string', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, '')).toBe('')
    })

    it('handles waitingforapproval without spaces', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'waitingforapproval')).toBe(
        'Waiting for Approval'
      )
    })
  })

  describe('getFilterFieldName', () => {
    it('maps known properties to API field names', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'firstName')).toBe('targetUserFirstName')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'email')).toBe('targetUserEmail')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'department')).toBe('targetUserDepartment')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'status')).toBe('statusName')
    })

    it('returns the property as-is when not in map', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'unknownField')).toBe('unknownField')
    })
  })

  describe('getSortFieldName', () => {
    it('maps known properties to API sort field names', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, 'firstName')).toBe('TargetUserFirstName')
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, 'contentType')).toBe('ActivityType')
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, 'startDate')).toBe('CreateTime')
    })

    it('returns CreateTime as default when property is falsy', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, '')).toBe('CreateTime')
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, null)).toBe('CreateTime')
      expect(AgenticAIActivitiesDrawer.methods.getSortFieldName.call(ctx, undefined)).toBe('CreateTime')
    })
  })

  describe('normalizeFilterItem', () => {
    it('normalizes FieldName and uses Value property', () => {
      const ctx = {
        getFilterFieldName: AgenticAIActivitiesDrawer.methods.getFilterFieldName
      }
      const result = AgenticAIActivitiesDrawer.methods.normalizeFilterItem.call(ctx, {
        FieldName: 'firstName',
        Value: 'Alice'
      })
      expect(result.FieldName).toBe('targetUserFirstName')
      expect(result.Value).toBe('Alice')
    })

    it('falls back to value (lowercase) when Value is missing', () => {
      const ctx = {
        getFilterFieldName: AgenticAIActivitiesDrawer.methods.getFilterFieldName
      }
      const result = AgenticAIActivitiesDrawer.methods.normalizeFilterItem.call(ctx, {
        FieldName: 'email',
        value: 'test@example.com'
      })
      expect(result.Value).toBe('test@example.com')
    })

    it('defaults to empty string when both Value and value are missing', () => {
      const ctx = {
        getFilterFieldName: AgenticAIActivitiesDrawer.methods.getFilterFieldName
      }
      const result = AgenticAIActivitiesDrawer.methods.normalizeFilterItem.call(ctx, {
        FieldName: 'email'
      })
      expect(result.Value).toBe('')
    })

    it('handles empty call with default parameter', () => {
      const ctx = {
        getFilterFieldName: AgenticAIActivitiesDrawer.methods.getFilterFieldName
      }
      const result = AgenticAIActivitiesDrawer.methods.normalizeFilterItem.call(ctx)
      expect(result.Value).toBe('')
    })
  })

  describe('resetPageNumber', () => {
    it('resets both axiosPayload and serverSideProps page numbers to 1', () => {
      const ctx = {
        axiosPayload: { pageNumber: 5 },
        serverSideProps: { pageNumber: 5 }
      }
      AgenticAIActivitiesDrawer.methods.resetPageNumber.call(ctx)
      expect(ctx.axiosPayload.pageNumber).toBe(1)
      expect(ctx.serverSideProps.pageNumber).toBe(1)
    })
  })

  describe('isWaitingForApproval', () => {
    it('returns true for waiting for approval status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx, { status: 'Waiting for Approval' })).toBe(true)
    })

    it('returns false for other statuses', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx, { status: 'Completed' })).toBe(false)
    })

    it('handles empty row with default parameter', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx)).toBe(false)
    })
  })

  describe('isExecuted', () => {
    it('returns true for Executed status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isExecuted.call(ctx, { status: 'Executed' })).toBe(true)
    })

    it('returns false for other statuses', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isExecuted.call(ctx, { status: 'Pending' })).toBe(false)
    })

    it('handles empty row with default parameter', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isExecuted.call(ctx)).toBe(false)
    })
  })
})
