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
    const ctxWithCounts = {
      getBatchStatusCounts: AgenticAIActivitiesDrawer.methods.getBatchStatusCounts
    }

    it('returns 0% when total is 0', () => {
      expect(
        AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctxWithCounts, {}, 'approved')
      ).toBe('0%')
    })

    it('calculates correct percentage for approved', () => {
      const batch = { userCount: 10, statusCounts: { Approved: 5 } }
      expect(
        AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctxWithCounts, batch, 'approved')
      ).toBe('50%')
    })

    it('calculates correct percentage for pending', () => {
      const batch = { userCount: 10, statusCounts: { Pending: 3 } }
      expect(
        AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctxWithCounts, batch, 'pending')
      ).toBe('30%')
    })

    it('calculates correct percentage for declined', () => {
      const batch = { userCount: 10, statusCounts: { Declined: 2 } }
      expect(
        AgenticAIActivitiesDrawer.methods.getBatchSegmentWidth.call(ctxWithCounts, batch, 'declined')
      ).toBe('20%')
    })
  })

  describe('isTargetUserActive', () => {
    it('returns true when targetUserStatus is undefined (legacy API)', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, {})).toBe(true)
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: undefined })).toBe(
        true
      )
    })

    it('returns true when targetUserStatus is null', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: null })).toBe(true)
    })

    it('returns true for Active case-insensitive', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: 'Active' })).toBe(true)
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: '  active  ' })).toBe(
        true
      )
    })

    it('returns false for non-Active status strings', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: 'Inactive' })).toBe(
        false
      )
      expect(AgenticAIActivitiesDrawer.methods.isTargetUserActive.call(ctx, { targetUserStatus: '' })).toBe(false)
    })
  })

  describe('isTargetUserActionRestricted', () => {
    it('is the inverse of isTargetUserActive', () => {
      const ctx = {
        isTargetUserActive: AgenticAIActivitiesDrawer.methods.isTargetUserActive
      }
      expect(
        AgenticAIActivitiesDrawer.methods.isTargetUserActionRestricted.call(ctx, { targetUserStatus: 'Active' })
      ).toBe(false)
      expect(
        AgenticAIActivitiesDrawer.methods.isTargetUserActionRestricted.call(ctx, { targetUserStatus: 'Inactive' })
      ).toBe(true)
    })
  })

  describe('mapActivityToRow', () => {
    const methodCtx = {
      getActivityTypeName: AgenticAIActivitiesDrawer.methods.getActivityTypeName,
      normalizeStatus: AgenticAIActivitiesDrawer.methods.normalizeStatus,
      formatActivityTypeDisplay: AgenticAIActivitiesDrawer.methods.formatActivityTypeDisplay
    }

    it('maps targetUserStatus and defaults empty to empty string', () => {
      const row = AgenticAIActivitiesDrawer.methods.mapActivityToRow.call(methodCtx, {
        resourceId: 'rid',
        batchResourceId: 'bid',
        activityType: 1,
        activityTypeName: 'Phishing',
        targetUserStatus: 'Inactive',
        statusName: 'Pending',
        targetUserFirstName: 'A',
        targetUserLastName: 'B',
        targetUserEmail: 'a@b.com',
        targetUserDepartment: 'X'
      })
      expect(row.targetUserStatus).toBe('Inactive')
    })

    it('uses empty string when targetUserStatus missing', () => {
      const row = AgenticAIActivitiesDrawer.methods.mapActivityToRow.call(methodCtx, {
        resourceId: 'rid',
        batchResourceId: 'bid',
        activityType: 1,
        statusName: 'Pending',
        targetUserFirstName: 'A',
        targetUserLastName: 'B',
        targetUserEmail: 'a@b.com'
      })
      expect(row.targetUserStatus).toBe('')
    })
  })

  describe('previewApprovalActionsDisabled', () => {
    const baseCtx = {
      isTargetUserActive: AgenticAIActivitiesDrawer.methods.isTargetUserActive
    }

    it('is false when previewActivityRow is null', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewApprovalActionsDisabled.call({
          ...baseCtx,
          previewActivityRow: null
        })
      ).toBe(false)
    })

    it('is false when preview row is Active', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewApprovalActionsDisabled.call({
          ...baseCtx,
          previewActivityRow: { targetUserStatus: 'Active' }
        })
      ).toBe(false)
    })

    it('is true when preview row is not Active', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewApprovalActionsDisabled.call({
          ...baseCtx,
          previewActivityRow: { targetUserStatus: 'Inactive' }
        })
      ).toBe(true)
    })

    it('is true when preview row has empty targetUserStatus (mapped default)', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewApprovalActionsDisabled.call({
          ...baseCtx,
          previewActivityRow: { targetUserStatus: '' }
        })
      ).toBe(true)
    })

    it('is false when preview row omits targetUserStatus (legacy undefined)', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewApprovalActionsDisabled.call({
          ...baseCtx,
          previewActivityRow: { resourceId: 'r1' }
        })
      ).toBe(false)
    })
  })

  describe('isPreviewRowError', () => {
    it('is true when status is error', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.isPreviewRowError.call({
          previewActivityRow: { status: 'Error' }
        })
      ).toBe(true)
    })

    it('is false when no preview row', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.isPreviewRowError.call({
          previewActivityRow: null
        })
      ).toBe(false)
    })
  })

  describe('isPreviewRowWaitingForApproval', () => {
    it('delegates to isWaitingForApproval when preview row exists', () => {
      const ctx = {
        previewActivityRow: { status: 'Pending' },
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(AgenticAIActivitiesDrawer.computed.isPreviewRowWaitingForApproval.call(ctx)).toBe(true)
    })

    it('is false when previewActivityRow is null', () => {
      const ctx = {
        previewActivityRow: null,
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(AgenticAIActivitiesDrawer.computed.isPreviewRowWaitingForApproval.call(ctx)).toBe(false)
    })
  })

  describe('getApprovalCountForDialog', () => {
    it('returns selectedBatchPendingCount when row matches selected batch', () => {
      const ctx = {
        selectedBatchId: 'b1',
        selectedBatchPendingCount: 7,
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(
        AgenticAIActivitiesDrawer.methods.getApprovalCountForDialog.call(ctx, {
          batchResourceId: 'b1'
        })
      ).toBe(7)
    })

    it('returns waitingCount from row when set', () => {
      const ctx = {
        selectedBatchId: 'other',
        selectedBatchPendingCount: 0,
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(
        AgenticAIActivitiesDrawer.methods.getApprovalCountForDialog.call(ctx, {
          batchResourceId: 'b2',
          waitingCount: 3
        })
      ).toBe(3)
    })

    it('returns 1 when single row waiting and no batch aggregate', () => {
      const ctx = {
        selectedBatchId: null,
        selectedBatchPendingCount: 0,
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(
        AgenticAIActivitiesDrawer.methods.getApprovalCountForDialog.call(ctx, {
          status: 'Pending'
        })
      ).toBe(1)
    })

    it('returns 0 when row not waiting', () => {
      const ctx = {
        selectedBatchId: null,
        selectedBatchPendingCount: 0,
        isWaitingForApproval: AgenticAIActivitiesDrawer.methods.isWaitingForApproval
      }
      expect(
        AgenticAIActivitiesDrawer.methods.getApprovalCountForDialog.call(ctx, {
          status: 'Approved'
        })
      ).toBe(0)
    })
  })

  describe('pendingApprovalText', () => {
    it('uses singular when count is 1', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.pendingApprovalText.call({
          selectedBatchPendingCount: 1
        })
      ).toBe('1 approval is waiting')
    })

    it('uses plural when count is greater than 1', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.pendingApprovalText.call({
          selectedBatchPendingCount: 4
        })
      ).toBe('4 approvals are waiting')
    })
  })

  describe('previewReasoningText', () => {
    it('returns reasoning from explanationJson when present', () => {
      expect(
        AgenticAIActivitiesDrawer.computed.previewReasoningText.call({
          previewActivityRow: {
            explanationJson: { reasoningText: 'Because users need training.' }
          }
        })
      ).toBe('Because users need training.')
    })

    it('returns empty string when preview row or reasoning missing', () => {
      expect(AgenticAIActivitiesDrawer.computed.previewReasoningText.call({ previewActivityRow: null })).toBe('')
      expect(
        AgenticAIActivitiesDrawer.computed.previewReasoningText.call({
          previewActivityRow: { explanationJson: {} }
        })
      ).toBe('')
    })
  })

  describe('hasNestedPreview', () => {
    it('is true when previewType is set', () => {
      expect(AgenticAIActivitiesDrawer.computed.hasNestedPreview.call({ previewType: 'Phishing' })).toBe(true)
    })

    it('is false when previewType is null', () => {
      expect(AgenticAIActivitiesDrawer.computed.hasNestedPreview.call({ previewType: null })).toBe(false)
    })
  })
})
