jest.mock('@/api/mailConfiguration', () => ({
  createEWS: jest.fn(() => Promise.resolve()),
  createGoogleWorkSpace: jest.fn(() => Promise.resolve()),
  createO365: jest.fn(() => Promise.resolve()),
  deleteEWS: jest.fn(() => Promise.resolve()),
  deleteGoogleWorkSpace: jest.fn(() => Promise.resolve()),
  deleteO365: jest.fn(() => Promise.resolve()),
  exportMailConfiguration: jest.fn(() => Promise.resolve({ data: Buffer.from('x') })),
  getDomainList: jest.fn(() => Promise.resolve({ data: { data: [{ resourceId: 'd1', name: 'acme.com' }] } })),
  getEWSMailData: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getExchangeVersions: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getGoogleWorkSpace: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getMailConfigurationList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ resourceId: 'm1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  getO365MailData: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  updateEWS: jest.fn(() => Promise.resolve()),
  updateGoogleWorkSpace: jest.fn(() => Promise.resolve()),
  updateO365: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroups: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      pageNumber: 1,
      pageSize: 10,
      orderBy: 'createTime',
      ascending: false,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    })),
    isDifferent: jest.fn(() => false),
    scrollToComponent: jest.fn()
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'name', Operator: 'Contains', Value: 'ac' }]),
  columnFilterCleared: jest.fn(() => [])
}))

