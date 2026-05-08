/**
 * Integration: VishingCampaignManager wires API, permissions, and VishingTemplatePreview
 * (real child) for the campaign preview drawer flow.
 */
jest.mock('@/api/vishing', () => ({
  getVishingCampaigns: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: []
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
    Promise.resolve({
      data: {
        data: [
          {
            resourceId: 'lang-1',
            language: 'English',
            name: 'Voice 1',
            voiceProviderTypeId: 2
          }
        ]
      }
    })
  ),
  getVishingCampaignPreview: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Integrated Campaign',
          steps: [],
          vishingLanguageResourceId: 'lang-1'
        }
      }
    })
  ),
  getVishingTemplatePreview: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  launchVishingCampaign: jest.fn(() => Promise.resolve()),
  stopVishingCampaign: jest.fn(() => Promise.resolve()),
  deleteVishingCampaign: jest.fn(() => Promise.resolve())
}))

import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingCampaignManager from '@/views/VishingCampaignManager.vue'
import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview.vue'
import VishingCampaignLaunchDialog from '@/components/VishingCampaignManager/VishingCampaignLaunchDialog.vue'
import VishingCampaignStopDialog from '@/components/VishingCampaignManager/VishingCampaignStopDialog.vue'
import DeleteVishingCampaignDialog from '@/components/VishingCampaignManager/DeleteVishingCampaignDialog.vue'

const vishingCampaignModalRefStub = {
  name: 'VishingCampaignModal',
  template: '<div class="vishing-campaign-modal-stub" />',
  data() {
    return { status: true }
  },
  methods: {
    changeVishingCampaignModalStatus() {
      this.status = false
    }
  }
}

/** Stubs mirror real dialog $emit names wired in VishingCampaignManager.vue */
const vishingCampaignModalCancelEmitStub = {
  VishingCampaignModal: {
    name: 'VishingCampaignModal',
    props: ['status', 'selectedRow', 'isEdit', 'isDuplicate', 'languages'],
    template: `
      <div class="vishing-campaign-modal-cancel-stub">
        <button type="button" class="btn-campaign-modal-cancel" @click="$emit('cancel')">cancel</button>
        <button type="button" class="btn-campaign-modal-cancel-refresh" @click="$emit('cancel', true)">refresh</button>
      </div>
    `
  }
}

const vishingCampaignActionDialogStubs = {
  VishingCampaignLaunchDialog: {
    name: 'VishingCampaignLaunchDialog',
    props: ['status', 'selectedRow'],
    template: `
      <div class="vishing-launch-dialog-stub">
        <button type="button" class="btn-launch-cancel" @click="$emit('on-cancel')">cancel</button>
        <button type="button" class="btn-launch-cancel-refresh" @click="$emit('on-cancel', true)">refresh</button>
      </div>
    `
  },
  VishingCampaignStopDialog: {
    name: 'VishingCampaignStopDialog',
    props: ['status', 'selectedRow'],
    template: `
      <div class="vishing-stop-dialog-stub">
        <button type="button" class="btn-stop-cancel" @click="$emit('on-cancel')">cancel</button>
        <button type="button" class="btn-stop-cancel-refresh" @click="$emit('on-cancel', true)">refresh</button>
      </div>
    `
  },
  DeleteVishingCampaignDialog: {
    name: 'DeleteVishingCampaignDialog',
    props: ['status', 'selectedRow', 'selectedRowCount', 'isMultiple'],
    template: `
      <div class="vishing-delete-campaign-dialog-stub">
        <button type="button" class="btn-delete-cancel" @click="$emit('onCancel')">cancel</button>
        <button type="button" class="btn-delete-cancel-refresh" @click="$emit('onCancel', true)">refresh</button>
      </div>
    `
  }
}

const {
  getVishingCampaignPreview,
  getVishingTemplateLanguages,
  exportVishingCampaigns,
  getVishingCampaigns,
  launchVishingCampaign,
  stopVishingCampaign,
  deleteVishingCampaign
} = require('@/api/vishing')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const appDialogDeleteShellStub = {
  name: 'AppDialog',
  props: ['status'],
  template: `
    <div class="app-dialog-delete-shell-stub" v-show="status">
      <slot name="app-dialog-body" />
      <slot name="app-dialog-footer" />
    </div>
  `
}

