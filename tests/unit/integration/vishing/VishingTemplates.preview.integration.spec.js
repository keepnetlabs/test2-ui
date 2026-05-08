/**
 * Integration: VishingTemplates view with real VishingTemplatePreview (template API path, not campaign).
 */
jest.mock('@/api/vishing', () => ({
  getVishingTemplates: jest.fn(() =>
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
  exportVishingTemplates: jest.fn(() =>
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
  getVishingTemplatePreview: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Template From API',
          steps: []
        }
      }
    })
  ),
  deleteVishingTemplate: jest.fn(() => Promise.resolve()),
  bulkDeleteVishingTemplates: jest.fn(() => Promise.resolve())
}))

import { mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VishingTemplates from '@/views/VishingTemplates.vue'
import VishingTemplatePreview from '@/components/VishingTemplates/VishingTemplatePreview.vue'
import DeleteVishingTemplateDialog from '@/components/VishingTemplates/DeleteVishingTemplateDialog.vue'

const {
  getVishingTemplatePreview,
  getVishingTemplateLanguages,
  exportVishingTemplates,
  getVishingTemplates,
  deleteVishingTemplate,
  bulkDeleteVishingTemplates
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

const templatePermissionGetters = {
  'permissions/getVishingTemplatesSearchPermissions': true,
  'permissions/getVishingTemplatesPreviewPermissions': true,
  'permissions/getVishingTemplatesEditPermissions': true,
  'permissions/getPhishingScenariosPreviewPermissions': true,
  'permissions/getVishingTemplatesCreatePermissions': true,
  'permissions/getVishingTemplatesDeletePermissions': true,
  'permissions/getVishingTemplatesExportPermissions': true
}

const dataTableStub = {
  name: 'DataTable',
  template: '<div class="data-table-stub" />',
  methods: {
    reRenderFilters() {},
    resetSelectableParams() {}
  }
}

const vishingTemplateModalEmitStub = {
  VishingTemplateModal: {
    name: 'VishingTemplateModal',
    props: ['status', 'templateId', 'isEdit', 'isDuplicate', 'languages', 'voices', 'languageItems'],
    template: `
      <div class="vishing-template-modal-emit-stub">
        <button type="button" class="btn-template-modal-close" @click="$emit('changeVishingTemplateModalStatus', false)">
          close
        </button>
        <button
          type="button"
          class="btn-template-modal-close-restart"
          @click="$emit('changeVishingTemplateModalStatus', false, true)"
        >
          close-restart
        </button>
      </div>
    `
  }
}

const deleteVishingTemplateDialogStub = {
  DeleteVishingTemplateDialog: {
    name: 'DeleteVishingTemplateDialog',
    props: ['status', 'selectedTemplate', 'templateCount', 'multipleDeletePayload', 'isMultiple'],
    template: `
      <div class="delete-vishing-template-dialog-stub">
        <button type="button" class="btn-template-delete-close" @click="$emit('handleCloseModal')">close</button>
      </div>
    `
  }
}

function createWrapper(getterOverrides = {}, stubOverrides = {}) {
  const vuetify = new Vuetify()
  return mount(VishingTemplates, {
    vuetify,
    stubs: {
      KContainer: { template: '<div class="k-container-stub"><slot /></div>' },
      DataTable: dataTableStub,
      DeleteVishingTemplateDialog: true,
      VishingTemplateModal: true,
      VishingTemplatePreviewSteps: { template: '<span class="preview-steps-stub" />' },
      ...stubOverrides
    },
    mocks: {
      $router: { push: jest.fn() },
      $store: {
        getters: { ...templatePermissionGetters, ...getterOverrides }
      }
    }
  })
}

function createWrapperWithRealTemplateDeleteDialog(getterOverrides = {}) {
  return createWrapper(getterOverrides, {
    DeleteVishingTemplateDialog: false,
    AppDialog: appDialogDeleteShellStub,
    AppDialogFooter: appDialogFooterConfirmStub
  })
}

describe('VishingTemplates + VishingTemplatePreview integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('opens template preview child and loads template preview API (not campaign)', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(getVishingTemplateLanguages).toHaveBeenCalled()

    const row = {
      resourceId: 'tpl-1',
      name: 'Row Template',
      language: 'English',
      voice: 'Voice 1'
    }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.selectedTemplate).toEqual(row)

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.exists()).toBe(true)
    expect(preview.props('isCampaign')).toBe(false)
    expect(preview.props('status')).toBe(true)
    expect(preview.props('selectedRow')).toEqual(row)

    await flushPromises()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(getVishingTemplatePreview).toHaveBeenCalledWith('tpl-1')
    expect(preview.vm.templateData).toEqual(
      expect.objectContaining({
        name: 'Template From API',
        language: 'English',
        voice: 'Voice 1'
      })
    )
    expect(wrapper.text()).toContain('Vishing Template Preview')
    expect(wrapper.text()).toContain('Row Template')
  })

  it('preview child clears loading and leaves template empty when getVishingTemplatePreview rejects', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    getVishingTemplatePreview.mockRejectedValueOnce(new Error('preview unavailable'))

    const row = {
      resourceId: 'tpl-preview-fail',
      name: 'Broken Template',
      language: 'English',
      voice: 'Voice 1'
    }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(preview.exists()).toBe(true)
    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(getVishingTemplatePreview).toHaveBeenCalledWith('tpl-preview-fail')
    expect(preview.vm.isLoading).toBe(false)
    expect(preview.vm.templateData).toBeNull()
  })

  it('preview on-duplicate-template opens template modal in duplicate mode', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = {
      resourceId: 'tpl-2',
      name: 'Dup Template',
      language: 'English',
      voice: 'Voice 1'
    }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    preview.vm.$emit('on-duplicate-template')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.vishingTemplateId).toBe('tpl-2')
    expect(wrapper.vm.selectedTemplate).toEqual(row)
  })

  it('preview on-edit-template opens template modal for edit', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = {
      resourceId: 'tpl-3',
      name: 'Edit Template',
      language: 'English',
      voice: 'Voice 1'
    }
    wrapper.vm.handlePreview(row)
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.findComponent(VishingTemplatePreview).vm.$emit('on-edit-template')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedTemplate).toEqual(row)
  })

  it('preview closeDrawer clears preview and selected template', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const row = {
      resourceId: 'tpl-close',
      name: 'Close',
      language: 'English',
      voice: 'Voice 1'
    }
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
    expect(wrapper.vm.selectedTemplate).toBe(null)
  })

  it('handleActionDelete opens delete modal for single template', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'del-1', name: 'N1' }

    wrapper.vm.handleActionDelete(row)

    expect(wrapper.vm.isMultipleDelete).toBe(false)
    expect(wrapper.vm.selectedTemplate).toEqual(row)
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('handleMultipleDelete builds payload and opens delete modal', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      serverSideProps: { totalNumberOfRecords: 50 },
      axiosPayload: { filter: { k: 'v' } }
    })

    wrapper.vm.handleMultipleDelete(
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['ex-1'],
      false
    )

    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(2)
    expect(wrapper.vm.multipleTemplatesPayload).toEqual(
      expect.objectContaining({
        items: ['a', 'b'],
        excludedItems: ['ex-1'],
        selectAll: false
      })
    )
    expect(wrapper.vm.multipleTemplatesPayload.filter.k).toBe('v')
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('handleMultipleDelete with selectAll uses total count and empty id list', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      serverSideProps: { totalNumberOfRecords: 77 },
      axiosPayload: { filter: { k: 'v' } }
    })

    wrapper.vm.handleMultipleDelete([], ['ex'], true)

    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(77)
    expect(wrapper.vm.multipleTemplatesPayload).toEqual(
      expect.objectContaining({
        items: [],
        excludedItems: ['ex'],
        selectAll: true
      })
    )
    expect(wrapper.vm.isDeleteModalVisible).toBe(true)
  })

  it('mounted callForData redirects home when template search permission is denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesSearchPermissions': false
    })
    await flushPromises()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/')
  })

  it('exportVishingTemplates downloads when response body is a Blob', async () => {
    const click = jest.fn()
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:templates')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['PDF'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()

    document.createElement.mockRestore()
  })

  it('exportVishingTemplates maps XLS to Excel payload and xlsx download name', async () => {
    const anchor = { click: jest.fn(), href: '', download: '' }
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:templates-xls')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return anchor
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(anchor.download).toBe('VishingTemplates.xlsx')
    expect(anchor.click).toHaveBeenCalled()

    document.createElement.mockRestore()
  })

  it('exportVishingTemplates uses csv download suffix for CSV export', async () => {
    const anchor = { click: jest.fn(), href: '', download: '' }
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:templates-csv')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return anchor
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(anchor.download).toBe('VishingTemplates.csv')

    document.createElement.mockRestore()
  })

  it('exportVishingTemplates uses pdf download suffix for PDF export', async () => {
    const anchor = { click: jest.fn(), href: '', download: '' }
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:templates-pdf')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return anchor
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['PDF'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'PDF' })
    )
    expect(anchor.download).toBe('VishingTemplates.pdf')

    document.createElement.mockRestore()
  })

  it('exportVishingTemplates skips anchor download when response body is not a Blob', async () => {
    exportVishingTemplates.mockResolvedValueOnce({ data: { notABlob: true } })
    const createSpy = jest.spyOn(document, 'createElement')
    const wrapper = createWrapper()
    await flushPromises()

    createSpy.mockClear()
    wrapper.vm.exportVishingTemplates({
      exportTypes: ['CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalled()
    expect(createSpy.mock.calls.some((c) => c[0] === 'a')).toBe(false)
    createSpy.mockRestore()
  })

  it('callForData reloads templates when search is allowed', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.callForData()
    await flushPromises()

    expect(getVishingTemplates).toHaveBeenCalled()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('changeNewVishingTemplateModalStatus(true) opens modal and clears template edit flags', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      modalStatus: false,
      vishingTemplateId: 'old-id',
      isEdit: true,
      isDuplicate: true
    })

    wrapper.vm.changeNewVishingTemplateModalStatus(true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.vishingTemplateId).toBe(null)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
  })

  it('changeNewVishingTemplateModalStatus closes modal and clears ids without restart', () => {
    const wrapper = createWrapper()
    wrapper.setData({
      modalStatus: true,
      vishingTemplateId: 'tid',
      isEdit: true,
      isDuplicate: true,
      selectedTemplate: { resourceId: 'st' }
    })

    wrapper.vm.changeNewVishingTemplateModalStatus(false)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.vishingTemplateId).toBeNull()
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedTemplate).toEqual({ resourceId: 'st' })
  })

  it('changeNewVishingTemplateModalStatus with restart clears selection and reloads', () => {
    const wrapper = createWrapper()
    const callSpy = jest.spyOn(wrapper.vm, 'callForData')
    wrapper.setData({
      modalStatus: true,
      vishingTemplateId: 'tid',
      isEdit: true,
      isDuplicate: true,
      selectedTemplate: { resourceId: 'st' }
    })

    wrapper.vm.changeNewVishingTemplateModalStatus(false, true)

    expect(wrapper.vm.selectedTemplate).toBeNull()
    expect(callSpy).toHaveBeenCalled()
    callSpy.mockRestore()
  })

  it('handleSuccessDeleteAction resets selectable params, closes modal, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const resetSpy = jest.spyOn(wrapper.vm.$refs.refVishingTemplatesList, 'resetSelectableParams')
    const callSpy = jest.spyOn(wrapper.vm, 'callForData')

    wrapper.setData({ isDeleteModalVisible: true })
    wrapper.vm.handleSuccessDeleteAction({ resourceId: 'r1' })
    await flushPromises()

    expect(resetSpy).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(callSpy).toHaveBeenCalled()
    resetSpy.mockRestore()
    callSpy.mockRestore()
  })

  it('handleSuccessMultipleDeleteAction resets selection and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const resetSpy = jest.spyOn(wrapper.vm.$refs.refVishingTemplatesList, 'resetSelectableParams')
    const callSpy = jest.spyOn(wrapper.vm, 'callForData')

    wrapper.setData({ isDeleteModalVisible: true })
    wrapper.vm.handleSuccessMultipleDeleteAction()
    await flushPromises()

    expect(resetSpy).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
    expect(callSpy).toHaveBeenCalled()
    resetSpy.mockRestore()
    callSpy.mockRestore()
  })
})

