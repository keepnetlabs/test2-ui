import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import GoogleUserProvisioning from '@/components/Company Settings/GoogleUserProvisioning/GoogleUserProvisioning.vue'
import {
  getGoogleAuthorizeLink,
  syncGoogleUserProvisioning,
  unlinkGoogleUserProvisioning,
  stopSyncGoogleUserProvisioning,
  getGoogleUserProvisioning,
  manuallySyncGoogleUserProvisioning
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

  it('isOrganizationSource is true only when source is Organization', () => {
    expect(
      GoogleUserProvisioning.computed.isOrganizationSource.call({
        SYNC_SOURCE_TYPES: { ORGANIZATION: 'Organization' },
        formValues: { provisioningConfig: { source: 'Organization' } }
      })
    ).toBe(true)
    expect(
      GoogleUserProvisioning.computed.isOrganizationSource.call({
        SYNC_SOURCE_TYPES: { ORGANIZATION: 'Organization' },
        formValues: { provisioningConfig: { source: 'Group' } }
      })
    ).toBe(false)
  })

  it('source watch resets method to TARGET_USER when switching to Group while method is OU', () => {
    const watcher = GoogleUserProvisioning.watch['formValues.provisioningConfig.source'].handler

    const ouCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group' },
      SYNC_METHOD_TYPES: { SOURCE_ORGANIZATION_UNIT: 'SourceOrganizationUnit', TARGET_USER: 'User' },
      formValues: {
        provisioningConfig: { sync: { method: 'SourceOrganizationUnit' } }
      }
    }
    watcher.call(ouCtx, 'Group')
    expect(ouCtx.formValues.provisioningConfig.sync.method).toBe('User')

    const otherCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group' },
      SYNC_METHOD_TYPES: { SOURCE_ORGANIZATION_UNIT: 'SourceOrganizationUnit', TARGET_USER: 'User' },
      formValues: {
        provisioningConfig: { sync: { method: 'TargetGroup' } }
      }
    }
    watcher.call(otherCtx, 'Group')
    expect(otherCtx.formValues.provisioningConfig.sync.method).toBe('TargetGroup')

    const orgCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group' },
      SYNC_METHOD_TYPES: { SOURCE_ORGANIZATION_UNIT: 'SourceOrganizationUnit', TARGET_USER: 'User' },
      formValues: {
        provisioningConfig: { sync: { method: 'SourceOrganizationUnit' } }
      }
    }
    watcher.call(orgCtx, 'Organization')
    expect(orgCtx.formValues.provisioningConfig.sync.method).toBe('SourceOrganizationUnit')
  })

  it('handleStartSync sends empty details for SourceOrganizationUnit method', async () => {
    syncGoogleUserProvisioning.mockResolvedValue({})
    const ouCtx = {
      isButtonsDisabled: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      $refs: { refForm: { validate: jest.fn(() => true) } },
      callForData: jest.fn(),
      formValues: {
        provisioningConfig: {
          source: 'Organization',
          sync: { method: 'SourceOrganizationUnit', details: ['will-reset'] }
        }
      }
    }

    GoogleUserProvisioning.methods.handleStartSync.call(ouCtx)
    await flushPromises()
    expect(syncGoogleUserProvisioning).toHaveBeenCalled()
    expect(ouCtx.formValues.provisioningConfig.sync.details).toEqual([])
  })

  it('isSynced and syncControlStyle cover not-synced branch', () => {
    expect(
      GoogleUserProvisioning.computed.isSynced.call({
        formValues: { enableProvisioning: true, provisioningResourceId: 'p1' }
      })
    ).toBe(true)
    expect(
      GoogleUserProvisioning.computed.isSynced.call({
        formValues: { enableProvisioning: false, provisioningResourceId: '' }
      })
    ).toBe(false)

    const notSyncedStyle = GoogleUserProvisioning.computed.syncControlStyle.call({ isSynced: false })
    expect(notSyncedStyle.opacity).toBe('100%')
    expect(notSyncedStyle.pointerEvents).toBe('all')
  })

  it('isAllGroupsSelected and isAllOrganizationsSelected cover both branches', () => {
    expect(
      GoogleUserProvisioning.computed.isAllGroupsSelected.call({
        formValues: { provisioningConfig: { source: 'Group', selected: ['All_EeMkZ7dF'] } }
      })
    ).toBe(true)
    expect(
      GoogleUserProvisioning.computed.isAllGroupsSelected.call({
        formValues: { provisioningConfig: { source: 'Group', selected: ['g1'] } }
      })
    ).toBe(false)
    expect(
      GoogleUserProvisioning.computed.isAllOrganizationsSelected.call({
        formValues: { provisioningConfig: { source: 'Organization', selected: ['All_wiOrAv9C'] } }
      })
    ).toBe(true)
    expect(
      GoogleUserProvisioning.computed.isAllOrganizationsSelected.call({
        formValues: { provisioningConfig: { source: 'Organization', selected: ['o1'] } }
      })
    ).toBe(false)
  })

  it('all-option icons reflect selection state', () => {
    expect(GoogleUserProvisioning.computed.getAllGroupsIcon.call({ isAllGroupsSelected: true })).toBe(
      'mdi-checkbox-marked'
    )
    expect(
      GoogleUserProvisioning.computed.getAllGroupsIcon.call({ isAllGroupsSelected: false })
    ).toBe('mdi-checkbox-blank-outline')
    expect(
      GoogleUserProvisioning.computed.getAllOrganizationsIcon.call({ isAllOrganizationsSelected: true })
    ).toBe('mdi-checkbox-marked')
    expect(
      GoogleUserProvisioning.computed.getAllOrganizationsIcon.call({
        isAllOrganizationsSelected: false
      })
    ).toBe('mdi-checkbox-blank-outline')
  })

  it('select titles and subtitles cover organization branch', () => {
    const orgCtx = {
      formValues: { provisioningConfig: { source: 'Organization' } },
      SYNC_SOURCE_TYPES: { GROUP: 'Group' }
    }
    expect(GoogleUserProvisioning.computed.getSelectGroupsTitle.call(orgCtx)).toBe(
      '3. Select Organizational Units'
    )
    expect(GoogleUserProvisioning.computed.getSelectGroupsSubTitle.call(orgCtx)).toBe(
      'Pick the organizational units you’d like to sync from the dropdown menu'
    )

    const groupCtx = {
      formValues: { provisioningConfig: { source: 'Group' } },
      SYNC_SOURCE_TYPES: { GROUP: 'Group' }
    }
    expect(GoogleUserProvisioning.computed.getSelectGroupsSubTitle.call(groupCtx)).toBe(
      'Pick the groups you’d like to sync from the dropdown menu'
    )
  })

  it('getMatchingGroupOptions covers group-selected and all-organizations branches', () => {
    const groupSelectedCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group', ORGANIZATION: 'Organization' },
      formValues: { provisioningConfig: { source: 'Group', selected: ['g2'] } },
      groupOptions: [{ id: 'g1' }, { id: 'g2' }],
      organizationOptions: [],
      isAllGroupsSelected: false,
      isAllOrganizationsSelected: false
    }
    expect(GoogleUserProvisioning.computed.getMatchingGroupOptions.call(groupSelectedCtx)).toEqual([
      { id: 'g2' }
    ])

    const allOrgCtx = {
      SYNC_SOURCE_TYPES: { GROUP: 'Group', ORGANIZATION: 'Organization' },
      formValues: { provisioningConfig: { source: 'Organization', selected: ['All_wiOrAv9C'] } },
      groupOptions: [],
      organizationOptions: [{ id: 'All_wiOrAv9C' }, { id: 'o1' }],
      isAllGroupsSelected: false,
      isAllOrganizationsSelected: true
    }
    expect(GoogleUserProvisioning.computed.getMatchingGroupOptions.call(allOrgCtx)).toEqual([
      { id: 'o1' }
    ])
  })

  it('isGroupSelected and isOrganizationSelected return true on all-selected branch', () => {
    expect(
      GoogleUserProvisioning.methods.isGroupSelected.call(
        { isAllGroupsSelected: true, formValues: { provisioningConfig: { selected: [] } } },
        'g1'
      )
    ).toBe(true)
    expect(
      GoogleUserProvisioning.methods.isOrganizationSelected.call(
        { isAllOrganizationsSelected: true, formValues: { provisioningConfig: { selected: [] } } },
        'o1'
      )
    ).toBe(true)
  })

  it('handleManipulateItems maps name/resourceId to text/value', () => {
    expect(
      GoogleUserProvisioning.methods.handleManipulateItems.call(null, [
        { name: 'Group A', resourceId: 'r1' }
      ])
    ).toEqual([{ text: 'Group A', value: 'r1' }])
    expect(GoogleUserProvisioning.methods.handleManipulateItems.call(null)).toEqual([])
  })

  it('resetForm and simple modal toggles set expected flags', () => {
    const resetCtx = { formValues: { dirty: true } }
    GoogleUserProvisioning.methods.resetForm.call(resetCtx)
    expect(resetCtx.formValues.enableProvisioning).toBe(false)

    const unlinkCtx = {}
    GoogleUserProvisioning.methods.handleUnlinkIntegration.call(unlinkCtx)
    expect(unlinkCtx.isUnlinkModalVisible).toBe(true)
    GoogleUserProvisioning.methods.handleCloseUnlinkModal.call(unlinkCtx)
    expect(unlinkCtx.isUnlinkModalVisible).toBe(false)

    const stopCtx = {}
    GoogleUserProvisioning.methods.handleStopSync.call(stopCtx)
    expect(stopCtx.isStopSyncModalVisible).toBe(true)
    GoogleUserProvisioning.methods.handleCloseStopSyncModal.call(stopCtx)
    expect(stopCtx.isStopSyncModalVisible).toBe(false)
  })

  it('handleStartSync does nothing when validation fails', () => {
    const ctx = {
      isButtonsDisabled: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      $refs: { refForm: { validate: jest.fn(() => false) } },
      formValues: { provisioningConfig: { sync: { method: 'User', details: [] } } }
    }
    GoogleUserProvisioning.methods.handleStartSync.call(ctx)
    expect(syncGoogleUserProvisioning).not.toHaveBeenCalled()
    expect(ctx.isButtonsDisabled).toBe(false)
  })

  it('handleSyncAgain calls manual sync with provisioning id', async () => {
    manuallySyncGoogleUserProvisioning.mockResolvedValue({})
    const ctx = {
      isButtonsDisabled: false,
      formValues: { provisioningResourceId: 'prov1' },
      callForData: jest.fn()
    }
    GoogleUserProvisioning.methods.handleSyncAgain.call(ctx)
    await flushPromises()
    expect(manuallySyncGoogleUserProvisioning).toHaveBeenCalledWith({
      provisioningResourceId: 'prov1'
    })
    expect(ctx.isButtonsDisabled).toBe(false)
  })

  it('callForData unwraps target group details and triggers target group fetch', async () => {
    getGoogleUserProvisioning.mockResolvedValue({
      data: { data: { provisioningConfig: { sync: { method: 'TargetGroup', details: ['tg1'] } } } }
    })
    const callForTargetGroups = jest.fn()
    const ctx = {
      isLoading: false,
      isLinked: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      formValues: { provisioningConfig: { sync: {} } },
      targetGroupPayload: {},
      $nextTick: (cb) => cb(),
      $refs: { inputTargetGroup: { callForTargetGroups } },
      callForGroups: jest.fn(),
      callForOrganizationalUnits: jest.fn()
    }
    GoogleUserProvisioning.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.isLinked).toBe(true)
    expect(ctx.formValues.provisioningConfig.sync.details).toBe('tg1')
    expect(ctx.targetGroupPayload.selectTargetUserResourceIds).toBe('tg1')
    expect(callForTargetGroups).toHaveBeenCalled()
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData leaves details untouched for non target group methods', async () => {
    getGoogleUserProvisioning.mockResolvedValue({
      data: { data: { provisioningConfig: { sync: { method: 'User', details: [] } } } }
    })
    const ctx = {
      isLoading: false,
      isLinked: false,
      SYNC_METHOD_TYPES: { TARGET_GROUP: 'TargetGroup' },
      formValues: { provisioningConfig: { sync: {} } },
      targetGroupPayload: {},
      $nextTick: (cb) => cb(),
      $refs: {},
      callForGroups: jest.fn(),
      callForOrganizationalUnits: jest.fn()
    }
    GoogleUserProvisioning.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.isLinked).toBe(true)
    expect(ctx.formValues.provisioningConfig.sync.details).toEqual([])
    expect(ctx.callForGroups).toHaveBeenCalled()
    expect(ctx.isLoading).toBe(false)
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

