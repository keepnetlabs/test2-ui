jest.mock('@/api/smishing', () => ({
  searchTextMessageTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 }
      }
    })
  ),
  exportTextMessageTemplates: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  getTextMessageTemplate: jest.fn(() =>
    Promise.resolve({
      data: { data: { name: 'Template Header', template: 'Hello world' } }
    })
  )
}))

jest.mock('@/hooks/useCallForLanguagesForTableFilter', () => ({
  data() {
    return {
      languageFilterOptions: []
    }
  },
  methods: {
    callForLanguages: jest.fn()
  }
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

jest.mock('@/api/scenarios', () => ({
  getScenarioDataDetails: jest.fn(() =>
    Promise.resolve({
      data: { data: { preferredLanguageTypes: [] } }
    })
  )
}))

import { shallowMount } from '@vue/test-utils'
import Templates from '@/components/SmishingTemplates/Templates.vue'
import SmishingService from '@/api/smishing'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { getScenarioDataDetails } from '@/api/scenarios'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const createWrapper = (getterOverrides = {}) =>
  shallowMount(Templates, {
    mocks: {
      $store: {
        getters: {
          'permissions/getSmishingTextMessageTemplatesSearchPermissions': true,
          'permissions/getSmishingTextMessageTemplatesEditPermissions': true,
          'permissions/getSmishingTextMessageTemplatesDeletePermissions': true,
          'permissions/getSmishingTextMessageTemplatesExportPermissions': true,
          'permissions/getSmishingTextMessageTemplatesCreatePermissions': true,
          ...getterOverrides
        }
      }
    },
    stubs: {
      NewSmishingTemplate: true,
      DeleteTemplateModal: true,
      DataTable: true,
      AppDialog: true,
      DatatableLoading: true,
      DefaultButtonRowAction: true,
      RowActionsMenu: true,
      DefaultMenuRowAction: true,
      ScenariosRowActionsEditButton: true,
      ScenariosRowActionsDeleteButton: true,
      LanguagesColumn: true
    }
  })

describe('SmishingTemplates Templates.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('changeNewEmailTemplateModalStatus sets modalStatus', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeNewEmailTemplateModalStatus(true)
    expect(wrapper.vm.modalStatus).toBe(true)
    wrapper.vm.changeNewEmailTemplateModalStatus(false)
    expect(wrapper.vm.modalStatus).toBe(false)
  })

  it('handleEdit sets editableFormValues and modalStatus', () => {
    const wrapper = createWrapper()
    const row = { name: 'Template 1' }
    wrapper.vm.handleEdit(row, false)
    expect(wrapper.vm.editableFormValues).toBe(row)
    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
  })

  it('handleEdit sets duplicate mode and stores emailTemplateId from row', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'tmpl-dup', name: 'Template Duplicate' }

    wrapper.vm.handleEdit(row, true)

    expect(wrapper.vm.isDuplicate).toBe(true)
    expect(wrapper.vm.emailTemplateId).toBe('tmpl-dup')
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.modalStatus).toBe(true)
  })

  it('tableOptions actions are disabled when related permissions are false', () => {
    const wrapper = createWrapper({
      'permissions/getSmishingTextMessageTemplatesEditPermissions': false,
      'permissions/getSmishingTextMessageTemplatesDeletePermissions': false,
      'permissions/getSmishingTextMessageTemplatesCreatePermissions': false,
      'permissions/getSmishingTextMessageTemplatesExportPermissions': false
    })

    expect(wrapper.vm.tableOptions.rowActions[1].disabled).toBe(true)
    expect(wrapper.vm.tableOptions.rowActions[3].disabled).toBe(true)
    expect(wrapper.vm.tableOptions.addButton.disabled).toBe(true)
    expect(wrapper.vm.tableOptions.downloadButton.disabled).toBe(true)
  })

  it('changeNewEmailTemplateModalStatus resets edit/duplicate states and restarts list', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.emailTemplateId = 'id-1'
    wrapper.vm.editableFormValues = { x: 1 }

    wrapper.vm.changeNewEmailTemplateModalStatus(false, true)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.emailTemplateId).toBe(null)
    expect(wrapper.vm.editableFormValues).toEqual({})
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('changeNewEmailTemplateModalStatus does not restart list when restart is false', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.editableFormValues = { keep: true }
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.emailTemplateId = 'id-2'

    wrapper.vm.changeNewEmailTemplateModalStatus(false, false)

    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.emailTemplateId).toBe(null)
    expect(wrapper.vm.editableFormValues).toEqual({ keep: true })
    expect(wrapper.vm.callForData).not.toHaveBeenCalled()
  })

  it('changeNewEmailTemplateModalStatus with status=true and restart=true refreshes and clears editable values', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.editableFormValues = { keep: true }
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.emailTemplateId = 'id-3'

    wrapper.vm.changeNewEmailTemplateModalStatus(true, true)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.emailTemplateId).toBe(null)
    expect(wrapper.vm.editableFormValues).toEqual({})
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('changeNewEmailTemplateModalStatus with status=true and restart=false opens modal without refreshing list', () => {
    const wrapper = createWrapper()
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.editableFormValues = { keep: true }
    wrapper.vm.isEdit = true
    wrapper.vm.isDuplicate = true
    wrapper.vm.emailTemplateId = 'id-open'

    wrapper.vm.changeNewEmailTemplateModalStatus(true, false)

    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.isDuplicate).toBe(false)
    expect(wrapper.vm.emailTemplateId).toBe(null)
    expect(wrapper.vm.editableFormValues).toEqual({ keep: true })
    expect(wrapper.vm.callForData).not.toHaveBeenCalled()
  })

  it('callForData maps language labels and updates server-side props', async () => {
    SmishingService.searchTextMessageTemplates.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: '1', languageTypeName: 'en-US' }],
          totalNumberOfRecords: 7,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getSmishingTextMessageTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      tableData: [],
      languageFilterOptions: [{ languageName: 'en-US', text: 'English' }]
    }

    Templates.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(7)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData[0].languageTypeName).toBe('English')
    expect(ctx.loading).toBe(false)
  })

  it('callForData keeps original language when lookup option is not found', async () => {
    SmishingService.searchTextMessageTemplates.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ resourceId: '2', languageTypeName: 'xx-YY' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getSmishingTextMessageTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      tableData: [],
      languageFilterOptions: [{ languageName: 'en-US', text: 'English' }]
    }

    Templates.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languageTypeName).toBe('xx-YY')
    expect(ctx.loading).toBe(false)
  })

  it('callForData falls back to empty results when API response has no results field', async () => {
    SmishingService.searchTextMessageTemplates.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      getSmishingTextMessageTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      tableData: [{ resourceId: 'old' }],
      languageFilterOptions: []
    }

    Templates.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.loading).toBe(false)
  })

  it('callForData clears data on API failure', async () => {
    SmishingService.searchTextMessageTemplates.mockRejectedValueOnce(new Error('fail'))
    const wrapper = createWrapper()
    wrapper.vm.tableData = [{ resourceId: 'old' }]

    wrapper.vm.callForData()
    await flushPromises()

    expect(wrapper.vm.tableData).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('callForData no-ops when search permission is false', async () => {
    const wrapper = createWrapper({
      'permissions/getSmishingTextMessageTemplatesSearchPermissions': false
    })
    wrapper.vm.loading = false

    wrapper.vm.callForData()
    await flushPromises()

    expect(SmishingService.searchTextMessageTemplates).not.toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('handlePreview fills dialog fields and clears loading after timeout', async () => {
    jest.useFakeTimers()
    const ctx = {
      isTemplateDetails: false,
      isPreviewLoading: false,
      selectedTemplateHeader: null,
      template: null,
      timeoutId: ''
    }

    Templates.methods.handlePreview.call(ctx, { resourceId: 'tmpl-1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.isTemplateDetails).toBe(true)
    expect(ctx.selectedTemplateHeader).toBe('Template Header')
    expect(ctx.template).toBe('Hello world')
    expect(ctx.isPreviewLoading).toBe(true)

    jest.advanceTimersByTime(500)
    expect(ctx.isPreviewLoading).toBe(false)
    jest.useRealTimers()
  })

  it('handlePreview handles empty payload object for name/template fields', async () => {
    jest.useFakeTimers()
    SmishingService.getTextMessageTemplate.mockResolvedValueOnce({ data: { data: {} } })
    const ctx = {
      isTemplateDetails: false,
      isPreviewLoading: false,
      selectedTemplateHeader: null,
      template: null,
      timeoutId: ''
    }

    Templates.methods.handlePreview.call(ctx, { resourceId: 'tmpl-missing' })
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.isTemplateDetails).toBe(true)
    expect(ctx.isPreviewLoading).toBe(true)
    expect(ctx.selectedTemplateHeader).toBeUndefined()
    expect(ctx.template).toBeUndefined()

    jest.advanceTimersByTime(500)
    expect(ctx.isPreviewLoading).toBe(false)
    jest.useRealTimers()
  })

  it('handlePreview throws when row is missing', () => {
    const ctx = {
      isTemplateDetails: false,
      isPreviewLoading: false,
      selectedTemplateHeader: null,
      template: null,
      timeoutId: ''
    }

    expect(() => Templates.methods.handlePreview.call(ctx)).toThrow()
  })

  it('handleMultipleDelete builds payload for partial selection', () => {
    const wrapper = createWrapper()
    wrapper.vm.serverSideProps.totalNumberOfRecords = 50
    wrapper.vm.axiosPayload.filter = { FilterGroups: [{ FilterItems: [] }] }

    wrapper.vm.handleMultipleDelete(
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      [{ resourceId: 'x' }],
      false
    )

    expect(wrapper.vm.isMultipleDelete).toBe(true)
    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(2)
    expect(wrapper.vm.multipleTemplatesPayload).toEqual({
      items: ['a', 'b'],
      excludedItems: [{ resourceId: 'x' }],
      selectAll: false,
      filter: wrapper.vm.axiosPayload.filter
    })
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('handleMultipleDelete uses totalNumberOfRecords for selectAll=true', () => {
    const wrapper = createWrapper()
    wrapper.vm.serverSideProps.totalNumberOfRecords = 33
    wrapper.vm.axiosPayload.filter = { FilterGroups: [] }

    wrapper.vm.handleMultipleDelete([{ resourceId: 'a' }], [], true)

    expect(wrapper.vm.multipleDeletedTemplatesCount).toBe(33)
    expect(wrapper.vm.multipleTemplatesPayload.items).toEqual([])
    expect(wrapper.vm.multipleTemplatesPayload.selectAll).toBe(true)
  })

  it('handleActionDelete switches to single delete mode and sets selected row', () => {
    const wrapper = createWrapper()
    const row = { resourceId: 'row-1' }

    wrapper.vm.handleActionDelete(row)

    expect(wrapper.vm.isMultipleDelete).toBe(false)
    expect(wrapper.vm.selectedEmailTemplate).toEqual(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('exportEmailTemplates maps XLS payload and creates download links', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { href: '', download: '', click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    }
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    Templates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 2,
      pageSize: 25
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(SmishingService.exportTextMessageTemplates).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(SmishingService.exportTextMessageTemplates).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportEmailTemplates keeps lowercase xls payload and still downloads xlsx', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }
    const createdLinks = []
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const link = { href: '', download: '', click: jest.fn() }
        createdLinks.push(link)
        return link
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    }
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test')

    Templates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['xls'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(SmishingService.exportTextMessageTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls' })
    )
    expect(createdLinks[0].download).toBe('smishing-templates.xlsx')
    expect(createdLinks[0].click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportEmailTemplates uses lowercased extension for non-xls types', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }
    const createdLinks = []
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        const link = { href: '', download: '', click: jest.fn() }
        createdLinks.push(link)
        return link
      }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    }
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:test')

    Templates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(createdLinks[0].download).toBe('smishing-templates.csv')
    expect(createdLinks[0].click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportEmailTemplates with empty exportTypes does not call API', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    Templates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: [],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await Promise.resolve()

    expect(SmishingService.exportTextMessageTemplates).not.toHaveBeenCalled()
  })

  it('checkIfCanCloseNewEmailTemplate delegates to child modal', () => {
    const wrapper = createWrapper()
    const changeNewEmailTemplateModalStatus = jest.fn()
    wrapper.vm.$refs = { newEmailTemplate: { changeNewEmailTemplateModalStatus } }

    wrapper.vm.checkIfCanCloseNewEmailTemplate()

    expect(changeNewEmailTemplateModalStatus).toHaveBeenCalled()
  })

  it('checkIfCanCloseNewEmailTemplate is safe when child ref is missing', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}
    expect(() => wrapper.vm.checkIfCanCloseNewEmailTemplate()).not.toThrow()
  })

  it('checkIfCanCloseGrapesJSModal delegates only when nested ref exists', () => {
    const wrapper = createWrapper()
    const toggleShowGrapesModal = jest.fn()
    wrapper.vm.$refs = {
      newEmailTemplate: { $refs: { refEmailTemplate: { toggleShowGrapesModal } } }
    }
    wrapper.vm.checkIfCanCloseGrapesJSModal()
    expect(toggleShowGrapesModal).toHaveBeenCalled()

    wrapper.vm.$refs = { newEmailTemplate: { $refs: {} } }
    expect(() => wrapper.vm.checkIfCanCloseGrapesJSModal()).not.toThrow()

    wrapper.vm.$refs = {}
    expect(() => wrapper.vm.checkIfCanCloseGrapesJSModal()).not.toThrow()
  })

  it('onShowRenameAttachmentModal and onCloseRenameAttachmentModal update modal state', () => {
    const ctx = {
      isRenameAttachmentModalVisible: false,
      attachmentName: 'old-name'
    }

    Templates.methods.onShowRenameAttachmentModal.call(ctx)
    expect(ctx.isRenameAttachmentModalVisible).toBe(true)

    Templates.methods.onCloseRenameAttachmentModal.call(ctx)
    expect(ctx.isRenameAttachmentModalVisible).toBe(false)
    expect(ctx.attachmentName).toBe('')
  })

  it('onConfirmRenameAttachment renames file object when attachment has name', () => {
    const originalFile = new File(['abc'], 'old.pdf', { type: 'application/pdf' })
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      attachmentName: 'renamed-file',
      $refs: {
        refAttachmentNameForm: { validate: jest.fn(() => true) },
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [originalFile]
          },
          isPhishingFileModified: false
        }
      },
      onCloseRenameAttachmentModal
    }

    Templates.methods.onConfirmRenameAttachment.call(ctx)

    const renamed = ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0]
    expect(renamed.name).toBe('renamed-file.pdf')
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(true)
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('onConfirmRenameAttachment renames metadata object when name is missing', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      attachmentName: 'renamed-meta',
      $refs: {
        refAttachmentNameForm: { validate: jest.fn(() => true) },
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ fileName: 'old-name.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }]
          },
          isPhishingFileModified: false
        }
      },
      onCloseRenameAttachmentModal
    }

    Templates.methods.onConfirmRenameAttachment.call(ctx)

    expect(ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0].fileName).toBe(
      'renamed-meta.docx'
    )
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(true)
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('onConfirmRenameAttachment does nothing when form validation fails', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const original = { fileName: 'old.txt' }
    const ctx = {
      attachmentName: 'new-name',
      $refs: {
        refAttachmentNameForm: { validate: jest.fn(() => false) },
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [original]
          },
          isPhishingFileModified: false
        }
      },
      onCloseRenameAttachmentModal
    }

    Templates.methods.onConfirmRenameAttachment.call(ctx)

    expect(ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0]).toBe(original)
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(false)
    expect(onCloseRenameAttachmentModal).not.toHaveBeenCalled()
  })

  it('handleSuccessDeleteAction resets table selection and refreshes data', () => {
    const wrapper = createWrapper()
    const resetSelectableParams = jest.fn()
    wrapper.vm.$refs = { refEmailTemplatesList: { resetSelectableParams } }
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.showDeleteModal = true

    wrapper.vm.handleSuccessDeleteAction()

    expect(resetSelectableParams).toHaveBeenCalled()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleSuccessMultipleDeleteAction is safe without table ref and still refreshes', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {}
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.showDeleteModal = true

    expect(() => wrapper.vm.handleSuccessMultipleDeleteAction()).not.toThrow()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('handleSuccessMultipleDeleteAction resets selection when table ref exists', () => {
    const wrapper = createWrapper()
    const resetSelectableParams = jest.fn()
    wrapper.vm.$refs = { refEmailTemplatesList: { resetSelectableParams } }
    wrapper.vm.callForData = jest.fn()
    wrapper.vm.showDeleteModal = true

    wrapper.vm.handleSuccessMultipleDeleteAction()

    expect(resetSelectableParams).toHaveBeenCalled()
    expect(wrapper.vm.showDeleteModal).toBe(false)
    expect(wrapper.vm.callForData).toHaveBeenCalled()
  })

  it('getTextMessage computed returns template or undefined fallback', () => {
    const withValue = Templates.computed.getTextMessage.call({
      emailTemplateParams: { template: 'SMS body' }
    })
    const withoutValue = Templates.computed.getTextMessage.call({
      emailTemplateParams: null
    })

    expect(withValue).toBe('SMS body')
    expect(withoutValue).toBeUndefined()
  })

  it('onConfirmRenameAttachment is safe when newEmailTemplate ref is missing', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      attachmentName: 'renamed',
      $refs: {
        refAttachmentNameForm: { validate: jest.fn(() => true) }
      },
      onCloseRenameAttachmentModal
    }

    expect(() => Templates.methods.onConfirmRenameAttachment.call(ctx)).not.toThrow()
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('onConfirmRenameAttachment is no-op when attachment form ref is missing', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      attachmentName: 'renamed',
      $refs: {
        newEmailTemplate: {
          formValues: { attachmentFiles: [{ fileName: 'old.pdf' }] },
          isPhishingFileModified: false
        }
      },
      onCloseRenameAttachmentModal
    }

    Templates.methods.onConfirmRenameAttachment.call(ctx)

    expect(ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0].fileName).toBe('old.pdf')
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(false)
    expect(onCloseRenameAttachmentModal).not.toHaveBeenCalled()
  })

  it('beforeDestroy clears active timeout id', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout').mockImplementation(() => {})

    Templates.beforeDestroy.call({ timeoutId: 12345 })

    expect(clearTimeoutSpy).toHaveBeenCalledWith(12345)
    clearTimeoutSpy.mockRestore()
  })

  it('mounted calls language loader, data loader and preferred language loader', () => {
    const callForLanguages = jest.fn()
    const callForData = jest.fn()
    const callForPreferredLanguageTypes = jest.fn()
    const ctx = {
      callForLanguages,
      callForData,
      callForPreferredLanguageTypes
    }

    Templates.mounted.call(ctx)

    expect(callForLanguages).toHaveBeenCalledWith('refEmailTemplatesList')
    expect(callForData).toHaveBeenCalled()
    expect(callForPreferredLanguageTypes).toHaveBeenCalled()
  })

  it('callForPreferredLanguageTypes maps isoFriendlyName and falls back to existing text', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'en', isoFriendlyName: 'English' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [
            { value: 'en', text: 'EN-old' },
            { value: 'tr', text: 'Turkish' },
            { value: 'de', text: '' }
          ]
        }
      }
    })

    const ctx = { preferredLanguageTypes: [] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([
      { value: 'en', text: 'English' },
      { value: 'tr', text: 'Turkish' }
    ])
  })

  it('callForPreferredLanguageTypes returns empty list when scenario API shape is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'en', name: 'English Name Field' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({ data: { data: {} } })

    const ctx = { preferredLanguageTypes: [{ value: 'x', text: 'old' }] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([])
  })

  it('callForPreferredLanguageTypes sets empty list when lookup request fails', async () => {
    LookupLocalStorage.getSingle.mockRejectedValueOnce(new Error('lookup-fail'))
    const ctx = { preferredLanguageTypes: [{ value: 'x', text: 'old' }] }

    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([])
  })

  it('callForPreferredLanguageTypes falls back to language name when isoFriendlyName is missing', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'fr', name: 'French' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'fr', text: '' }]
        }
      }
    })

    const ctx = { preferredLanguageTypes: [] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([{ value: 'fr', text: 'French' }])
  })

  it('callForPreferredLanguageTypes uses incoming preferred text when lookup options are null', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(null)
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'it', text: 'Italian' }]
        }
      }
    })

    const ctx = { preferredLanguageTypes: [] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([{ value: 'it', text: 'Italian' }])
  })

  it('callForPreferredLanguageTypes falls back to preferred text when matched lookup option text is empty', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'es', isoFriendlyName: '' }
    ])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'es', text: 'Spanish' }]
        }
      }
    })

    const ctx = { preferredLanguageTypes: [] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([{ value: 'es', text: 'Spanish' }])
  })

  it('callForPreferredLanguageTypes filters out item when resolved text is empty', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([{ resourceId: 'pt', isoFriendlyName: '' }])
    getScenarioDataDetails.mockResolvedValueOnce({
      data: {
        data: {
          preferredLanguageTypes: [{ value: 'pt', text: '' }]
        }
      }
    })

    const ctx = { preferredLanguageTypes: [{ value: 'old', text: 'Old' }] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([])
  })

  it('callForPreferredLanguageTypes sets empty list when scenario details request fails', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { resourceId: 'en', isoFriendlyName: 'English' }
    ])
    getScenarioDataDetails.mockRejectedValueOnce(new Error('scenario-fail'))

    const ctx = { preferredLanguageTypes: [{ value: 'x', text: 'old' }] }
    Templates.methods.callForPreferredLanguageTypes.call(ctx)
    await flushPromises()

    expect(ctx.preferredLanguageTypes).toEqual([])
  })
})