const appDialogFooterConfirmStub = {
  name: 'AppDialogFooter',
  template: `
    <div class="app-dialog-footer-stub">
      <button type="button" class="btn-dialog-confirm" @click="$emit('handleConfirm')">confirm</button>
    </div>
  `
}

const permissionGetters = {
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

function createWrapper(getterOverrides = {}, stubOverrides = {}) {
  const vuetify = new Vuetify()
  return mount(VishingCampaignManager, {
    vuetify,
    stubs: {
      KContainer: { template: '<div class="k-container-stub"><slot /></div>' },
      DataTable: { template: '<div class="data-table-stub" />' },
      VishingCampaignStopDialog: true,
      VishingCampaignLaunchDialog: true,
      DeleteVishingCampaignDialog: true,
      VishingCampaignModal: true,
      VishingTemplatePreviewSteps: { template: '<span class="preview-steps-stub" />' },
      ...stubOverrides
    },
    mocks: {
      $router: { push: jest.fn() },
      $store: {
        getters: { ...permissionGetters, ...getterOverrides }
      }
    }
  })
}

function createWrapperWithRealDeleteCampaignDialog(getterOverrides = {}) {
  return createWrapper(getterOverrides, {
    DeleteVishingCampaignDialog: false,
    AppDialog: appDialogDeleteShellStub,
    AppDialogFooter: appDialogFooterConfirmStub
  })
}

function createWrapperWithRealLaunchDialog(getterOverrides = {}) {
  return createWrapper(getterOverrides, {
    VishingCampaignLaunchDialog: false,
    AppDialog: appDialogDeleteShellStub,
    AppDialogFooter: appDialogFooterConfirmStub
  })
}

function createWrapperWithRealStopDialog(getterOverrides = {}) {
  return createWrapper(getterOverrides, {
    VishingCampaignStopDialog: false,
    AppDialog: appDialogDeleteShellStub,
    AppDialogFooter: appDialogFooterConfirmStub
  })
}

describe('VishingCampaignManager + VishingTemplatePreview integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('opens real preview child, loads campaign preview from API, and maps language from store', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(getVishingTemplateLanguages).toHaveBeenCalled()
    expect(wrapper.vm.languages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ resourceId: 'lang-1', language: 'English' })
      ])
    )

    const row = { resourceId: 'camp-1', name: 'Row Campaign', status: 'Completed' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual(row)

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.exists()).toBe(true)
    expect(preview.props('isCampaign')).toBe(true)
    expect(preview.props('status')).toBe(true)
    expect(preview.props('selectedRow')).toEqual(row)

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingCampaignPreview).toHaveBeenCalledWith('camp-1')
    expect(preview.vm.templateData).toEqual(
      expect.objectContaining({
        name: 'Integrated Campaign',
        language: 'English',
        voice: 'Voice 1'
      })
    )
    expect(wrapper.text()).toContain('Vishing Campaign Preview')
    expect(wrapper.text()).toContain('Row Campaign')
  })

  it('preview child clears loading and leaves template empty when getVishingCampaignPreview rejects', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    getVishingCampaignPreview.mockRejectedValueOnce(new Error('preview unavailable'))

    const row = { resourceId: 'camp-preview-fail', name: 'Broken Preview', status: 'Running' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(preview.exists()).toBe(true)
    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(getVishingCampaignPreview).toHaveBeenCalledWith('camp-preview-fail')
    expect(preview.vm.isLoading).toBe(false)
    expect(preview.vm.templateData).toBeNull()
  })

  it('preview closeDrawer notifies parent so preview hides and selection clears', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = { resourceId: 'camp-2', name: 'Close Me', status: 'Completed' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    await flushPromises()
    await wrapper.vm.$nextTick()

    jest.useFakeTimers()
    preview.vm.handleClose()
    jest.advanceTimersByTime(260)
    jest.useRealTimers()

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('handlePreviewEdit closes preview and opens campaign modal in edit mode', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = { resourceId: 'camp-edit', name: 'Edit Camp', status: 'Scheduled' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(VishingTemplatePreview).exists()).toBe(true)

    wrapper.vm.handlePreviewEdit()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.isCampaignModalVisible).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedRow).toEqual(row)
  })

  it('handlePreviewDuplicate closes preview and opens campaign modal in duplicate mode', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = { resourceId: 'camp-dup', name: 'Dup Camp', status: 'Running' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreviewDuplicate()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.isCampaignModalVisible).toBe(true)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual(row)
  })
})