describe('VishingTemplates preview props to VishingTemplatePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  const previewRow = () => ({
    resourceId: 'tpl-props-1',
    name: 'Props Template',
    language: 'English',
    voice: 'Voice 1'
  })

  it('passes show edit and duplicate from template (always on for templates view)', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('showEditButton')).toBe(true)
    expect(preview.props('showDuplicateButton')).toBe(true)
  })

  it('passes editDisabled and duplicateDisabled false when edit and create are permitted', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(false)
    expect(preview.props('duplicateDisabled')).toBe(false)
  })

  it('passes editDisabled from rowActions[1] when edit permission is denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesEditPermissions': false
    })
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(true)
    expect(preview.props('duplicateDisabled')).toBe(false)
  })

  it('passes duplicateDisabled from rowActions[3] when create permission is denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesCreatePermissions': false
    })
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(false)
    expect(preview.props('duplicateDisabled')).toBe(true)
  })

  it('passes both disabled when edit and create permissions are denied', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesEditPermissions': false,
      'permissions/getVishingTemplatesCreatePermissions': false
    })
    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    expect(preview.props('editDisabled')).toBe(true)
    expect(preview.props('duplicateDisabled')).toBe(true)
  })

  it('child handleEdit does not open template modal when editDisabled from permissions', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesEditPermissions': false
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    preview.vm.handleEdit()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.modalStatus).toBe(false)
  })

  it('child handleDuplicate does not open template modal when duplicateDisabled from permissions', async () => {
    const wrapper = createWrapper({
      'permissions/getVishingTemplatesCreatePermissions': false
    })
    await flushPromises()
    await wrapper.vm.$nextTick()
    wrapper.vm.handlePreview(previewRow())
    await wrapper.vm.$nextTick()
    await flushPromises()
    await wrapper.vm.$nextTick()

    const preview = wrapper.findComponent(VishingTemplatePreview)
    preview.vm.handleDuplicate()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.modalStatus).toBe(false)
  })
})

