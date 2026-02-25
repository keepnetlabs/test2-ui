import GoogleUserProvisioning from '@/components/Company Settings/GoogleUserProvisioning/GoogleUserProvisioning.vue'
import {
  getGoogleAuthorizeLink,
  syncGoogleUserProvisioning,
  unlinkGoogleUserProvisioning,
  stopSyncGoogleUserProvisioning
} from '@/api/googleUserProvisioning'

jest.mock('@/api/googleUserProvisioning', () => ({
  __esModule: true,
  getGoogleAuthorizeLink: jest.fn(),
  submitGoogleUserProvisioningInformation: jest.fn(),
  unlinkGoogleUserProvisioning: jest.fn(),
  getGoogleUserProvisioning: jest.fn(),
  getGoogleUserProvisioningGroups: jest.fn(),
  getGoogleUserProvisioningOrganizationUnits: jest.fn(),
  syncGoogleUserProvisioning: jest.fn(),
  manuallySyncGoogleUserProvisioning: jest.fn(),
  stopSyncGoogleUserProvisioning: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('GoogleUserProvisioning.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(GoogleUserProvisioning.name).toBe('GoogleUserProvisioning')
  })

  it('computed syncControlStyle and selection titles change by state', () => {
    const syncedStyle = GoogleUserProvisioning.computed.syncControlStyle.call({ isSynced: true })
    expect(syncedStyle.opacity).toBe('56%')
    expect(syncedStyle.pointerEvents).toBe('none')

    const groupsTitle = GoogleUserProvisioning.computed.getSelectGroupsTitle.call({
      formValues: { provisioningConfig: { source: 'Group' } },
      SYNC_SOURCE_TYPES: { GROUP: 'Group' }
    })
    expect(groupsTitle).toBe('3. Select Groups')
  })

  it('getMatchingGroupOptions handles all and selected branches', () => {
    const groupAllCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group', ORGANIZATION: 'Organization' },
      formValues: { provisioningConfig: { source: 'Group', selected: ['All_EeMkZ7dF'] } },
      groupOptions: [{ id: 'All_EeMkZ7dF' }, { id: 'g1' }, { id: 'g2' }],
      organizationOptions: [],
      isAllGroupsSelected: true,
      isAllOrganizationsSelected: false
    }
    expect(GoogleUserProvisioning.computed.getMatchingGroupOptions.call(groupAllCtx)).toEqual([
      { id: 'g1' },
      { id: 'g2' }
    ])

    const orgSelectedCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group', ORGANIZATION: 'Organization' },
      formValues: { provisioningConfig: { source: 'Organization', selected: ['o2'] } },
      groupOptions: [],
      organizationOptions: [{ id: 'o1' }, { id: 'o2' }],
      isAllGroupsSelected: false,
      isAllOrganizationsSelected: false
    }
    expect(GoogleUserProvisioning.computed.getMatchingGroupOptions.call(orgSelectedCtx)).toEqual([
      { id: 'o2' }
    ])
  })

  it('handles group and organization all-option selection logic', () => {
    const ctx = {
      formValues: { provisioningConfig: { selected: [] } }
    }

    GoogleUserProvisioning.methods.handleSelectedGroupsChange.call(ctx, ['g1', 'All_EeMkZ7dF'])
    expect(ctx.formValues.provisioningConfig.selected).toEqual(['All_EeMkZ7dF'])
    GoogleUserProvisioning.methods.handleSelectedGroupsChange.call(ctx, ['g1'])
    expect(ctx.formValues.provisioningConfig.selected).toEqual(['g1'])

    GoogleUserProvisioning.methods.handleSelectedOrganizationsChange.call(ctx, [
      'o1',
      'All_wiOrAv9C'
    ])
    expect(ctx.formValues.provisioningConfig.selected).toEqual(['All_wiOrAv9C'])
    GoogleUserProvisioning.methods.handleSelectedOrganizationsChange.call(ctx, ['o2'])
    expect(ctx.formValues.provisioningConfig.selected).toEqual(['o2'])
  })

  it('item disabled and selected helper methods cover both branches', () => {
    expect(
      GoogleUserProvisioning.methods.handleGroupItemDisabled.call(
        { isAllGroupsSelected: true },
        { name: 'Group A' }
      )
    ).toBe(true)
    expect(
      GoogleUserProvisioning.methods.handleGroupItemDisabled.call(
        { isAllGroupsSelected: true },
        { name: 'All Groups' }
      )
    ).toBe(false)

    expect(
      GoogleUserProvisioning.methods.handleOrganizationItemDisabled.call(
        { isAllOrganizationsSelected: true },
        { name: 'Org A' }
      )
    ).toBe(true)
    expect(
      GoogleUserProvisioning.methods.handleOrganizationItemDisabled.call(
        { isAllOrganizationsSelected: false },
        { name: 'Org A' }
      )
    ).toBe(false)

    expect(
      GoogleUserProvisioning.methods.isGroupSelected.call(
        {
          isAllGroupsSelected: false,
          formValues: { provisioningConfig: { selected: ['g1'] } }
        },
        'g1'
      )
    ).toBe(true)
    expect(
      GoogleUserProvisioning.methods.isOrganizationSelected.call(
        {
          isAllOrganizationsSelected: false,
          formValues: { provisioningConfig: { selected: ['o1'] } }
        },
        'o2'
      )
    ).toBe(false)
  })

  it('created triggers data call only when callback code is missing', () => {
    const normalCtx = { $route: { query: {} }, callForData: jest.fn() }
    GoogleUserProvisioning.created.call(normalCtx)
    expect(normalCtx.callForData).toHaveBeenCalled()

    const callbackCtx = { $route: { query: { code: 'abc' } }, callForData: jest.fn() }
    GoogleUserProvisioning.created.call(callbackCtx)
    expect(callbackCtx.callForData).not.toHaveBeenCalled()
  })

  it('watch formValues.isSyncing starts and stops interval polling', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval').mockReturnValue(123)
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval').mockImplementation(() => {})
    const ctx = { callForDataWithoutLoading: jest.fn(), interval: null }

    GoogleUserProvisioning.watch['formValues.isSyncing'].handler.call(ctx, true)
    expect(setIntervalSpy).toHaveBeenCalled()

    GoogleUserProvisioning.watch['formValues.isSyncing'].handler.call(ctx, false)
    expect(clearIntervalSpy).toHaveBeenCalledWith(123)

    setIntervalSpy.mockRestore()
    clearIntervalSpy.mockRestore()
  })

  it('handleConnectToGoogle toggles button state and calls authorize api', async () => {
    getGoogleAuthorizeLink.mockResolvedValue({ data: { data: null } })
    const ctx = { isButtonsDisabled: false }

    GoogleUserProvisioning.methods.handleConnectToGoogle.call(ctx)
    await flushPromises()

    expect(getGoogleAuthorizeLink).toHaveBeenCalled()
    expect(ctx.isButtonsDisabled).toBe(false)
  })

  it('handleStartSync transforms payload by sync method', async () => {
    syncGoogleUserProvisioning.mockResolvedValue({})
    const targetGroupCtx = {
      isButtonsDisabled: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      $refs: { refForm: { validate: jest.fn(() => true) } },
      callForData: jest.fn(),
      formValues: {
        provisioningConfig: {
          sync: { method: 'TargetGroup', details: 'tg1' }
        }
      }
    }

    GoogleUserProvisioning.methods.handleStartSync.call(targetGroupCtx)
    await flushPromises()
    expect(syncGoogleUserProvisioning).toHaveBeenCalled()
    expect(targetGroupCtx.formValues.provisioningConfig.sync.details).toEqual(['tg1'])
    expect(targetGroupCtx.isButtonsDisabled).toBe(false)

    syncGoogleUserProvisioning.mockClear()
    const targetUserCtx = {
      isButtonsDisabled: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      $refs: { refForm: { validate: jest.fn(() => true) } },
      callForData: jest.fn(),
      formValues: {
        provisioningConfig: {
          sync: { method: 'User', details: ['will-reset'] }
        }
      }
    }
    GoogleUserProvisioning.methods.handleStartSync.call(targetUserCtx)
    await flushPromises()
    expect(targetUserCtx.formValues.provisioningConfig.sync.details).toEqual([])
  })

  it('handleConfirmUnlink and handleConfirmStopSync run api flow and reset states', async () => {
    unlinkGoogleUserProvisioning.mockResolvedValue({})
    const unlinkCtx = {
      isButtonsDisabled: false,
      isLinked: true,
      handleCloseUnlinkModal: jest.fn(),
      resetForm: jest.fn()
    }
    GoogleUserProvisioning.methods.handleConfirmUnlink.call(unlinkCtx)
    await flushPromises()

    expect(unlinkGoogleUserProvisioning).toHaveBeenCalled()
    expect(unlinkCtx.isLinked).toBe(false)
    expect(unlinkCtx.handleCloseUnlinkModal).toHaveBeenCalled()
    expect(unlinkCtx.resetForm).toHaveBeenCalled()
    expect(unlinkCtx.isButtonsDisabled).toBe(false)

    stopSyncGoogleUserProvisioning.mockResolvedValue({})
    const stopCtx = {
      isButtonsDisabled: false,
      formValues: { provisioningResourceId: 'prov1' },
      handleCloseStopSyncModal: jest.fn(),
      callForData: jest.fn(),
      resetForm: jest.fn()
    }
    GoogleUserProvisioning.methods.handleConfirmStopSync.call(stopCtx)
    await flushPromises()
    expect(stopSyncGoogleUserProvisioning).toHaveBeenCalledWith({
      provisioningResourceId: 'prov1'
    })
    expect(stopCtx.handleCloseStopSyncModal).toHaveBeenCalled()
    expect(stopCtx.callForData).toHaveBeenCalled()
    expect(stopCtx.resetForm).toHaveBeenCalled()
    expect(stopCtx.isButtonsDisabled).toBe(false)
  })
})