describe('VishingCampaignManager preview props to VishingTemplatePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('passes show edit and duplicate for Scheduled with actions enabled when permitted', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const row = { resourceId: 'sch-1', name: 'Sch', status: 'Scheduled' }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(true)
    expect(preview.props('showDuplicateButton')).toBe(true)
    expect(preview.props('editDisabled')).toBe(false)
    expect(preview.props('duplicateDisabled')).toBe(false)
  })

  it('passes show edit for Idle same as Scheduled', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'idle-1', name: 'I', status: 'Idle' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(true)
    expect(preview.props('showDuplicateButton')).toBe(true)
  })

  it('hides edit but keeps duplicate for Running', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'run-1', name: 'R', status: 'Running' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(false)
    expect(preview.props('showDuplicateButton')).toBe(true)
  })

  it('hides edit and duplicate for Completed', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'done-1', name: 'D', status: 'Completed' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(false)
    expect(preview.props('showDuplicateButton')).toBe(false)
  })

  it('hides edit and duplicate for Cancelled', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'can-1', name: 'C', status: 'Cancelled' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(false)
    expect(preview.props('showDuplicateButton')).toBe(false)
  })

  it('hides edit and duplicate for Error', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'err-1', name: 'E', status: 'Error' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(false)
    expect(preview.props('showDuplicateButton')).toBe(false)
  })

  it('passes disabled flags when edit/create permissions are denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingCampaignManagerEditPermissions': false,
      'permissions/getVishingCampaignManagerCreatePermissions': false
    })
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'x', name: 'X', status: 'Scheduled' })
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(true)
    expect(preview.props('duplicateDisabled')).toBe(true)
  })

  it('child handleEdit does not open campaign modal when editDisabled from permissions', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingCampaignManagerEditPermissions': false,
      'permissions/getVishingCampaignManagerCreatePermissions': true
    })
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'guard-edit', name: 'G', status: 'Scheduled' })
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(true)
    preview.vm.handleEdit()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
  })

  it('child handleDuplicate does not open campaign modal when duplicateDisabled from permissions', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingCampaignManagerEditPermissions': true,
      'permissions/getVishingCampaignManagerCreatePermissions': false
    })
    await flushPromises()
    wrapper.vm.handlePreview({ resourceId: 'guard-dup', name: 'G2', status: 'Scheduled' })
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('duplicateDisabled')).toBe(true)
    preview.vm.handleDuplicate()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
  })
})