describe('VishingTemplates server-side table (useDefaultTableFunctions)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('serverSidePageNumberChanged updates payload page and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.serverSidePageNumberChanged(6)
    await flushPromises()

    expect(wrapper.vm.axiosPayload.pageNumber).toBe(6)
    expect(getVishingTemplates).toHaveBeenCalled()
  })

  it('serverSideSizeChanged updates page size, resets page number, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      axiosPayload: { ...wrapper.vm.axiosPayload, pageNumber: 2 },
      serverSideProps: { ...wrapper.vm.serverSideProps, pageNumber: 2, pageSize: 10 }
    })
    jest.clearAllMocks()

    wrapper.vm.serverSideSizeChanged(25)
    await flushPromises()

    expect(wrapper.vm.axiosPayload.pageSize).toBe(25)
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)
    expect(wrapper.vm.serverSideProps.pageSize).toBe(25)
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1)
    expect(getVishingTemplates).toHaveBeenCalled()
  })

  it('sortChanged updates order, direction, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.sortChanged({ order: 'ascending', prop: 'Name' })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.ascending).toBe(true)
    expect(wrapper.vm.axiosPayload.orderBy).toBe('Name')
    expect(getVishingTemplates).toHaveBeenCalled()
  })

  it('handleSearchChange normalizes search group, search text, resets page, and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      axiosPayload: { ...wrapper.vm.axiosPayload, pageNumber: 4 },
      serverSideProps: { ...wrapper.vm.serverSideProps, pageNumber: 4 }
    })
    jest.clearAllMocks()

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'TotalDuration', Operator: 'Contains', Value: '3' }]
          }
        ],
        SearchInputTextValue: 'tpl'
      }
    })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe('tpl')
    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'DurationMinutes', Operator: 'Contains', Value: '3' }
    ])
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1)
    expect(getVishingTemplates).toHaveBeenCalled()
  })

  it('columnFilterChanged merges column filter into group 0 and reloads', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    jest.clearAllMocks()

    wrapper.vm.columnFilterChanged({ FieldName: 'language', Value: 'English', Operator: '=' })
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ FieldName: 'language', Value: 'English', Operator: '=' })
      ])
    )
    expect(getVishingTemplates).toHaveBeenCalled()
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
              FilterItems: [{ FieldName: 'language', Value: 'Turkish', Operator: '=' }]
            },
            { ...wrapper.vm.axiosPayload.filter.FilterGroups[1] }
          ]
        }
      }
    })
    jest.clearAllMocks()

    wrapper.vm.columnFilterCleared('language')
    await flushPromises()

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(getVishingTemplates).toHaveBeenCalled()
  })
})

