import InvestigationDetails from '@/views/InvestigationDetails.vue'

describe('InvestigationDetails.vue (extra)', () => {
  const { computed, methods, watch } = InvestigationDetails

  it('getInvestigationType returns matching playbook name for auto type', () => {
    const ctx = {
      investigationDetailsData: {
        investigationType: 'Auto',
        matchingPlaybookName: 'Playbook A'
      }
    }
    expect(computed.getInvestigationType.call(ctx)).toBe('Playbook A')
  })

  it('getInvestigationType returns raw type for non-auto values', () => {
    const ctx = {
      investigationDetailsData: {
        investigationType: 'Manual'
      }
    }
    expect(computed.getInvestigationType.call(ctx)).toBe('Manual')
  })

  it('isMoveToTrashDisabled and isPermanentlyDeleteDisabled branches', () => {
    const emptyCtx = { deleteValue: {} }
    expect(computed.isMoveToTrashDisabled.call(emptyCtx)).toBe(false)
    expect(computed.isPermanentlyDeleteDisabled.call(emptyCtx)).toBe(false)

    const moveCtx = {
      deleteValue: {
        emailLastAction: {
          actionType: 'Delete',
          status: 'Completed',
          isPermanentDelete: false
        }
      }
    }
    expect(computed.isMoveToTrashDisabled.call(moveCtx)).toBe(true)
    expect(computed.isPermanentlyDeleteDisabled.call(moveCtx)).toBe(false)
  })

  it('header card computed helpers return expected classes/styles by status', () => {
    expect(computed.getHeaderCardBoxClassSecond.call({ statsAndMenuData: null })).toBe('')

    const runningOnline = {
      statsAndMenuData: { status: 'Running', onlineUserCount: 3 }
    }
    expect(computed.getHeaderCardBoxClassSecond.call(runningOnline)).toBe('bg-turquoise')
    expect(computed.getHeaderCardBoxShadow.call(runningOnline).boxShadow).toContain(
      'rgba(33, 150, 243'
    )

    const expired = { statsAndMenuData: { status: 'Expired' } }
    expect(computed.getHeaderCardBoxClassSecond.call(expired)).toBe('bg-macaroni')
    expect(computed.getHeaderCardBoxShadowSecond.call(expired).boxShadow).toContain(
      'rgba(230, 162, 60'
    )
  })

  it('getWarningEmailDisableStatus returns false when no last action', () => {
    expect(methods.getWarningEmailDisableStatus.call({}, {})).toBe(false)
    expect(
      methods.getWarningEmailDisableStatus.call({}, {
        emailLastAction: { actionType: 'Warning', status: 'Pending' }
      })
    ).toBe(true)
  })

  it('onAddClose does not navigate when response has no resourceId', () => {
    const push = jest.fn()
    const refreshDatatable = jest.fn()
    const ctx = {
      $router: { push },
      refreshDatatable,
      timeoutId: null,
      isWantToAddNewInvestigation: true
    }

    methods.onAddClose.call(ctx, { data: { data: {} } })

    expect(push).not.toHaveBeenCalled()
    expect(refreshDatatable).toHaveBeenCalled()
    expect(ctx.isWantToAddNewInvestigation).toBe(false)
  })

  it('deleteInvestigationDetails calculates selected count and opens delete modal', () => {
    const ctx = {
      serverSideProps: { totalNumberOfRecords: 10 },
      totalSelectedItemsCount: 0,
      isWantToDelete: false,
      deleteValue: null
    }
    methods.deleteInvestigationDetails.call(
      ctx,
      [{ resourceId: '1' }, { resourceId: '2' }],
      ['x'],
      true
    )

    expect(ctx.isInvestigationDeleteSelectAll).toBe(true)
    expect(ctx.investigationDeleteExcludedResourceIdList).toEqual(['x'])
    expect(ctx.totalSelectedItemsCount).toBe(9)
    expect(ctx.isWantToDelete).toBe(true)
    expect(Array.isArray(ctx.deleteValue)).toBe(true)
  })

  it('isColumnFilterActive checks both filter groups safely', () => {
    expect(
      methods.isColumnFilterActive({
        filter: { FilterGroups: [{ FilterItems: [{}, {}] }, { FilterItems: [] }] }
      })
    ).toBe(true)
    expect(
      methods.isColumnFilterActive({
        filter: { FilterGroups: [{ FilterItems: [{}] }, { FilterItems: [{}] }] }
      })
    ).toBe(true)
    expect(
      methods.isColumnFilterActive({
        filter: { FilterGroups: [{ FilterItems: [{}] }, { FilterItems: [] }] }
      })
    ).toBe(false)
  })

  it('handleSearchChange and handleSearchChangeForTargetUsers reset and refresh with/without payload', () => {
    const ctx = {
      investigationListBodyData: {
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [{ old: true }] }] }
      },
      investigationTargetUsersListBodyData: {
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [{ old: true }] }] }
      },
      resetPageNumber: jest.fn(),
      resetPageNumberForTargetUsers: jest.fn(),
      calculateInvestigateListFilterActive: jest.fn(),
      calculateTargetUserListFilterActive: jest.fn(),
      refreshDatatable: jest.fn()
    }

    methods.handleSearchChange.call(ctx, {})
    expect(ctx.investigationListBodyData.filter.FilterGroups[1].FilterItems).toEqual([])

    methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'subject', Value: 'abc' }] }] }
    })
    expect(ctx.investigationListBodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'subject', Value: 'abc' }
    ])

    methods.handleSearchChangeForTargetUsers.call(ctx, {})
    expect(ctx.investigationTargetUsersListBodyData.filter.FilterGroups[1].FilterItems).toEqual([])

    methods.handleSearchChangeForTargetUsers.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'email', Value: 'u@k.com' }] }] }
    })
    expect(ctx.investigationTargetUsersListBodyData.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email', Value: 'u@k.com' }
    ])
    expect(ctx.refreshDatatable).toHaveBeenCalled()
  })

  it('handleClearFilters returns false when disabled and refreshes when enabled', () => {
    const ctx = {
      defaultRequestBody: { pageNumber: 9, pageSize: 20 },
      investigationListBodyData: { pageNumber: 1 },
      refreshDatatable: jest.fn()
    }

    expect(methods.handleClearFilters.call(ctx, false)).toBe(false)
    methods.handleClearFilters.call(ctx, true)
    expect(ctx.investigationListBodyData).toEqual({ pageNumber: 9, pageSize: 20 })
    expect(ctx.refreshDatatable).toHaveBeenCalledWith(true)
  })

  it('getActionStatusOptions covers completed, error, and not-found branches', () => {
    const completedDelete = methods.getActionStatusOptions({
      actionType: 'Delete',
      status: 'Completed',
      isPermanentDelete: true
    })
    expect(completedDelete.icon).toBe('mdi-close-circle')
    expect(completedDelete.color).toBe('#6d6d6d')

    const completedWithError = methods.getActionStatusOptions({
      actionType: 'Warning',
      status: 'CompletedWithError'
    })
    expect(completedWithError.icon).toBe('mdi-alert-circle')
    expect(completedWithError.color).toBe('#f56c6c')

    const itemNotFound = methods.getActionStatusOptions({
      actionType: 'DeleteAndNotify',
      status: 'ItemNotFound'
    })
    expect(itemNotFound.icon).toBe('mdi-alert-circle')
    expect(itemNotFound.color).toBe('#f56c6c')
  })

  it('progress helpers return expected defaults and percentages', () => {
    expect(
      methods.getProgressText({ row: { status: 'Completed', progress: 40 } })
    ).toBe('Completed')
    expect(
      methods.getProgressText({ row: { status: 'Running', progress: 75 } })
    ).toBe('75%')

    expect(
      methods.getProgressValue({ row: { analyzedMailCount: 0, filteredMailCount: 0 } })
    ).toBe(100)
    expect(
      methods.getProgressValue({ row: { analyzedMailCount: 1, filteredMailCount: 4 } })
    ).toBe(25)

    expect(methods.hasValidMailProgress({})).toBe(false)
    expect(methods.hasValidMailProgress({ row: { analyzedMailCount: 'abc' } })).toBe(false)
    expect(methods.hasValidMailProgress({ row: { analyzedMailCount: '2' } })).toBe(true)
  })

  it('watch.isAutoRefreshActive starts interval when active and clears when inactive', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval').mockReturnValue(123)
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval').mockImplementation(() => {})

    const ctx = {
      autoRefreshInterval: null,
      refreshDatatable: jest.fn()
    }
    watch.isAutoRefreshActive.handler.call(ctx, true)
    expect(setIntervalSpy).toHaveBeenCalled()
    expect(ctx.autoRefreshInterval).toBe(123)

    watch.isAutoRefreshActive.handler.call(ctx, false)
    expect(clearIntervalSpy).toHaveBeenCalledWith(123)

    setIntervalSpy.mockRestore()
    clearIntervalSpy.mockRestore()
  })
})