describe('VishingCampaignManager row actions, navigation, and export', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('handleLaunch and toggleShowLaunchDialog manage selected row and dialog flag', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const row = { resourceId: 'l1', status: 'Scheduled' }

    wrapper.vm.handleLaunch(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    wrapper.vm.toggleShowLaunchDialog()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('handleStop opens stop dialog and toggle clears selection', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 's1', status: 'Running' }

    wrapper.vm.handleStop(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowStopDialog).toBe(true)

    wrapper.vm.toggleShowStopDialog()
    expect(wrapper.vm.isShowStopDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('handleDelete opens delete modal with selected row', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'd1' }

    wrapper.vm.handleDelete(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('handleViewReport navigates to vishing report route', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'rep-1' }

    wrapper.vm.handleViewReport(row)

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Vishing Report',
      params: { id: 'rep-1' }
    })
  })

  it('handleEdit sets isEdit vs isDuplicate from second argument', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'h1', name: 'C1' }

    wrapper.vm.handleEdit(row, false)
    expect(wrapper.vm.isCampaignModalVisible).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedRow).toEqual(row)

    wrapper.vm.handleEdit(row, true)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual(row)
  })

  it('handleCloseCampaignModal resets modal and selection state', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      isCampaignModalVisible: true,
      selectedRow: { resourceId: 'x' },
      isEdit: true,
      isDuplicate: true
    })

    wrapper.vm.handleCloseCampaignModal()

    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
  })

  it('mounted callForData redirects home when search permission is denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingCampaignManagerSearchPermissions': false
    })
    await flushPromises()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('exportVishingCampaigns requests export and triggers download anchor', async () => {
    const click = jest.fn()
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:test')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingCampaigns({
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 25
    })
    await flushPromises()

    expect(exportVishingCampaigns).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()

    document.createElement.mockRestore()
  })

  it('exportVishingCampaigns maps XLS to Excel payload and xlsx download name', async () => {
    const anchor = { click: jest.fn(), href: '', download: '' }
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:campaign-xls')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return anchor
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingCampaigns({
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 25
    })
    await flushPromises()

    expect(exportVishingCampaigns).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(anchor.download).toBe('Vishing-Campaigns.xlsx')
    expect(anchor.click).toHaveBeenCalled()

    document.createElement.mockRestore()
  })

  it('exportVishingCampaigns uses pdf download suffix for PDF export', async () => {
    const anchor = { click: jest.fn(), href: '', download: '' }
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:campaign-pdf')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return anchor
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingCampaigns({
      exportTypes: ['PDF'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 25
    })
    await flushPromises()

    expect(exportVishingCampaigns).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(anchor.download).toBe('Vishing-Campaigns.pdf')
    expect(anchor.click).toHaveBeenCalled()

    document.createElement.mockRestore()
  })

  it('callForData refreshes list when search is allowed', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.callForData()
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handleMultipleDelete builds company ids payload and toggles delete modal', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      serverSideProps: { totalNumberOfRecords: 40 },
      axiosPayload: { filter: { tag: 'x' } }
    })

    wrapper.vm.handleMultipleDelete(
      [{ companyResourceId: 'co-1' }, { companyResourceId: 'co-2' }],
      ['ex'],
      false
    )

    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.selectedRowCount).toBe(2)
    expect(wrapper.vm.multipleDeletePayload).toEqual(
      expect.objectContaining({
        items: ['co-1', 'co-2'],
        excludedItems: ['ex'],
        selectAll: false
      })
    )
    expect(wrapper.vm.multipleDeletePayload.filter.tag).toBe('x')
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('handleMultipleDelete with selectAll uses empty items and total record count', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      serverSideProps: { totalNumberOfRecords: 999 },
      axiosPayload: { filter: {} }
    })

    wrapper.vm.handleMultipleDelete([], ['e1'], true)

    expect(wrapper.vm.multipleDeletePayload.items).toEqual([])
    expect(wrapper.vm.multipleDeletePayload.selectAll).toBe(true)
    expect(wrapper.vm.selectedRowCount).toBe(999)
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('handleCloseDeleteModal resets delete state', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      isDeleteModalVisible: true,
      isMultipleDelete: true,
      selectedRow: { resourceId: 'z' }
    })

    wrapper.vm.handleCloseDeleteModal()

    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.isMultipleDelete).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('handleCloseDeleteModal with forceUpdate refreshes campaigns', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.setData({ isDeleteModalVisible: true })
    wrapper.vm.handleCloseDeleteModal(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('handleCloseDeleteModal without forceUpdate does not refresh campaigns', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.setData({
      isDeleteModalVisible: true,
      isMultipleDelete: true,
      selectedRow: { resourceId: 'z' }
    })
    wrapper.vm.handleCloseDeleteModal()
    await flushPromises()

    expect(getVishingCampaigns).not.toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
  })

  it('toggleShowLaunchDialog(true) calls callForData when opening from closed state', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    jest.clearAllMocks()

    wrapper.vm.toggleShowLaunchDialog(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)
  })

  it('toggleShowStopDialog(true) calls callForData when opening from closed state', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.isShowStopDialog).toBe(false)
    jest.clearAllMocks()

    wrapper.vm.toggleShowStopDialog(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowStopDialog).toBe(true)
  })

  it('toggleShowLaunchDialog(false) does not call callForData when opening from closed state', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.toggleShowLaunchDialog(false)
    await flushPromises()

    expect(getVishingCampaigns).not.toHaveBeenCalled()
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)
  })

  it('toggleShowStopDialog(false) does not call callForData when opening from closed state', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.toggleShowStopDialog(false)
    await flushPromises()

    expect(getVishingCampaigns).not.toHaveBeenCalled()
    expect(wrapper.vm.isShowStopDialog).toBe(true)
  })

  it('handleCloseCampaignModal with forceUpdate refreshes campaigns', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.handleCloseCampaignModal(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('handleCloseCampaignModal without forceUpdate does not refresh campaigns', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()
    wrapper.setData({
      isCampaignModalVisible: true,
      selectedRow: { resourceId: 'm' },
      isEdit: true
    })

    wrapper.vm.handleCloseCampaignModal()
    await flushPromises()

    expect(getVishingCampaigns).not.toHaveBeenCalled()
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
  })

  it('toggleShowLaunchDialog with forceUpdate calls callForData while closing', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handleLaunch({ resourceId: 'x', status: 'Scheduled' })
    expect(wrapper.vm.isShowLaunchDialog).toBe(true)

    jest.clearAllMocks()
    wrapper.vm.toggleShowLaunchDialog(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
  })

  it('toggleShowStopDialog with forceUpdate calls callForData while closing', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.handleStop({ resourceId: 'y', status: 'Running' })
    expect(wrapper.vm.isShowStopDialog).toBe(true)

    jest.clearAllMocks()
    wrapper.vm.toggleShowStopDialog(true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowStopDialog).toBe(false)
  })

  it('callForLanguages sets empty languages when API payload has no data', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    getVishingTemplateLanguages.mockResolvedValueOnce({ data: {} })

    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languages).toEqual([])
  })

  it('callForLanguages sets empty languages when API returns empty data array', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({ languages: [{ resourceId: 'lang-1', language: 'Stale' }] })
    getVishingTemplateLanguages.mockResolvedValueOnce({ data: { data: [] } })

    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languages).toEqual([])
  })

  it('callForLanguages sets empty languages when API rejects', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    getVishingTemplateLanguages.mockRejectedValueOnce(new Error('network'))
    wrapper.setData({ languages: [{ resourceId: 'lang-1', language: 'Stale' }] })

    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languages).toEqual([])
  })

  it('beforeRouteLeave allows navigation when campaign modal ref is absent', () => {
    const next = jest.fn()
    VishingCampaignManager.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave allows navigation when campaign modal ref exists but status is falsy', () => {
    const next = jest.fn()
    const mockModal = { status: false, changeVishingCampaignModalStatus: jest.fn() }
    VishingCampaignManager.beforeRouteLeave.call(
      { $refs: { refVishingCampaignModal: mockModal } },
      {},
      {},
      next
    )
    expect(next).toHaveBeenCalledWith()
    expect(mockModal.changeVishingCampaignModalStatus).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks when open modal reports status and invokes close', async () => {
    const wrapper = createWrapper({}, { VishingCampaignModal: vishingCampaignModalRefStub })
    await flushPromises()
    wrapper.setData({ isCampaignModalVisible: true })
    await wrapper.vm.$nextTick()

    const next = jest.fn()
    const modalVm = wrapper.vm.$refs.refVishingCampaignModal
    expect(modalVm.status).toBe(true)

    VishingCampaignManager.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(next).toHaveBeenCalledWith(false)
    expect(modalVm.status).toBe(false)
  })

  it('checkIfCanCloseVishingTemplateModal delegates to campaign modal ref when present', async () => {
    const wrapper = createWrapper({}, { VishingCampaignModal: vishingCampaignModalRefStub })
    await flushPromises()
    wrapper.setData({ isCampaignModalVisible: true })
    await wrapper.vm.$nextTick()

    const spy = jest.spyOn(wrapper.vm.$refs.refVishingCampaignModal, 'changeVishingCampaignModalStatus')
    wrapper.vm.checkIfCanCloseVishingTemplateModal()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('checkIfCanCloseVishingTemplateModal is a no-op when campaign modal ref is absent', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$refs.refVishingCampaignModal).toBeUndefined()
    expect(() => wrapper.vm.checkIfCanCloseVishingTemplateModal()).not.toThrow()
  })

  it('isPreviewEditButtonVisible and isPreviewDuplicateButtonVisible are falsy without selectedRow', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedRow: null })
    expect(wrapper.vm.isPreviewEditButtonVisible).toBeFalsy()
    expect(wrapper.vm.isPreviewDuplicateButtonVisible).toBeFalsy()
  })

  it('getStatusBadgeProps delegates to campaign manager util for known statuses', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getStatusBadgeProps('Completed')).toEqual({
      color: '#217124',
      text: 'Completed'
    })
    expect(wrapper.vm.getStatusBadgeProps('Running')).toEqual({
      color: '#1173C1',
      text: 'Running'
    })
    expect(wrapper.vm.getStatusBadgeProps('Idle')).toEqual({
      color: '#0198AC',
      text: 'Idle'
    })
    expect(wrapper.vm.getStatusBadgeProps('Scheduled')).toEqual({
      color: '#757575',
      text: 'Scheduled'
    })
    expect(wrapper.vm.getStatusBadgeProps('Cancelled')).toEqual({
      color: '#B83A3A',
      text: 'Cancelled'
    })
    expect(wrapper.vm.getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
    expect(wrapper.vm.getStatusBadgeProps('UnknownStatus')).toBeUndefined()
  })
})