describe('VishingTemplates fast launch and delete modal wire-up', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('handleFastLaunch sets selected template for downstream fast-launch flow', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'fast-1', name: 'Fast Tpl', language: 'English', voice: 'Voice 1' }

    wrapper.vm.handleFastLaunch(row)

    expect(wrapper.vm.selectedTemplate).toEqual(row)
  })

  it('handleEdit opens template modal with isDuplicate from second argument', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'he1', name: 'HE' }

    wrapper.vm.handleEdit(row, false)
    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.vishingTemplateId).toBe('he1')
    expect(wrapper.vm.selectedTemplate).toEqual(row)

    wrapper.vm.handleEdit(row, true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.isDuplicate).toBe(true)
  })

  it('delete template dialog handleCloseModal closes modal flag', async () => {
    const wrapper = createWrapper({}, deleteVishingTemplateDialogStub)
    await flushPromises()
    wrapper.vm.handleActionDelete({ resourceId: 't-del', name: 'To Delete' })
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'DeleteVishingTemplateDialog' })
    expect(dialog.exists()).toBe(true)
    dialog.vm.$emit('handleCloseModal')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
  })
})

describe('VishingTemplates template modal (parent wire-up)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('changeVishingTemplateModalStatus(false) from modal closes and clears ids', async () => {
    const wrapper = createWrapper({}, vishingTemplateModalEmitStub)
    await flushPromises()
    wrapper.setData({
      modalStatus: true,
      vishingTemplateId: 'tid',
      isEdit: true,
      isDuplicate: false,
      selectedTemplate: { resourceId: 'st' }
    })
    await wrapper.vm.$nextTick()

    wrapper.findComponent({ name: 'VishingTemplateModal' }).vm.$emit('changeVishingTemplateModalStatus', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.vishingTemplateId).toBeNull()
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.selectedTemplate).toEqual({ resourceId: 'st' })
  })

  it('changeVishingTemplateModalStatus(false, true) from modal clears selection and reloads', async () => {
    const wrapper = createWrapper({}, vishingTemplateModalEmitStub)
    await flushPromises()
    const callSpy = jest.spyOn(wrapper.vm, 'callForData')
    wrapper.setData({
      modalStatus: true,
      selectedTemplate: { resourceId: 'st2' },
      vishingTemplateId: 'x',
      isEdit: true,
      isDuplicate: true
    })
    await wrapper.vm.$nextTick()

    wrapper.findComponent({ name: 'VishingTemplateModal' }).vm.$emit('changeVishingTemplateModalStatus', false, true)
    await flushPromises()

    expect(wrapper.vm.selectedTemplate).toBeNull()
    expect(callSpy).toHaveBeenCalled()
    callSpy.mockRestore()
  })
})