describe('GoogleUserProvisioning.vue (rendered template branches)', () => {
  const OU_HELP_TEXT =
    'A Target Group will be created for each selected organizational unit. Users assigned directly to the unit will be synced into the matching group.'
  const SOURCE_GROUP_HELP_TEXT =
    'Users and groups under the selected organizational units will be created.'

  const renderStubs = {
    Fragment: { template: '<div><slot /></div>' },
    FormGroup: { template: '<div class="form-group-stub"><slot /></div>' },
    CompanySettingsHeader: true,
    DatatableLoading: true,
    UnlinkIntegrationModal: true,
    StopSyncronizationModal: true,
    KSelect: true,
    InputTargetGroup: { template: '<div class="input-target-group-stub" />' },
    AlertBox: { props: ['text'], template: '<div class="alert-box-stub">{{ text }}</div>' },
    VForm: { template: '<form><slot /></form>' },
    VRadioGroup: { template: '<div><slot /></div>' },
    VRadio: {
      props: ['label', 'value', 'disabled'],
      template:
        '<div class="v-radio-stub" :data-value="value" :data-disabled="disabled ? \'true\' : \'false\'">{{ label }}</div>'
    },
    VTooltip: {
      template: '<div><slot name="activator" :on="{}" :attrs="{}" /><slot /></div>'
    },
    VBtn: { template: '<button><slot /></button>' },
    VIcon: { template: '<i><slot /></i>' }
  }

  const buildFormValues = ({ source, method }) => ({
    googleOAuthResourceId: '',
    provisioningConfig: {
      source,
      selected: ['All_wiOrAv9C'],
      sync: { method, details: [] }
    },
    enableProvisioning: false,
    provisioningResourceId: '',
    isSyncing: false,
    groupsOfOrgUnit: []
  })

  const makeWrapper = (formValues) =>
    shallowMount(GoogleUserProvisioning, {
      vuetify: new Vuetify(),
      mocks: { $route: { query: { code: 'skip' } }, $router: { replace: jest.fn() } },
      stubs: renderStubs,
      data() {
        return { isLoading: false, isLinked: true, formValues }
      }
    })

  const findMethodRadio = (wrapper, value) =>
    wrapper.findAll('.v-radio-stub').wrappers.find((w) => w.attributes('data-value') === value)

  it('renders the OU method radio enabled with help text when source is Organization', () => {
    const wrapper = makeWrapper(
      buildFormValues({ source: 'Organization', method: 'SourceOrganizationUnit' })
    )
    const ouRadio = findMethodRadio(wrapper, 'SourceOrganizationUnit')

    expect(ouRadio).toBeTruthy()
    expect(ouRadio.attributes('data-disabled')).toBe('false')
    expect(wrapper.text()).toContain(OU_HELP_TEXT)
    expect(wrapper.find('.input-target-group-stub').exists()).toBe(false)
  })

  it('disables the OU method radio when source is Group', () => {
    const wrapper = makeWrapper(buildFormValues({ source: 'Group', method: 'User' }))
    const ouRadio = findMethodRadio(wrapper, 'SourceOrganizationUnit')

    expect(ouRadio.attributes('data-disabled')).toBe('true')
    expect(wrapper.text()).not.toContain(OU_HELP_TEXT)
  })

  it('resets OU method to TARGET_USER when source switches to Group while rendered', async () => {
    const wrapper = makeWrapper(
      buildFormValues({ source: 'Organization', method: 'SourceOrganizationUnit' })
    )
    await wrapper.setData({ formValues: { provisioningConfig: { source: 'Group' } } })

    expect(wrapper.vm.formValues.provisioningConfig.sync.method).toBe('User')
    expect(findMethodRadio(wrapper, 'SourceOrganizationUnit').attributes('data-disabled')).toBe(
      'true'
    )
  })

  it('shows the target group input only for the TargetGroup method', () => {
    const wrapper = makeWrapper(
      buildFormValues({ source: 'Organization', method: 'TargetGroup' })
    )
    expect(wrapper.find('.input-target-group-stub').exists()).toBe(true)
    expect(wrapper.text()).not.toContain(OU_HELP_TEXT)
  })

  it('shows the matching-group help text for the SourceGroup method', () => {
    const wrapper = makeWrapper(
      buildFormValues({ source: 'Organization', method: 'SourceGroup' })
    )
    expect(wrapper.text()).toContain(SOURCE_GROUP_HELP_TEXT)
    expect(wrapper.find('.input-target-group-stub').exists()).toBe(false)
  })

  it('renders stop sync controls instead of start sync when provisioning is enabled', () => {
    const formValues = buildFormValues({ source: 'Organization', method: 'User' })
    formValues.enableProvisioning = true
    formValues.isSyncing = true
    const wrapper = makeWrapper(formValues)

    expect(wrapper.text()).toContain('Stop sync')
    expect(wrapper.text()).toContain('Sync Now')
    expect(wrapper.text()).not.toContain('Start sync')
  })
})