describe('VishingCampaignManager server-side table (useDefaultTableFunctions)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('serverSidePageNumberChanged updates payload page and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.serverSidePageNumberChanged(4)
    await flushPromises()

    expect(wrapper.vm.axiosPayload.pageNumber).toBe(4)
    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('serverSideSizeChanged updates page size, resets page number, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      axiosPayload: { ...wrapper.vm.axiosPayload, pageNumber: 3 },
      serverSideProps: { ...wrapper.vm.serverSideProps, pageNumber: 3, pageSize: 10 }
    })
    jest.clearAllMocks()

    wrapper.vm.serverSideSizeChanged(50)
    await flushPromises()

    expect(wrapper.vm.axiosPayload.pageSize).toBe(50)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(50)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('sortChanged updates order, direction, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'Name' })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.ascending).toBe(true)
    expect(wrapper.vm.axiosPayload.orderBy).toBe('Name')
    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('handleSearchChange normalizes search group, search text, resets page, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      axiosPayload: { ...wrapper.vm.axiosPayload, pageNumber: 5 },
      serverSideProps: { ...wrapper.vm.serverSideProps, pageNumber: 5 }
    })
    jest.clearAllMocks()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '5' }]
          }
        ],
        SearchInputTextValue: 'acme'
      }
    })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe('acme')
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '5' }
    ])
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('columnFilterChanged merges column filter into group 0 and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.columnFilterChanged({ FieldName: 'status', Value: 'Running', Operator: '=' })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ FieldName: 'status', Value: 'Running', Operator: '=' })
      ])
    )
    expect(getVishingCampaigns).toHaveBeenCalled()
  })

  it('columnFilterCleared removes filter for field and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      axiosPayload: {
        ...wrapper.vm.axiosPayload,
        filter: {
          ...wrapper.vm.axiosPayload.filter,
          FilterGroups: [
            {
              Condition: 'AND',
              FilterGroups: [],
              FilterItems: [{ FieldName: 'status', Value: 'Idle', Operator: '=' }]
            },
            { ...wrapper.vm.axiosPayload.filter.FilterGroups[1] }
          ]
        }
      }
    })
    jest.clearAllMocks()

    wrapper.vm.columnFilterCleared('status')
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(getVishingCampaigns).toHaveBeenCalled()
  })
})