describe('DeleteVishingTemplateDialog (real dialog, stub AppDialog shell)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('single delete: confirm calls API then emits success and close', async () => {
    const vuetify = new Vuetify()
    const row = { resourceId: 'tpl-del-1', name: 'T One' }
    const wrapper = mount(DeleteVishingTemplateDialog, {
      vuetify,
      propsData: {
        status: true,
        isMultiple: false,
        selectedTemplate: row,
        templateCount: 1,
        multipleDeletePayload: {}
      },
      stubs: {
        AppDialog: appDialogDeleteShellStub,
        AppDialogFooter: appDialogFooterConfirmStub
      }
    })
    await wrapper.vm.$nextTick()

    wrapper.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(deleteVishingTemplate).toHaveBeenCalledWith('tpl-del-1')
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeTruthy()
    expect(wrapper.emitted('handleSuccessDeleteAction').pop()[0]).toEqual(row)
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('bulk delete: confirm calls bulk API then emits on-success-multiple', async () => {
    const vuetify = new Vuetify()
    const payload = { items: ['a', 'b'], selectAll: false, excludedItems: [], filter: {} }
    const wrapper = mount(DeleteVishingTemplateDialog, {
      vuetify,
      propsData: {
        status: true,
        isMultiple: true,
        templateCount: 2,
        multipleDeletePayload: payload,
        selectedTemplate: { resourceId: 'ignored', name: 'X' }
      },
      stubs: {
        AppDialog: appDialogDeleteShellStub,
        AppDialogFooter: appDialogFooterConfirmStub
      }
    })
    await wrapper.vm.$nextTick()

    wrapper.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(bulkDeleteVishingTemplates).toHaveBeenCalledWith(payload)
    expect(wrapper.emitted('on-success-multiple')).toBeTruthy()
  })
})

