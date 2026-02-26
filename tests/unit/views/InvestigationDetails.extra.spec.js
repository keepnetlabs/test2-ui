import InvestigationDetails from '@/views/InvestigationDetails.vue'

describe('InvestigationDetails.vue (extra)', () => {
  const { computed, methods } = InvestigationDetails

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
})