describe('VishingCampaignManager action dialogs (parent wire-up)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('launch dialog on-cancel closes and clears selection', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    const row = { resourceId: 'lc-1', status: 'Scheduled' }
    wrapper.vm.handleLaunch(row)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'VishingCampaignLaunchDialog' })
    expect(dialog.exists()).toBe(true)
    dialog.vm.$emit('on-cancel')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('launch dialog on-cancel(true) refreshes list while closing', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    wrapper.vm.handleLaunch({ resourceId: 'lc-2', status: 'Scheduled' })
    await wrapper.vm.$nextTick()
    jest.clearAllMocks()

    wrapper.findComponent({ name: 'VishingCampaignLaunchDialog' }).vm.$emit('on-cancel', true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
  })

  it('stop dialog on-cancel closes and clears selection', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    wrapper.vm.handleStop({ resourceId: 'st-1', status: 'Running' })
    await wrapper.vm.$nextTick()

    wrapper.findComponent({ name: 'VishingCampaignStopDialog' }).vm.$emit('on-cancel')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isShowStopDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('stop dialog on-cancel(true) refreshes list while closing', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    wrapper.vm.handleStop({ resourceId: 'st-2', status: 'Running' })
    await wrapper.vm.$nextTick()
    jest.clearAllMocks()

    wrapper.findComponent({ name: 'VishingCampaignStopDialog' }).vm.$emit('on-cancel', true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowStopDialog).toBe(false)
  })

  it('delete campaign dialog onCancel closes via handleCloseDeleteModal', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    wrapper.vm.handleDelete({ resourceId: 'del-1', name: 'N' })
    await wrapper.vm.$nextTick()

    wrapper.findComponent({ name: 'DeleteVishingCampaignDialog' }).vm.$emit('onCancel')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isMultipleDelete).toBe(false)
  })

  it('delete campaign dialog onCancel(true) refreshes list', async () => {
    const wrapper = createWrapper({}, vishingCampaignActionDialogStubs)
    await flushPromises()
    wrapper.vm.handleDelete({ resourceId: 'del-2', name: 'N2' })
    await wrapper.vm.$nextTick()
    jest.clearAllMocks()

    wrapper.findComponent({ name: 'DeleteVishingCampaignDialog' }).vm.$emit('onCancel', true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
  })
})