describe('VishingTemplates delete flow (real dialog in tree)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('single confirm calls API, parent success handler reloads, modal closes', async () => {
    const wrapper = createWrapperWithRealTemplateDeleteDialog()
    await flushPromises()
    const row = { resourceId: 'e2e-tpl-1', name: 'T E2E', language: 'English', voice: 'Voice 1' }
    wrapper.vm.handleActionDelete(row)
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'DeleteVishingTemplateDialog' })
    expect(dialog.exists()).toBe(true)

    jest.clearAllMocks()
    dialog.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(deleteVishingTemplate).toHaveBeenCalledWith('e2e-tpl-1')
    expect(getVishingTemplates).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
  })

  it('bulk confirm calls bulk API and parent multiple-success handler reloads', async () => {
    const wrapper = createWrapperWithRealTemplateDeleteDialog()
    await flushPromises()
    wrapper.vm.handleMultipleDelete(
      [{ resourceId: 'id-a' }, { resourceId: 'id-b' }],
      [],
      false
    )
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'DeleteVishingTemplateDialog' })
    jest.clearAllMocks()
    dialog.find('.btn-dialog-confirm').trigger('click')
    await flushPromises()

    expect(bulkDeleteVishingTemplates).toHaveBeenCalledWith(
      expect.objectContaining({
        items: ['id-a', 'id-b'],
        selectAll: false
      })
    )
    expect(getVishingTemplates).toHaveBeenCalled()
    expect(wrapper.vm.isDeleteModalVisible).toBe(false)
  })
})

describe('VishingTemplates export (multi-type payload)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('exportVishingTemplates maps each export type and issues one request per type', async () => {
    const click = jest.fn()
    if (!window.URL) {
      window.URL = {}
    }
    window.URL.createObjectURL = jest.fn(() => 'blob:tpl-multi')
    const originalCreateElement = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return { click }
      }
      return originalCreateElement(tagName)
    })

    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['CSV', 'XLS'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledTimes(2)
    expect(exportVishingTemplates.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        pageNumber: 1,
        pageSize: 20,
        exportType: 'CSV',
        reportAllPages: true
      })
    )
    expect(exportVishingTemplates.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        exportType: 'Excel'
      })
    )
    expect(click).toHaveBeenCalledTimes(2)

    document.createElement.mockRestore()
  })

  it('exportVishingTemplates passes reportAllPages through to each request', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.exportVishingTemplates({
      exportTypes: ['CSV'],
      reportAllPages: true,
      pageNumber: 3,
      pageSize: 50
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV',
        reportAllPages: true,
        pageNumber: 3,
        pageSize: 50
      })
    )
  })
})

describe('VishingTemplates callForData resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('callForData clears loading and empties table when getVishingTemplates rejects', async () => {
    getVishingTemplates.mockRejectedValueOnce(new Error('network'))
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({ tableData: [{ resourceId: 'stale' }] })

    wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.tableData).toEqual([])
  })
})

