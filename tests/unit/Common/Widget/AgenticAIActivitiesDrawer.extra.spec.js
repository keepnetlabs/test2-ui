import AgenticAIActivitiesDrawer from '@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue'

describe('AgenticAIActivitiesDrawer.vue (extra branch coverage)', () => {
  describe('formatActivityTypeDisplay', () => {
    it('removes Simulation suffix for phishing and quishing labels', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.formatActivityTypeDisplay.call(ctx, 'Phishing Simulation')).toBe('Phishing')
      expect(AgenticAIActivitiesDrawer.methods.formatActivityTypeDisplay.call(ctx, 'Quishing Simulation')).toBe('Quishing')
    })

    it('keeps training label unchanged', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.formatActivityTypeDisplay.call(ctx, 'Training')).toBe('Training')
    })
  })

  describe('normalizeStatus', () => {
    it('maps pending to Pending', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'pending')).toBe('Pending')
    })

    it('maps waiting for approval to Pending', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'waiting for approval')).toBe('Pending')
    })

    it('maps waitingforapproval to Pending', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'waitingforapproval')).toBe('Pending')
    })

    it('maps executed to Approved', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'executed')).toBe('Approved')
    })

    it('maps rejected to Declined', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'rejected')).toBe('Declined')
    })

    it('returns status when empty string', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, '')).toBe('')
    })

    it('capitalizes unknown status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'custom status')).toBe('Custom Status')
    })
  })

  describe('getFilterFieldName', () => {
    it('maps known properties to API field names', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'firstName')).toBe('targetUserFirstName')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'email')).toBe('targetUserEmail')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'department')).toBe('targetUserDepartment')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'contentType')).toBe('ActivityType')
      expect(AgenticAIActivitiesDrawer.methods.getFilterFieldName.call(ctx, 'status')).toBe('Status')
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
    it('returns true for pending status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx, { status: 'Pending' })).toBe(true)
    })

    it('returns true for waiting for approval status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx, { status: 'Waiting for Approval' })).toBe(true)
    })

    it('returns false for other statuses', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx, { status: 'Approved' })).toBe(false)
    })

    it('handles empty row with default parameter', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isWaitingForApproval.call(ctx)).toBe(false)
    })
  })

  describe('isExecuted', () => {
    it('returns true for Approved status', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isExecuted.call(ctx, { status: 'Approved' })).toBe(true)
    })

    it('returns true for executed status (lowercase)', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isExecuted.call(ctx, { status: 'executed' })).toBe(true)
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

  describe('formatBatchDate', () => {
    it('returns the date string unchanged', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.formatBatchDate.call(ctx, '03/25/2026 07:49')).toBe('03/25/2026 07:49')
    })

    it('returns empty string for falsy input', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.formatBatchDate.call(ctx, '')).toBe('')
      expect(AgenticAIActivitiesDrawer.methods.formatBatchDate.call(ctx)).toBe('')
    })
  })

  describe('getBatchSegmentWidth', () => {
    it('returns 0% when total is 0', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctx, {}, 'approved')).toBe('0%')
    })

    it('calculates correct percentage for approved', () => {
      const ctx = {}
      const batch = { userCount: 10, statusCounts: { Approved: 5 } }
      expect(AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctx, batch, 'approved')).toBe('50%')
    })

    it('calculates correct percentage for pending', () => {
      const ctx = {}
      const batch = { userCount: 10, statusCounts: { Pending: 3 } }
      expect(AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctx, batch, 'pending')).toBe('30%')
    })

    it('calculates correct percentage for declined', () => {
      const ctx = {}
      const batch = { userCount: 10, statusCounts: { Declined: 2 } }
      expect(AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctx, batch, 'declined')).toBe('20%')
    })
  })
})