describe('VishingCampaignLaunchDialog / VishingCampaignStopDialog (real dialog, stub AppDialog shell)', () => {
  const appDialogShellStub = {
    name: 'AppDialog',
    props: ['status'],
    template: `
      <div class="app-dialog-shell-stub" v-show="status">
        <slot name="app-dialog-footer" />
      </div>
    `
  }

  const appDialogFooterConfirmStub = {
    name: 'AppDialogFooter',
    template: `
      <div class="app-dialog-footer-stub">
        <button type="button" class="btn-dialog-confirm" @click="$emit('handleConfirm')">confirm</button>
      </div>
    `
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Launch: confirm calls API then emits on-cancel(true)', async () => {
    const vuetify = new Vuetify()
    const wrapper = mount(VishingCampaignLaunchDialog, {
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'launch-api-1' }
      },
      stubs: {
        AppDialog: appDialogShellStub,
        AppDialogFooter: appDialogFooterConfirmStub
      }
    })
    await wrapper.vm.$nextTick()

    wrapper.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(launchVishingCampaign).toHaveBeenCalledWith('launch-api-1')
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
    expect(wrapper.emitted('on-cancel').pop()[0]).toBe(true)
  })

  it('Stop: confirm calls API then emits on-cancel(true)', async () => {
    const vuetify = new Vuetify()
    const wrapper = mount(VishingCampaignStopDialog, {
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'stop-api-1' }
      },
      stubs: {
        AppDialog: appDialogShellStub,
        AppDialogFooter: appDialogFooterConfirmStub
      }
    })
    await wrapper.vm.$nextTick()

    wrapper.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(stopVishingCampaign).toHaveBeenCalledWith('stop-api-1')
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
    expect(wrapper.emitted('on-cancel').pop()[0]).toBe(true)
  })
})

describe('VishingCampaignManager campaign modal cancel (parent wire-up)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('VishingCampaignModal cancel closes modal and clears edit flags', async () => {
    const wrapper = createWrapper({}, vishingCampaignModalCancelEmitStub)
    await flushPromises()
    wrapper.vm.handleEdit({ resourceId: 'm1', name: 'C' }, false)
    await wrapper.vm.$nextTick()

    wrapper.findComponent({ name: 'VishingCampaignModal' }).vm.$emit('cancel')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
  })

  it('VishingCampaignModal cancel(true) refreshes campaigns', async () => {
    const wrapper = createWrapper({}, vishingCampaignModalCancelEmitStub)
    await flushPromises()
    wrapper.vm.handleEdit({ resourceId: 'm2', name: 'C2' }, true)
    await wrapper.vm.$nextTick()
    jest.clearAllMocks()

    wrapper.findComponent({ name: 'VishingCampaignModal' }).vm.$emit('cancel', true)
    await flushPromises()

    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isCampaignModalVisible).toBe(false)
  })
})

describe('DeleteVishingCampaignDialog (real dialog, stub AppDialog shell)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('confirm calls deleteVishingCampaign then emits onCancel(true)', async () => {
    const vuetify = new Vuetify()
    const wrapper = mount(DeleteVishingCampaignDialog, {
      vuetify,
      propsData: {
        status: true,
        selectedRow: { resourceId: 'del-camp-1', name: 'Campaign A' },
        selectedRowCount: 1,
        isMultiple: false
      },
      stubs: {
        AppDialog: appDialogDeleteShellStub,
        AppDialogFooter: appDialogFooterConfirmStub
      }
    })
    await wrapper.vm.$nextTick()

    wrapper.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(deleteVishingCampaign).toHaveBeenCalledWith('del-camp-1')
    expect(wrapper.emitted('onCancel')).toBeTruthy()
    expect(wrapper.emitted('onCancel').pop()[0]).toBe(true)
  })
})