describe('VishingTemplates callForLanguages resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('callForLanguages clears lists and column filter options when API returns empty data array', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const voiceCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'voice')
    const langCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'language')
    wrapper.vm.$set(voiceCol, 'filterableItems', ['Voice 1'])
    wrapper.vm.$set(langCol, 'filterableItems', ['English'])

    getVishingTemplateLanguages.mockResolvedValueOnce({ data: { data: [] } })
    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languageItems).toEqual([])
    expect(wrapper.vm.voices).toEqual([])
    expect(wrapper.vm.languages).toEqual([])
    expect(voiceCol.filterableItems).toEqual([])
    expect(langCol.filterableItems).toEqual([])
  })

  it('callForLanguages clears language-derived state when getVishingTemplateLanguages rejects', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    getVishingTemplateLanguages.mockRejectedValueOnce(new Error('network'))
    const voiceCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'voice')
    const langCol = wrapper.vm.tableOptions.columns.find((c) => c.property === 'language')
    wrapper.setData({
      languageItems: [{ language: 'English', name: 'Amy', resourceId: 'r1' }],
      voices: ['Amy'],
      languages: ['English']
    })
    wrapper.vm.$set(voiceCol, 'filterableItems', ['Amy'])
    wrapper.vm.$set(langCol, 'filterableItems', ['English'])

    await wrapper.vm.callForLanguages()
    await flushPromises()

    expect(wrapper.vm.languageItems).toEqual([])
    expect(wrapper.vm.voices).toEqual([])
    expect(wrapper.vm.languages).toEqual([])
    expect(voiceCol.filterableItems).toEqual([])
    expect(langCol.filterableItems).toEqual([])
  })
})

describe('VishingTemplates preview toggle edge cases', () => {
  it('onToggleShowPreviewModal from closed keeps selectedTemplate when opening', () => {
    const wrapper = createWrapper()
    const tpl = { resourceId: 't1', name: 'T' }
    wrapper.setData({ isPreviewVisible: false, selectedTemplate: tpl })

    wrapper.vm.onToggleShowPreviewModal()

    expect(wrapper.vm.isPreviewVisible).toBe(true)
    expect(wrapper.vm.selectedTemplate).toEqual(tpl)
  })

  it('onToggleShowPreviewModal from open clears selectedTemplate when closing', () => {
    const wrapper = createWrapper()
    const tpl = { resourceId: 't2', name: 'T2' }
    wrapper.setData({ isPreviewVisible: true, selectedTemplate: tpl })

    wrapper.vm.onToggleShowPreviewModal()

    expect(wrapper.vm.isPreviewVisible).toBe(false)
    expect(wrapper.vm.selectedTemplate).toBe(null)
  })
})

describe('VishingTemplates route / modal guard (beforeRouteLeave, checkIfCanCloseVishingTemplateModal)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  const vishingTemplateModalRefStub = {
    name: 'VishingTemplateModal',
    props: ['status'],
    template: '<div class="vishing-template-modal-route-stub" />',
    methods: {
      changeVishingTemplateModalStatus() {
        this.$emit('changeVishingTemplateModalStatus', false)
      }
    }
  }

  it('beforeRouteLeave allows navigation when template modal ref is absent', () => {
    const next = jest.fn()
    VishingTemplates.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave allows navigation when modal ref exists but status is falsy', () => {
    const next = jest.fn()
    const mockModal = { status: false, changeVishingTemplateModalStatus: jest.fn() }
    VishingTemplates.beforeRouteLeave.call(
      { $refs: { refVishingTemplateModal: mockModal } },
      {},
      {},
      next
    )
    expect(next).toHaveBeenCalledWith()
    expect(mockModal.changeVishingTemplateModalStatus).not.toHaveBeenCalled()
  })

  it('beforeRouteLeave blocks when open modal reports status and closes via child', async () => {
    const wrapper = createWrapper({}, { VishingTemplateModal: vishingTemplateModalRefStub })
    await flushPromises()
    wrapper.setData({ modalStatus: true })
    await wrapper.vm.$nextTick()

    const next = jest.fn()
    const modalVm = wrapper.vm.$refs.refVishingTemplateModal
    expect(modalVm).toBeDefined()
    expect(modalVm.status).toBe(true)

    VishingTemplates.beforeRouteLeave.call(wrapper.vm, {}, {}, next)

    expect(next).toHaveBeenCalledWith(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modalStatus).toBe(false)
  })

  it('checkIfCanCloseVishingTemplateModal delegates to template modal when ref present', async () => {
    const wrapper = createWrapper({}, { VishingTemplateModal: vishingTemplateModalRefStub })
    await flushPromises()
    wrapper.setData({ modalStatus: true })
    await wrapper.vm.$nextTick()

    const modalVm = wrapper.vm.$refs.refVishingTemplateModal
    const spy = jest.spyOn(modalVm, 'changeVishingTemplateModalStatus')
    wrapper.vm.checkIfCanCloseVishingTemplateModal()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('checkIfCanCloseVishingTemplateModal is a no-op when template modal ref is absent', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$refs.refVishingTemplateModal).toBeUndefined()
    expect(() => wrapper.vm.checkIfCanCloseVishingTemplateModal()).not.toThrow()
  })
})

