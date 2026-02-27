import { shallowMount } from '@vue/test-utils'
import AttacksVectors from '@/components/EmailThreatSmulator/AttacksVectors.vue'
import * as EmailThreatSimulatorApi from '@/api/emailThreatSimlator'

jest.mock('@/api/emailThreatSimlator', () => ({
  getAttackVectorList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  getAttackVectorById: jest.fn(),
  exportAttacksVector: jest.fn(() => Promise.resolve({ size: 0, type: '' }))
}))

describe('AttacksVectors.vue', () => {
  const getEtsAttackVectorPermissionSearch = true
  const createWrapper = (getters = {}) =>
    shallowMount(AttacksVectors, {
      mocks: {
        $store: {
          getters: {
            'permissions/getEtsAttackVectorPermissionSearch': getEtsAttackVectorPermissionSearch,
            'permissions/getEtsAttackVectorPermissionUpdate': true,
            'permissions/getEtsAttackVectorPermissionEnableDisable': true,
            'permissions/getEtsAttackVectorPermissionDelete': true,
            'permissions/getEtsAttackVectorPermissionExport': true,
            'permissions/getEtsAttackVectorPermissionCreate': true,
            ...getters
          }
        }
      },
      stubs: {
        DataTable: true,
        NewAttackVector: true,
        DeleteAttackVector: true,
        ChangeStatusAttackVector: true,
        DefaultButtonRowAction: true,
        DefaultMenuRowAction: true,
        RowActionsMenu: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('mounted triggers language fetch and data fetch', () => {
    const callForLanguages = jest.fn()
    const callForData = jest.fn()
    const ctx = { callForLanguages, callForData }

    AttacksVectors.mounted.call(ctx)

    expect(callForLanguages).toHaveBeenCalledWith('refAttacksVectorList')
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('setStatusColor returns blue for default risk factor', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(4)).toContain('#1173C1')
  })

  it('setStatusColor returns blue for riskFactor 5', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(5)).toContain('#0198AC')
  })

  it('setStatusColor returns orange for riskFactor 6-7', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(6)).toContain('#B6791D')
    expect(wrapper.vm.setStatusColor(7)).toContain('#B6791D')
  })

  it('setStatusColor returns red for riskFactor >= 8', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(8)).toContain('#B83A3A')
    expect(wrapper.vm.setStatusColor(10)).toContain('#B83A3A')
  })

  it('changeNewAttackVectorModalStatus sets modal and clears edit state', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeNewAttackVectorModalStatus(false)
    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.attackVectorDetails).toEqual({})
  })

  it('changeNewAttackVectorModalStatus with restart clears selected row and refreshes', () => {
    const wrapper = createWrapper()
    wrapper.vm.selectedAttackVector = { id: 'x' }
    wrapper.vm.callForData = jest.fn()

    wrapper.vm.changeNewAttackVectorModalStatus(true, true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.selectedAttackVector).toEqual({})
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleActionDelete sets selectedAttackVector and opens delete modal', () => {
    const wrapper = createWrapper()
    const row = { pluginResourceId: 'p1', pluginName: 'Test' }
    wrapper.vm.handleActionDelete(row)
    expect(wrapper.vm.selectedAttackVector).toEqual(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('handleActionStatus sets selectedAttackVector and opens status modal', () => {
    const wrapper = createWrapper()
    const row = { pluginResourceId: 'p1', pluginName: 'Test' }
    wrapper.vm.handleActionStatus(row)
    expect(wrapper.vm.selectedAttackVector).toEqual(row)
    expect(wrapper.vm.showStatusModal).toBe(true)
  })

  it('handleSuccessDeleteAction and handleSuccessStatusAction close modal and refresh', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.showDeleteModal = true
    wrapper.vm.showStatusModal = true

    wrapper.vm.handleSuccessDeleteAction()
    wrapper.vm.handleSuccessStatusAction()

    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.showStatusModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalledTimes(2)
  })

  it('handleToggleRowSelection delegates to nested table ref when available', () => {
    const wrapper = createWrapper()
    const toggleRowSelection = jest.fn()
    wrapper.vm.$refs = {
      refAttacksVectorList: { $refs: { elTableRef: { toggleRowSelection } } }
    }

    wrapper.vm.handleToggleRowSelection({ id: 'row-1' })
    expect(toggleRowSelection).toHaveBeenCalledWith({ id: 'row-1' }, false)
  })

  it('handleToggleRowSelection is safe when nested refs are missing', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}

    expect(() => wrapper.vm.handleToggleRowSelection({ id: 'row-1' })).not.toThrow()
  })

  it('checkIfCanCLoseNewModal calls child close method when ref exists', () => {
    const wrapper = createWrapper()
    const closeAttackVectorPopup = jest.fn()
    wrapper.vm.$refs = { newAttackVectorModal: { closeAttackVectorPopup } }

    wrapper.vm.checkIfCanCLoseNewModal()
    expect(closeAttackVectorPopup).toHaveBeenCalled()
  })

  it('checkIfCanCLoseNewModal is safe when modal ref does not exist', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}

    expect(() => wrapper.vm.checkIfCanCLoseNewModal()).not.toThrow()
  })

  it('toggleShowPreviewDialog toggles state and clears selectedAttackVector when closing', () => {
    const wrapper = createWrapper()
    wrapper.vm.isShowPreviewDialog = true
    wrapper.vm.selectedAttackVector = { id: 'x' }

    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.selectedAttackVector).toEqual({})
    expect(wrapper.vm.isShowPreviewDialog).toBe(false)

    wrapper.vm.toggleShowPreviewDialog()
    expect(wrapper.vm.isShowPreviewDialog).toBe(true)
  })

  it('handleEditAttackVector loads details and opens modal', async () => {
    EmailThreatSimulatorApi.getAttackVectorById.mockResolvedValueOnce({
      data: { data: { pluginResourceId: 'p1', pluginName: 'Edit Row' } }
    })
    const wrapper = createWrapper()

    wrapper.vm.handleEditAttackVector({ pluginResourceId: 'p1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(EmailThreatSimulatorApi.getAttackVectorById).toHaveBeenCalledWith('p1')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.attackVectorDetails).toEqual({
      pluginResourceId: 'p1',
      pluginName: 'Edit Row'
    })
    expect(wrapper.vm.modalStatus).toBe(true)
  })

  it('handleEditAttackVector sets selectedAttackVector immediately before API resolve', () => {
    let resolveRequest
    EmailThreatSimulatorApi.getAttackVectorById.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        })
    )
    const wrapper = createWrapper()
    const row = { pluginResourceId: 'p-sync', pluginName: 'Sync' }

    wrapper.vm.handleEditAttackVector(row)
    expect(wrapper.vm.selectedAttackVector).toEqual(row)

    resolveRequest({ data: { data: {} } })
  })

  it('callForData maps isActive and updates server-side props', async () => {
    EmailThreatSimulatorApi.getAttackVectorList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            { pluginResourceId: '1', isActive: true },
            { pluginResourceId: '2', isActive: false }
          ]
        }
      }
    })
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: true,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      serverSideProps: {},
      tableData: [],
      $router: { push: jest.fn() }
    }

    AttacksVectors.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0].isActive).toBe('Active')
    expect(ctx.tableData[1].isActive).toBe('Passive')
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData catches API error and clears table data', async () => {
    EmailThreatSimulatorApi.getAttackVectorList.mockRejectedValueOnce(new Error('failed'))
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: true,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      serverSideProps: {},
      tableData: [{ id: 'old' }],
      $router: { push: jest.fn() }
    }

    AttacksVectors.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData).toEqual([])
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData falls back to empty array when results is missing', async () => {
    EmailThreatSimulatorApi.getAttackVectorList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: true,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      serverSideProps: {},
      tableData: [{ id: 'old' }],
      $router: { push: jest.fn() }
    }

    AttacksVectors.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData).toEqual([])
    expect(ctx.isLoading).toBe(false)
  })

  it('callForData redirects home when search permission is missing', () => {
    const ctx = {
      isLoading: false,
      getEtsAttackVectorPermissionSearch: false,
      $router: { push: jest.fn() }
    }

    AttacksVectors.methods.callForData.call(ctx)

    expect(ctx.$router.push).toHaveBeenCalledWith('/')
  })

  it('exportTableData creates download links only for Blob responses', async () => {
    EmailThreatSimulatorApi.exportAttacksVector
      .mockResolvedValueOnce({ data: new Blob(['x']) })
      .mockResolvedValueOnce({ data: 'invalid' })
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockReturnValue('blob:attack')
    const click = jest.fn()
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ href: '', download: '', click })

    const initialCreateObjectURLCalls = createObjectURLSpy.mock.calls.length
    const initialClickCalls = click.mock.calls.length

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } }
    }
    AttacksVectors.methods.exportTableData.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(EmailThreatSimulatorApi.exportAttacksVector).toHaveBeenCalledTimes(2)
    expect(createObjectURLSpy.mock.calls.length - initialCreateObjectURLCalls).toBe(1)
    expect(click.mock.calls.length - initialClickCalls).toBe(1)
    expect(EmailThreatSimulatorApi.exportAttacksVector).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true })
    )
    expect(EmailThreatSimulatorApi.exportAttacksVector).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV', reportAllPages: true })
    )
    createObjectURLSpy.mockRestore()
    createElementSpy.mockRestore()
  })

  it('exportTableData maps XLS to xlsx filename and CSV to csv filename', async () => {
    EmailThreatSimulatorApi.exportAttacksVector
      .mockResolvedValueOnce({ data: new Blob(['x']) })
      .mockResolvedValueOnce({ data: new Blob(['y']) })
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockReturnValue('blob:attack')
    const links = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = { href: '', download: '', click: jest.fn() }
      links.push(link)
      return link
    })

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } }
    }
    AttacksVectors.methods.exportTableData.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: false,
      pageNumber: 2,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(links[0].download).toBe('AttacksVector.xlsx')
    expect(links[1].download).toBe('AttacksVector.csv')
    expect(links[0].click).toHaveBeenCalled()
    expect(links[1].click).toHaveBeenCalled()

    createObjectURLSpy.mockRestore()
    createElementSpy.mockRestore()
  })
})