import MailConfiguration from '@/components/MailConfiguration/MailConfiguration.vue'
import {
  getDomainList,
  deleteEWS,
  deleteGoogleWorkSpace,
  deleteO365,
  getExchangeVersions
} from '@/api/mailConfiguration'
import { getTargetGroups } from '@/api/targetUsers'
import { isDifferent } from '@/utils/functions'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('MailConfiguration.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getDomainList calls api only when required fields are present', async () => {
    const ctx = {
      formValues: {
        applicationId: 'a',
        applicationSecret: 's',
        directoryId: 'd',
        email: 'u@acme.com'
      },
      domainList: []
    }

    MailConfiguration.methods.getDomainList.call(ctx, { resourceId: 'r1' })
    await flushPromises()
    expect(getDomainList).toHaveBeenCalledWith({
      applicationId: 'a',
      applicationSecret: 's',
      directoryId: 'd',
      email: 'u@acme.com',
      resourceId: 'r1'
    })
    expect(ctx.domainList).toEqual([{ resourceId: 'd1', name: 'acme.com' }])

    const ctxMissing = { formValues: { applicationId: null } }
    MailConfiguration.methods.getDomainList.call(ctxMissing)
    expect(getDomainList).toHaveBeenCalledTimes(1)
  })

  it('group type and reset helpers mutate form values', () => {
    const ctx = {
      ewsFormValues: {
        IsAllTargetGroupsSelected: true,
        TargetGroupResourceIdList: ['g1']
      }
    }
    MailConfiguration.methods.handleGroupTypeChange.call(ctx)
    expect(ctx.ewsFormValues.TargetGroupResourceIdList).toEqual([])

    MailConfiguration.methods.resetEWSForm.call(ctx)
    expect(ctx.ewsFormValues.AccountType).toBe(1)

    const o365Ctx = {}
    MailConfiguration.methods.resetO365Form.call(o365Ctx)
    expect(o365Ctx.formValues.allowedDomains).toEqual([])

    const gwsCtx = {}
    MailConfiguration.methods.resetGoogleWorkSpaceForm.call(gwsCtx)
    expect(gwsCtx.googleWorkSpaceForm).toEqual({ name: '', authJson: '', email: '' })
  })

  it('server-side handlers update payload and trigger data reload', () => {
    const ctx = {
      requestBody: { pageNumber: 2, pageSize: 10, ascending: false, orderBy: 'name', filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      serverSideProps: { pageNumber: 2, pageSize: 10 },
      getTableData: jest.fn(),
      resetPageNumber: MailConfiguration.methods.resetPageNumber
    }

    MailConfiguration.methods.serverSidePageNumberChanged.call(ctx, 5)
    expect(ctx.requestBody.pageNumber).toBe(5)

    MailConfiguration.methods.sortChanged.call(ctx, { order: 'ascending', prop: 'platform' })
    expect(ctx.requestBody.ascending).toBe(true)
    expect(ctx.requestBody.orderBy).toBe('platform')

    MailConfiguration.methods.serverSideSizeChanged.call(ctx, 25)
    expect(ctx.requestBody.pageSize).toBe(25)
    expect(ctx.serverSideProps.pageSize).toBe(25)
    expect(ctx.requestBody.pageNumber).toBe(1)

    MailConfiguration.methods.handleSearchChange.call(ctx, {
      filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'name', Value: 'acme' }] }] }
    })
    expect(ctx.requestBody.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Value: 'acme' }
    ])
    expect(ctx.getTableData).toHaveBeenCalled()
  })

  it('column filter helpers delegate to utility functions', () => {
    const ctx = {
      requestBody: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      getTableData: jest.fn()
    }

    MailConfiguration.methods.columnFilterChanged.call(ctx, { fieldName: 'name' })
    expect(columnFilterChanged).toHaveBeenCalled()
    expect(ctx.requestBody.filter.FilterGroups[0].FilterItems).toHaveLength(1)

    MailConfiguration.methods.columnFilterCleared.call(ctx, 'name')
    expect(columnFilterCleared).toHaveBeenCalled()
    expect(ctx.requestBody.filter.FilterGroups[0].FilterItems).toEqual([])
  })

  it('testConnection values update snapshots and trigger follow-up actions', () => {
    const submit = jest.fn()
    const submitEWS = jest.fn()
    const ctx = {
      formValues: { name: 'o365' },
      ewsFormValues: { Name: 'ews' },
      isTestConnectionWorkedBefore: false,
      delaySaveFunction: false,
      status: true,
      ewsStatus: true,
      submit,
      submitEWS,
      $nextTick: (cb) => cb()
    }

    MailConfiguration.methods.testConnectionValues.call(ctx, true, true)

    expect(ctx.formValuesAfterO365Test).toEqual({ name: 'o365' })
    expect(ctx.formValuesAfterEWSTest).toEqual({ Name: 'ews' })
    expect(ctx.isTestConnectionWorkedBefore).toBe(true)
    expect(submit).toHaveBeenCalled()
    expect(submitEWS).toHaveBeenCalled()
  })

  it('testConnectionGoogleWorkspaceValues updates snapshot and optionally triggers submit', () => {
    const handleSubmitGoogleWorkspace = jest.fn()
    const ctx = {
      googleWorkSpaceForm: { name: 'gws' },
      isTestConnectionWorkedBefore: false,
      delaySaveFunction: false,
      handleSubmitGoogleWorkspace,
      $nextTick: (cb) => cb()
    }

    MailConfiguration.methods.testConnectionGoogleWorkspaceValues.call(ctx, true, true)
    expect(ctx.formValuesAfterGWSTest).toEqual({ name: 'gws' })
    expect(ctx.isTestConnectionWorkedBefore).toBe(true)
    expect(handleSubmitGoogleWorkspace).toHaveBeenCalled()

    const noSuccessCtx = {
      googleWorkSpaceForm: { name: 'gws2' },
      isTestConnectionWorkedBefore: false,
      delaySaveFunction: false,
      handleSubmitGoogleWorkspace: jest.fn(),
      $nextTick: (cb) => cb()
    }
    MailConfiguration.methods.testConnectionGoogleWorkspaceValues.call(noSuccessCtx, false, true)
    expect(noSuccessCtx.handleSubmitGoogleWorkspace).not.toHaveBeenCalled()
  })

  it('test connection callbacks do not auto-submit when delaySaveFunction is enabled', () => {
    const submit = jest.fn()
    const submitEWS = jest.fn()
    const ctx = {
      formValues: { name: 'o365-delay' },
      ewsFormValues: { Name: 'ews-delay' },
      isTestConnectionWorkedBefore: false,
      delaySaveFunction: true,
      status: true,
      ewsStatus: true,
      submit,
      submitEWS,
      $nextTick: (cb) => cb()
    }

    MailConfiguration.methods.testConnectionValues.call(ctx, true, true)
    expect(submit).not.toHaveBeenCalled()
    expect(submitEWS).not.toHaveBeenCalled()

    const handleSubmitGoogleWorkspace = jest.fn()
    const gwsCtx = {
      googleWorkSpaceForm: { name: 'gws-delay' },
      isTestConnectionWorkedBefore: false,
      delaySaveFunction: true,
      handleSubmitGoogleWorkspace,
      $nextTick: (cb) => cb()
    }
    MailConfiguration.methods.testConnectionGoogleWorkspaceValues.call(gwsCtx, true, true)
    expect(handleSubmitGoogleWorkspace).not.toHaveBeenCalled()
  })

  it('validate helpers return form validation state', () => {
    const ewsCtx = {
      ewsStatus: true,
      $refs: {
        ewsMailConfiguration: { validate: jest.fn(() => true) }
      }
    }
    expect(MailConfiguration.methods.isValidate.call(ewsCtx)).toBe(true)

    const o365Ctx = {
      ewsStatus: false,
      $refs: {
        mailConfiguration: { validate: jest.fn(() => false) }
      }
    }
    expect(MailConfiguration.methods.isValidate.call(o365Ctx)).toBe(false)

    const gwsCtx = {
      $refs: {
        googleWorkSpaceConfigurationForm: { validate: jest.fn(() => true) }
      }
    }
    expect(MailConfiguration.methods.isValidateGoogleWorkSpace.call(gwsCtx)).toBe(true)
  })

  it('delete handlers clear state and call proper api by platform', async () => {
    const ref = { unSelectRow: jest.fn() }
    const base = {
      $refs: { refPeopleTable: ref },
      deletedItem: { resourceId: 'row-1' },
      closeDeleteDialog: jest.fn(),
      getTableData: jest.fn()
    }

    MailConfiguration.methods.handleDeleteDialog.call({ ...base, deleteItemType: 'Exchange', deleteDialogId: 'd1' })
    await flushPromises()
    expect(deleteEWS).toHaveBeenCalledWith('d1')

    MailConfiguration.methods.handleDeleteDialog.call({ ...base, deleteItemType: 'Google Workspace', deleteDialogId: 'd2' })
    await flushPromises()
    expect(deleteGoogleWorkSpace).toHaveBeenCalledWith('d2')

    MailConfiguration.methods.handleDeleteDialog.call({ ...base, deleteItemType: 'Microsoft 365', deleteDialogId: 'd3' })
    await flushPromises()
    expect(deleteO365).toHaveBeenCalledWith('d3')
  })

  it('delete handler supports GoogleWorkspace and GSuite aliases', async () => {
    const ref = { unSelectRow: jest.fn() }
    const base = {
      $refs: { refPeopleTable: ref },
      deletedItem: { resourceId: 'row-2' },
      closeDeleteDialog: jest.fn(),
      getTableData: jest.fn()
    }

    MailConfiguration.methods.handleDeleteDialog.call({
      ...base,
      deleteItemType: 'GoogleWorkspace',
      deleteDialogId: 'd4'
    })
    await flushPromises()
    expect(deleteGoogleWorkSpace).toHaveBeenCalledWith('d4')

    MailConfiguration.methods.handleDeleteDialog.call({
      ...base,
      deleteItemType: 'GSuite',
      deleteDialogId: 'd5'
    })
    await flushPromises()
    expect(deleteGoogleWorkSpace).toHaveBeenCalledWith('d5')
  })

  it('cancel methods close immediately when there is no change and dispatch on change', () => {
    isDifferent.mockReturnValueOnce(false)
    const o365Ctx = {
      status: true,
      editData: { id: 1 },
      domainList: ['x'],
      initialFormValues: {},
      formValues: {},
      resetO365Form: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    MailConfiguration.methods.cancelO365.call(o365Ctx)
    expect(o365Ctx.status).toBe(false)
    expect(o365Ctx.editData).toBe(null)
    expect(o365Ctx.domainList).toEqual([])

    isDifferent.mockReturnValueOnce(true)
    const gwsCtx = {
      statusGoogleWorkSpace: true,
      googleWorkSpaceInitialValues: {},
      googleWorkSpaceForm: { name: 'x' },
      resetGoogleWorkSpaceForm: jest.fn(),
      isGoogleWorkSpaceEdit: true,
      $store: { dispatch: jest.fn() }
    }
    MailConfiguration.methods.cancelGoogleWorkSpace.call(gwsCtx)
    expect(gwsCtx.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('cancelEWS closes directly when unchanged and dispatches when changed', () => {
    isDifferent.mockReturnValueOnce(false)
    const unchangedCtx = {
      ewsStatus: true,
      ewsInitialFormValues: {},
      ewsFormValues: {},
      resetEWSForm: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    MailConfiguration.methods.cancelEWS.call(unchangedCtx)
    expect(unchangedCtx.ewsStatus).toBe(false)
    expect(unchangedCtx.resetEWSForm).toHaveBeenCalled()
    expect(unchangedCtx.$store.dispatch).not.toHaveBeenCalled()

    isDifferent.mockReturnValueOnce(true)
    const changedCtx = {
      ewsStatus: true,
      ewsInitialFormValues: { a: 1 },
      ewsFormValues: { a: 2 },
      resetEWSForm: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    MailConfiguration.methods.cancelEWS.call(changedCtx)
    expect(changedCtx.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleAddMailConfiguration opens correct modal per selected type', () => {
    const ctx = {
      mailConfigurationTypes: ['Google Workspace', 'Microsoft 365', 'EWS'],
      googleWorkSpaceForm: { name: '', authJson: '', email: '' },
      googleWorkSpaceInitialValues: {},
      selectedGoogleWorkSpaceResourceId: 'old',
      statusGoogleWorkSpace: false,
      isGoogleWorkSpaceEdit: true,
      formValues: {},
      initialFormValues: {},
      editData: { x: 1 },
      isTestConnectionWorkedBefore: true,
      saveButtonDisabled: true,
      status: false,
      ewsFormValues: {},
      ewsInitialFormValues: {},
      ewsEditData: { x: 1 },
      ewsStatus: false
    }

    MailConfiguration.methods.handleAddMailConfiguration.call(ctx, 'Google Workspace')
    expect(ctx.statusGoogleWorkSpace).toBe(true)
    expect(ctx.googleWorkSpaceEditData).toBe(null)
    expect(ctx.isTestConnectionWorkedBefore).toBe(false)

    MailConfiguration.methods.handleAddMailConfiguration.call(ctx, 'Microsoft 365')
    expect(ctx.status).toBe(true)
    expect(ctx.editData).toBe(null)
    expect(ctx.saveButtonDisabled).toBe(false)
    expect(ctx.formValues.allowedDomains).toEqual([])

    MailConfiguration.methods.handleAddMailConfiguration.call(ctx, 'EWS')
    expect(ctx.ewsStatus).toBe(true)
    expect(ctx.ewsEditData).toBe(null)
    expect(ctx.ewsFormValues.IsAllTargetGroupsSelected).toBe(true)
  })

  it('created loads initial resources when search permission exists', async () => {
    const ctx = {
      PERMISSIONS: { SEARCH: { hasPermission: true } },
      getTableData: jest.fn(),
      $router: { push: jest.fn() },
      exchangeVersions: [],
      targetGroupsList: [],
      defaultTargetGroupsList: []
    }

    MailConfiguration.created.call(ctx)
    await flushPromises()

    expect(ctx.getTableData).toHaveBeenCalled()
    expect(getExchangeVersions).toHaveBeenCalled()
    expect(getTargetGroups).toHaveBeenCalled()
  })

  it('created redirects when search permission is missing', async () => {
    const push = jest.fn()
    const ctx = {
      PERMISSIONS: { SEARCH: { hasPermission: false } },
      getTableData: jest.fn(),
      $router: { push },
      exchangeVersions: [],
      targetGroupsList: [],
      defaultTargetGroupsList: []
    }

    MailConfiguration.created.call(ctx)
    await flushPromises()

    expect(ctx.getTableData).not.toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/incident-responder')
    expect(getExchangeVersions).toHaveBeenCalled()
    expect(getTargetGroups).toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks navigation and opens related cancel flow', () => {
    const next = jest.fn()
    const ctx = {
      status: true,
      statusGoogleWorkSpace: false,
      ewsStatus: false,
      cancelO365: jest.fn(),
      cancelGoogleWorkSpace: jest.fn(),
      cancelEWS: jest.fn()
    }

    MailConfiguration.beforeRouteLeave.call(ctx, {}, {}, next)
    expect(ctx.cancelO365).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave blocks navigation for Google Workspace and EWS modals, otherwise continues', () => {
    const nextGws = jest.fn()
    const gwsCtx = {
      status: false,
      statusGoogleWorkSpace: true,
      ewsStatus: false,
      cancelO365: jest.fn(),
      cancelGoogleWorkSpace: jest.fn(),
      cancelEWS: jest.fn()
    }
    MailConfiguration.beforeRouteLeave.call(gwsCtx, {}, {}, nextGws)
    expect(gwsCtx.cancelGoogleWorkSpace).toHaveBeenCalled()
    expect(nextGws).toHaveBeenCalledWith(false)

    const nextEws = jest.fn()
    const ewsCtx = {
      status: false,
      statusGoogleWorkSpace: false,
      ewsStatus: true,
      cancelO365: jest.fn(),
      cancelGoogleWorkSpace: jest.fn(),
      cancelEWS: jest.fn()
    }
    MailConfiguration.beforeRouteLeave.call(ewsCtx, {}, {}, nextEws)
    expect(ewsCtx.cancelEWS).toHaveBeenCalled()
    expect(nextEws).toHaveBeenCalledWith(false)

    const nextFree = jest.fn()
    const freeCtx = {
      status: false,
      statusGoogleWorkSpace: false,
      ewsStatus: false,
      cancelO365: jest.fn(),
      cancelGoogleWorkSpace: jest.fn(),
      cancelEWS: jest.fn()
    }
    MailConfiguration.beforeRouteLeave.call(freeCtx, {}, {}, nextFree)
    expect(nextFree).toHaveBeenCalledWith()
  })

  it('afterSuccessCreateOrUpdateGoogleWorkSpace resets state and refreshes table', () => {
    const ctx = {
      statusGoogleWorkSpace: true,
      selectedGoogleWorkSpaceResourceId: 'g-1',
      resetGoogleWorkSpaceForm: jest.fn(),
      getTableData: jest.fn()
    }

    MailConfiguration.methods.afterSuccessCreateOrUpdateGoogleWorkSpace.call(ctx)

    expect(ctx.statusGoogleWorkSpace).toBe(false)
    expect(ctx.resetGoogleWorkSpaceForm).toHaveBeenCalled()
    expect(ctx.getTableData).toHaveBeenCalled()
    expect(ctx.selectedGoogleWorkSpaceResourceId).toBe('')
  })

  it('closeDeleteDialog clears dialog fields', () => {
    const ctx = {
      deleteDialog: true,
      deleteDialogName: 'Cfg',
      deleteDialogId: 'id-1'
    }

    MailConfiguration.methods.closeDeleteDialog.call(ctx)

    expect(ctx.deleteDialog).toBe(false)
    expect(ctx.deleteDialogName).toBe(null)
    expect(ctx.deleteDialogId).toBe(null)
  })

  it('getTableData maps records and toggles loading', async () => {
    const ctx = {
      loading: false,
      requestBody: {},
      tableData: [],
      serverSideProps: { totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 0 }
    }

    MailConfiguration.methods.getTableData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([{ resourceId: 'm1' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.loading).toBe(false)
  })
})