describe('VishingTemplates getTemplateId computed', () => {
  it('returns empty string when selectedTemplate is null', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedTemplate: null })
    expect(wrapper.vm.getTemplateId).toBe('')
  })

  it('returns resourceId when a template is selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedTemplate: { resourceId: 'tpl-rid-42', name: 'N' } })
    expect(wrapper.vm.getTemplateId).toBe('tpl-rid-42')
  })
})

describe('VishingTemplates selectedTemplate watcher', () => {
  it('clears voice-related state when selectedTemplate becomes null', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      selectedTemplate: {
        resourceId: 't-clear',
        name: 'N',
        language: 'English',
        voice: 'Voice 1'
      },
      voiceResourceId: 'was-set',
      isTextToSpeechCompatible: true,
      selectedTemplateLanguage: 'English',
      selectedTemplateVoice: 'Voice 1'
    })
    await wrapper.vm.$nextTick()

    wrapper.setData({ selectedTemplate: null })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.voiceResourceId).toBe('')
    expect(wrapper.vm.isTextToSpeechCompatible).toBe(false)
  })
})

describe('VishingTemplates selectedTemplate voice resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('maps voiceResourceId and TTS flag when template matches loaded languageItems', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.setData({
      selectedTemplate: {
        resourceId: 'tpl-match',
        name: 'Match',
        language: 'English',
        voice: 'Voice 1'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.voiceResourceId).toBe('lang-1')
    expect(wrapper.vm.isTextToSpeechCompatible).toBe(true)
    expect(wrapper.vm.selectedTemplateLanguage).toBe('English')
    expect(wrapper.vm.selectedTemplateVoice).toBe('Voice 1')
  })

  it('sets isTextToSpeechCompatible false when voiceProviderTypeId is not TTS', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    getVishingTemplateLanguages.mockResolvedValueOnce({
      data: {
        data: [
          {
            resourceId: 'vid-plain',
            language: 'French',
            name: 'Voice FR',
            voiceProviderTypeId: 1
          }
        ]
      }
    })
    await wrapper.vm.callForLanguages()
    await flushPromises()

    wrapper.setData({
      selectedTemplate: {
        resourceId: 'tpl-fr',
        name: 'F',
        language: 'French',
        voice: 'Voice FR'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.voiceResourceId).toBe('vid-plain')
    expect(wrapper.vm.isTextToSpeechCompatible).toBe(false)
  })

  it('selectedTemplate watcher does not overwrite voiceResourceId when template does not match languageItems', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.setData({
      languageItems: [
        { resourceId: 'l1', language: 'English', name: 'Voice 1', voiceProviderTypeId: 2 }
      ],
      voiceResourceId: 'l1',
      isTextToSpeechCompatible: true,
      selectedTemplate: {
        resourceId: 'z1',
        name: 'Z',
        language: 'German',
        voice: 'NoMatch'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.voiceResourceId).toBe('l1')
    expect(wrapper.vm.isTextToSpeechCompatible).toBe(true)
  })
})