describe('VishingCampaignManager delete flow (real dialog in tree)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('confirm on embedded delete dialog calls API, refreshes list, and closes modal', async () => {
    const wrapper = createWrapperWithRealDeleteCampaignDialog()
    await flushPromises()
    const row = { resourceId: 'e2e-del-camp-1', name: 'Del Tree' }
    wrapper.vm.handleDelete(row)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'DeleteVishingCampaignDialog' })
    expect(dialog.exists()).toBe(true)

    jest.clearAllMocks()
    dialog.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(deleteVishingCampaign).toHaveBeenCalledWith('e2e-del-camp-1')
    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })
})

describe('VishingCampaignManager launch/stop flow (real dialogs in tree)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('launch confirm calls API, refreshes list, and closes dialog', async () => {
    const wrapper = createWrapperWithRealLaunchDialog()
    await flushPromises()
    const row = { resourceId: 'e2e-launch-1', status: 'Scheduled' }
    wrapper.vm.handleLaunch(row)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'VishingCampaignLaunchDialog' })
    expect(dialog.exists()).toBe(true)

    jest.clearAllMocks()
    dialog.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(launchVishingCampaign).toHaveBeenCalledWith('e2e-launch-1')
    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowLaunchDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('stop confirm calls API, refreshes list, and closes dialog', async () => {
    const wrapper = createWrapperWithRealStopDialog()
    await flushPromises()
    const row = { resourceId: 'e2e-stop-1', status: 'Running' }
    wrapper.vm.handleStop(row)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'VishingCampaignStopDialog' })
    expect(dialog.exists()).toBe(true)

    jest.clearAllMocks()
    dialog.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(stopVishingCampaign).toHaveBeenCalledWith('e2e-stop-1')
    expect(getVishingCampaigns).toHaveBeenCalled()
    expect(wrapper.vm.isShowStopDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })
})

describe('VishingCampaignManager export (multi-type payload)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('exportVishingCampaigns maps each export type and issues one request per type', async () => {
    const click = jest.fn()
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:multi')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingCampaigns({
      exportTypes: ['PDF', 'XLS'],
      reportAllPages: false,
      pageNumber: 2,
      pageSize: 15
    })
    await flushPromises()

    expect(exportVishingCampaigns).toHaveBeenCalledTimes(2)
    expect(exportVishingCampaigns.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        pageNumber: 2,
        pageSize: 15,
        exportType: 'PDF',
        reportAllPages: false
      })
    )
    expect(exportVishingCampaigns.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        exportType: 'Excel'
      })
    )
    expect(click).toHaveBeenCalledTimes(2)

    document.createElement.mockRestore()
  })

  it('exportVishingCampaigns passes reportAllPages through to each request', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingCampaigns({
      exportTypes: ['PDF'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingCampaigns).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'PDF',
        reportAllPages: true
      })
    )
  })
})

describe('VishingCampaignManager callForData resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('callForData clears loading and empties table when getVishingCampaigns rejects', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    getVishingCampaigns.mockRejectedValueOnce(new Error('network'))
    wrapper.setData({ tableData: [{ resourceId: 'stale' }] })

    wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.tableData).toEqual([])
  })
})

describe('VishingCampaignManager preview toggle edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('onToggleShowPreviewModal from closed keeps selectedRow when opening', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'p1', name: 'P' }
    wrapper.setData({ isPreviewVisible: false, selectedRow: row })

    wrapper.vm.onToggleShowPreviewModal()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual(row)
  })

  it('onToggleShowPreviewModal from open clears selectedRow when closing', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'p2', name: 'P2' }
    wrapper.setData({ isPreviewVisible: true, selectedRow: row })

    wrapper.vm.onToggleShowPreviewModal()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })
})

describe('VishingCampaignManager delete modal toggle (onToggleShowDeleteModal)', () => {
  it('closing via toggle clears selection and multiple-delete flag', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      isDeleteModalVisible: true,
      isMultipleDelete: true,
      selectedRow: { resourceId: 'd', name: 'D' },
      selectedRowCount: 5
    })

    wrapper.vm.onToggleShowDeleteModal()

    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isMultipleDelete).toBe(false)
  })

  it('opening via toggle flips visibility without clearing prior selection', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'keep', name: 'K' }
    wrapper.setData({
      isDeleteModalVisible: false,
      selectedRow: row,
      isMultipleDelete: false
    })

    wrapper.vm.onToggleShowDeleteModal()

    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual(row)
  })
})
