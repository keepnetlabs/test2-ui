import { shallowMount } from '@vue/test-utils'
import VishingCampaignManager from '@/views/VishingCampaignManager.vue'
import { getStatusBadgeProps as getStatusBadgePropsUtil } from '@/components/VishingCampaignManager/utils'

jest.mock('@/api/vishing', () => ({
  getVishingCampaigns: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 12,
          totalNumberOfPages: 3,
          pageNumber: 2,
          results: [{ resourceId: 'c1', status: 'Running' }]
        }
      }
    })
  ),
  exportVishingCampaigns: jest.fn(() =>
    Promise.resolve({
      data: new (globalThis.Blob || global.Blob)(['x'], { type: 'application/octet-stream' })
    })
  ),
  getVishingTemplateLanguages: jest.fn(() =>
    Promise.resolve({ data: { data: [{ language: 'English', code: 'en' }] } })
  )
}))

const {
  getVishingCampaigns,
  exportVishingCampaigns,
  getVishingTemplateLanguages
} = require('@/api/vishing')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('VishingCampaignManager.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(VishingCampaignManager, {
      stubs: {
        KContainer: true,
        VishingTemplatePreview: true,
        VishingCampaignStopDialog: true,
        VishingCampaignLaunchDialog: true,
        DeleteVishingCampaignDialog: true,
        VishingCampaignModal: true,
        DataTable: true,
        DefaultButtonRowAction: true,
        RowActionsMenu: true,
        DefaultMenuRowAction: true,
        Badge: true
      },
      mocks: {
        $router: { push: jest.fn() },
        $store: {
          getters: {
            'permissions/getVishingCampaignManagerSearchPermissions': true,
            'permissions/getVishingCampaignManagerLaunchPermissions': true,
            'permissions/getVishingCampaignManagerPreviewPermissions': true,
            'permissions/getVishingCampaignManagerEditPermissions': true,
            'permissions/getVishingCampaignManagerCreatePermissions': true,
            'permissions/getVishingCampaignManagerDeletePermissions': true,
            'permissions/getVishingReportsSummaryPermissions': true,
            'permissions/getVishingCampaignManagerStopPermissions': true,
            'permissions/getVishingCampaignManagerExportPermissions': true
          }
        },
        ...(overrides.mocks || {})
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mounted loads campaign list and languages', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(getVishingTemplateLanguages).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toEqual([{ resourceId: 'c1', status: 'Running' }])
    expect(wrapper.vm.languages).toEqual([{ language: 'English', code: 'en' }])
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(12)
    expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(3)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(2)
  })

  it('callForLanguages falls back to empty array when api payload is missing', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ languages: [{ language: 'old', code: 'old' }] })
    getVishingTemplateLanguages.mockResolvedValueOnce({ data: {} })

    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languages).toEqual([])
  })

  it('redirects home when search permission is missing', () => {
    const wrapper = createWrapper({
      mocks: {
        $store: {
          getters: {
            'permissions/getVishingCampaignManagerSearchPermissions': false
          }
        }
      }
    })

    wrapper.vm.callForData()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('handles launch/stop/preview toggle flows and row selection', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'r1', status: 'Running' }

    wrapper.vm.handleLaunch(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)
    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)

    wrapper.vm.handleStop(row)
    expect(wrapper.vm.isShowStopDialog).toBe(true)
    wrapper.vm.toggleShowStopDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowStopDialog).toBe(false)

    wrapper.vm.handlePreview(row)
    expect(wrapper.vm.isPreviewVisible).toBe(true)
    wrapper.vm.onToggleShowPreviewModal()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isPreviewVisible).toBe(false)
  })

  it('handles edit/delete modals and close handlers', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'e1' }

    wrapper.vm.handleEdit(row, false)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.isCampaignModalVisible).toBe(true)

    wrapper.vm.handleCloseCampaignModal()
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)

    wrapper.vm.handleDelete(row)
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
    wrapper.vm.handleCloseDeleteModal()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('builds multiple delete payload and selected row count', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      serverSideProps: { totalNumberOfRecords: 99 },
      axiosPayload: { filter: { any: 'f' } }
    })

    wrapper.vm.handleMultipleDelete([{ companyResourceId: 'a' }, { companyResourceId: 'b' }], ['x'], false)
    expect(wrapper.vm.multipleDeletePayload).toEqual(
      expect.objectContaining({
        items: ['a', 'b'],
        excludedItems: ['x'],
        selectAll: false
      })
    )
    expect(wrapper.vm.multipleDeletePayload.filter.any).toBe('f')
    expect(wrapper.vm.selectedRowCount).toBe(2)
    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)

    wrapper.vm.handleCloseDeleteModal()
    wrapper.vm.handleMultipleDelete([], ['y'], true)
    expect(wrapper.vm.multipleDeletePayload.items).toEqual([])
    expect(wrapper.vm.selectedRowCount).toBe(99)
  })

  it('exports campaigns and maps XLS to Excel/xlsx', async () => {
    const click = jest.fn()
    if (!window.URL) {
      window.URL = {}
    }
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn(() => 'blob:default')
    }
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:fake')
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    const createObjectURLCallCountBefore = createObjectURLSpy.mock.calls.length

    try {
      await wrapper.vm.exportVishingCampaigns({
        exportTypes: ['XLS', 'CSV'],
        reportAllPages: true,
        pageNumber: 1,
        pageSize: 25
      })
      await flushPromises()

      expect(exportVishingCampaigns).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ exportType: 'Excel' })
      )
      expect(exportVishingCampaigns).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ exportType: 'CSV' })
      )
      expect(click).toHaveBeenCalledTimes(2)
      expect(createObjectURLSpy.mock.calls.length - createObjectURLCallCountBefore).toBe(2)
    } finally {
      createObjectURLSpy.mockRestore()
      createElementSpy.mockRestore()
    }
  })

  it('handles report navigation and campaign modal close check', () => {
    const wrapper = createWrapper()
    const changeVishingCampaignModalStatus = jest.fn()
    wrapper.vm.$refs.refVishingCampaignModal = { changeVishingCampaignModalStatus, status: true }

    wrapper.vm.handleViewReport({ resourceId: 'report-1' })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Vishing Report',
      params: { id: 'report-1' }
    })

    wrapper.vm.checkIfCanCloseVishingTemplateModal()
    expect(changeVishingCampaignModalStatus).toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks when vishing modal is open and allows otherwise', () => {
    const wrapper = createWrapper()
    const next = jest.fn()
    const changeVishingCampaignModalStatus = jest.fn()

    wrapper.vm.$refs.refVishingCampaignModal = { status: true, changeVishingCampaignModalStatus }
    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(changeVishingCampaignModalStatus).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    wrapper.vm.$refs.refVishingCampaignModal = { status: false, changeVishingCampaignModalStatus }
    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave allows navigation when modal ref is missing', () => {
    const wrapper = createWrapper()
    const next = jest.fn()
    wrapper.vm.$refs = {}

    wrapper.vm.$options.beforeRouteLeave.call(wrapper.vm, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('forceUpdate branches trigger callForData in launch/stop toggles and close handlers', () => {
    const wrapper = createWrapper()
    const callForDataSpy = jest.spyOn(wrapper.vm, 'callForData').mockImplementation(() => {})

    wrapper.vm.toggleShowLaunchDialog(true)
    expect(callForDataSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    wrapper.vm.toggleShowStopDialog(true)
    expect(callForDataSpy).toHaveBeenCalledTimes(2)
    expect(wrapper.vm.isShowStopDialog).toBe(true)

    wrapper.vm.handleCloseDeleteModal(true)
    expect(callForDataSpy).toHaveBeenCalledTimes(3)
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)

    wrapper.vm.handleCloseCampaignModal(true)
    expect(callForDataSpy).toHaveBeenCalledTimes(4)
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)

    callForDataSpy.mockRestore()
  })

  it('delete modal toggle resets selected row and multiple flag on close', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      isDeleteModalVisible: true,
      selectedRow: { resourceId: 'row-1' },
      isMultipleDelete: true
    })

    wrapper.vm.onToggleShowDeleteModal()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isMultipleDelete).toBe(false)
  })

  it('handles duplicate edit mode and status badge passthrough', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'dup-1' }

    wrapper.vm.handleEdit(row, true)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.isCampaignModalVisible).toBe(true)

    expect(wrapper.vm.getStatusBadgeProps('Running')).toEqual(getStatusBadgePropsUtil('Running'))
  })

  it('checkIfCanCloseVishingTemplateModal safely handles missing ref', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}

    expect(() => wrapper.vm.checkIfCanCloseVishingTemplateModal()).not.toThrow()
  })
})
