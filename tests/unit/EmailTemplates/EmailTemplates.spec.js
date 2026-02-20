import EmailTemplates from '@/components/PhishingScenarios/EmailTemplates.vue'
import {
  getEmailTemplatesList,
  exportEmailTemplates
} from '@/api/phishingsimulator'

jest.mock('@/api/phishingsimulator', () => ({
  getEmailTemplatesList: jest.fn(),
  exportEmailTemplates: jest.fn(),
  deleteEmailTemplate: jest.fn(),
  bulkDeleteEmailTemplates: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('EmailTemplates.vue methods', () => {
  let originalFile

  beforeAll(() => {
    originalFile = global.File
    global.File = function MockFile(parts, name, options = {}) {
      return {
        parts,
        name,
        type: options.type
      }
    }
  })

  afterAll(() => {
    global.File = originalFile
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('mounted calls language loader and data fetch', () => {
    const ctx = {
      callForLanguages: jest.fn(),
      callForData: jest.fn()
    }

    EmailTemplates.mounted.call(ctx)
    expect(ctx.callForLanguages).toHaveBeenCalledWith('refEmailTemplatesList')
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('beforeDestroy clears pending timeout id', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const ctx = { timeoutId: 12345 }

    EmailTemplates.beforeDestroy.call(ctx)
    expect(clearTimeoutSpy).toHaveBeenCalledWith(12345)

    clearTimeoutSpy.mockRestore()
  })

  it('onShowRenameAttachmentModal opens modal and extracts base filename', () => {
    const ctx = {
      attachmentName: '',
      isShowRenameAttachmentDialog: false,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ name: 'invoice.pdf' }]
          }
        }
      }
    }

    EmailTemplates.methods.onShowRenameAttachmentModal.call(ctx)
    expect(ctx.attachmentName).toBe('invoice')
    expect(ctx.isShowRenameAttachmentDialog).toBe(true)
  })

  it('onShowRenameAttachmentModal supports fileName field when name is missing', () => {
    const ctx = {
      attachmentName: '',
      isShowRenameAttachmentDialog: false,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ fileName: 'legacy-name.zip' }]
          }
        }
      }
    }

    EmailTemplates.methods.onShowRenameAttachmentModal.call(ctx)
    expect(ctx.attachmentName).toBe('legacy-name')
    expect(ctx.isShowRenameAttachmentDialog).toBe(true)
  })

  it('onShowRenameAttachmentModal ignores files without name and fileName', () => {
    const ctx = {
      attachmentName: '',
      isShowRenameAttachmentDialog: false,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ type: 'application/pdf' }]
          }
        }
      }
    }

    EmailTemplates.methods.onShowRenameAttachmentModal.call(ctx)
    expect(ctx.attachmentName).toBe('')
    expect(ctx.isShowRenameAttachmentDialog).toBe(false)
  })

  it('onShowRenameAttachmentModal does nothing when attachment list is empty', () => {
    const ctx = {
      attachmentName: '',
      isShowRenameAttachmentDialog: false,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: []
          }
        }
      }
    }

    EmailTemplates.methods.onShowRenameAttachmentModal.call(ctx)
    expect(ctx.attachmentName).toBe('')
    expect(ctx.isShowRenameAttachmentDialog).toBe(false)
  })

  it('onCloseRenameAttachmentModal closes rename dialog', () => {
    const ctx = { isShowRenameAttachmentDialog: true }

    EmailTemplates.methods.onCloseRenameAttachmentModal.call(ctx)
    expect(ctx.isShowRenameAttachmentDialog).toBe(false)
  })

  it('onConfirmRenameAttachment updates attachment with name branch and marks file modified', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      onCloseRenameAttachmentModal,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ name: 'old.pdf', type: 'application/pdf' }]
          },
          isPhishingFileModified: false,
          activeFileName: ''
        }
      }
    }

    EmailTemplates.methods.onConfirmRenameAttachment.call(ctx, 'new-name')

    expect(ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0].name).toBe('new-name.pdf')
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(true)
    expect(ctx.$refs.newEmailTemplate.activeFileName).toBe('new-name.pdf')
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('onConfirmRenameAttachment updates attachment with fileName branch', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      onCloseRenameAttachmentModal,
      $refs: {
        newEmailTemplate: {
          formValues: {
            attachmentFiles: [{ fileName: 'legacy.docx', type: 'application/docx' }]
          },
          isPhishingFileModified: false,
          activeFileName: ''
        }
      }
    }

    EmailTemplates.methods.onConfirmRenameAttachment.call(ctx, 'renamed')

    expect(ctx.$refs.newEmailTemplate.formValues.attachmentFiles[0].fileName).toBe('renamed.docx')
    expect(ctx.$refs.newEmailTemplate.isPhishingFileModified).toBe(true)
    expect(ctx.$refs.newEmailTemplate.activeFileName).toBe('renamed.docx')
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('onConfirmRenameAttachment safely closes dialog when newEmailTemplate ref is missing', () => {
    const onCloseRenameAttachmentModal = jest.fn()
    const ctx = {
      onCloseRenameAttachmentModal,
      $refs: {}
    }

    EmailTemplates.methods.onConfirmRenameAttachment.call(ctx, 'name')
    expect(onCloseRenameAttachmentModal).toHaveBeenCalled()
  })

  it('togglePreviewDialog, handleEdit and handleEditFromPreview update state correctly', () => {
    const ctx = {
      isShowPreviewDialog: false,
      selectedEmailTemplate: {},
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      $nextTick: (cb) => cb(),
      togglePreviewDialog: jest.fn(),
      handleEdit: jest.fn()
    }

    EmailTemplates.methods.togglePreviewDialog.call(ctx, { resourceId: 'e-1' })
    expect(ctx.isShowPreviewDialog).toBe(true)
    expect(ctx.selectedEmailTemplate).toEqual({ resourceId: 'e-1' })

    EmailTemplates.methods.handleEdit.call(ctx, { resourceId: 'e-2' }, true)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(true)
    expect(ctx.emailTemplateId).toBe('e-2')

    EmailTemplates.methods.handleEditFromPreview.call(ctx, { resourceId: 'e-3' })
    expect(ctx.togglePreviewDialog).toHaveBeenCalled()
    expect(ctx.handleEdit).toHaveBeenCalledWith({ resourceId: 'e-3' }, false)
  })

  it('togglePreviewDialog uses null default when no row is passed', () => {
    const ctx = {
      isShowPreviewDialog: false,
      selectedEmailTemplate: { resourceId: 'e-1' }
    }

    EmailTemplates.methods.togglePreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(true)
    expect(ctx.selectedEmailTemplate).toBeNull()
  })

  it('togglePreviewDialog can close already opened preview state', () => {
    const ctx = {
      isShowPreviewDialog: true,
      selectedEmailTemplate: { resourceId: 'e-open' }
    }

    EmailTemplates.methods.togglePreviewDialog.call(ctx)
    expect(ctx.isShowPreviewDialog).toBe(false)
    expect(ctx.selectedEmailTemplate).toBeNull()
  })

  it('changeNewEmailTemplateModalStatus resets fields and refreshes on restart', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      emailTemplateId: 'e-1',
      isEdit: true,
      isDuplicate: true,
      callForData
    }

    EmailTemplates.methods.changeNewEmailTemplateModalStatus.call(ctx, false, true)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.emailTemplateId).toBeNull()
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(callForData).toHaveBeenCalled()
  })

  it('success delete handlers reset selectable params, close modal and refresh data', () => {
    const callForData = jest.fn()
    const resetSelectableParams = jest.fn()
    const ctx = {
      showDeleteModal: true,
      $refs: { refEmailTemplatesList: { resetSelectableParams } },
      callForData
    }

    EmailTemplates.methods.handleSuccessDeleteAction.call(ctx, {})
    expect(resetSelectableParams).toHaveBeenCalled()
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)

    callForData.mockClear()
    ctx.showDeleteModal = true
    EmailTemplates.methods.handleSuccessMultipleDeleteAction.call(ctx)
    expect(resetSelectableParams).toHaveBeenCalledTimes(2)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSuccessMultipleDeleteAction works without table ref via optional chaining', () => {
    const callForData = jest.fn()
    const ctx = {
      showDeleteModal: true,
      $refs: {},
      callForData
    }

    EmailTemplates.methods.handleSuccessMultipleDeleteAction.call(ctx)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('grapesjs and new email template close helpers delegate to nested refs', () => {
    const toggleShowGrapesModal = jest.fn()
    const changeNewEmailTemplateModalStatus = jest.fn()
    const ctx = {
      $refs: {
        newEmailTemplate: {
          $refs: { refEmailTemplate: { toggleShowGrapesModal } },
          changeNewEmailTemplateModalStatus
        }
      }
    }

    EmailTemplates.methods.checkIfCanCloseGrapesJSModal.call(ctx)
    expect(toggleShowGrapesModal).toHaveBeenCalled()

    EmailTemplates.methods.checkIfCanCloseNewEmailTemplate.call(ctx)
    expect(changeNewEmailTemplateModalStatus).toHaveBeenCalled()
  })

  it('close helper methods are no-op when refs are missing', () => {
    const ctx = { $refs: {} }
    expect(() => EmailTemplates.methods.checkIfCanCloseGrapesJSModal.call(ctx)).not.toThrow()
    expect(() => EmailTemplates.methods.checkIfCanCloseNewEmailTemplate.call(ctx)).not.toThrow()
  })

  it('checkIfCanCloseGrapesJSModal is safe when refEmailTemplate is missing', () => {
    const ctx = {
      $refs: {
        newEmailTemplate: {
          $refs: {}
        }
      }
    }
    expect(() => EmailTemplates.methods.checkIfCanCloseGrapesJSModal.call(ctx)).not.toThrow()
  })

  it('callForData maps language names and updates server props on success', async () => {
    getEmailTemplatesList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            { resourceId: 'e-1', languageTypeName: ['Turkish', 'English'] },
            { resourceId: 'e-2', languageTypeName: [] }
          ]
        }
      }
    })

    const ctx = {
      getEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [
        { languageName: 'Turkish', text: 'TR' },
        { languageName: 'English', text: 'EN' }
      ],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    EmailTemplates.methods.callForData.call(ctx)
    await flushPromises()

    expect(getEmailTemplatesList).toHaveBeenCalledWith({ pageNumber: 1 })
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0].languageTypeName).toEqual(['TR', 'EN'])
    expect(ctx.loading).toBe(false)
  })

  it('callForData keeps language code when mapping is missing', async () => {
    getEmailTemplatesList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'e-3', languageTypeName: ['Klingon'] }]
        }
      }
    })

    const ctx = {
      getEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    EmailTemplates.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.tableData[0].languageTypeName).toEqual(['Klingon'])
  })

  it('callForData keeps undefined language list as undefined', async () => {
    getEmailTemplatesList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'e-4' }]
        }
      }
    })

    const ctx = {
      getEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    EmailTemplates.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.tableData[0].languageTypeName).toBeUndefined()
  })

  it('callForData falls back to empty table when languageTypeName is not an array', async () => {
    getEmailTemplatesList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ resourceId: 'e-5', languageTypeName: 'English' }]
        }
      }
    })

    const ctx = {
      getEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: { pageNumber: 1 },
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      serverSideProps: {
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0,
        pageNumber: 0
      },
      tableData: []
    }

    EmailTemplates.methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.tableData).toEqual([])
  })

  it('callForData sets empty table on failure and does nothing without permission', async () => {
    getEmailTemplatesList.mockRejectedValueOnce(new Error('failed'))
    const errorCtx = {
      getEmailTemplatesSearchPermissions: true,
      loading: false,
      axiosPayload: {},
      languageFilterOptions: [],
      serverSideProps: {},
      tableData: [{ id: 1 }]
    }

    EmailTemplates.methods.callForData.call(errorCtx)
    await flushPromises()
    expect(errorCtx.tableData).toEqual([])
    expect(errorCtx.loading).toBe(false)

    const blockedCtx = {
      getEmailTemplatesSearchPermissions: false,
      loading: false,
      axiosPayload: {},
      languageFilterOptions: [],
      serverSideProps: {},
      tableData: []
    }
    EmailTemplates.methods.callForData.call(blockedCtx)
    expect(getEmailTemplatesList).toHaveBeenCalledTimes(1)
  })

  it('exportEmailTemplates converts XLS payload and triggers download', async () => {
    exportEmailTemplates.mockResolvedValueOnce({ data: 'blob-data' })

    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:url')

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    EmailTemplates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['XLS'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportEmailTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(link.download).toBe('EmailTemplates.xlsx')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportEmailTemplates keeps non-XLS export type and extension', async () => {
    exportEmailTemplates.mockResolvedValueOnce({ data: 'blob-data-2' })

    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:url-2')

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    EmailTemplates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 50
    })
    await flushPromises()

    expect(exportEmailTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV', reportAllPages: true })
    )
    expect(link.download).toBe('EmailTemplates.csv')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportEmailTemplates supports multiple export types in one call', async () => {
    exportEmailTemplates
      .mockResolvedValueOnce({ data: 'blob-xls' })
      .mockResolvedValueOnce({ data: 'blob-csv' })

    const links = [
      { click: jest.fn(), href: '', download: '' },
      { click: jest.fn(), href: '', download: '' }
    ]
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => links.shift())
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:url')

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    EmailTemplates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportEmailTemplates).toHaveBeenCalledTimes(2)
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })

  it('exportEmailTemplates does not call API when exportTypes is empty', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } }
    }

    EmailTemplates.methods.exportEmailTemplates.call(ctx, {
      exportTypes: [],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportEmailTemplates).not.toHaveBeenCalled()
  })

  it('handleMultipleDelete and handleActionDelete set delete modal states', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedEmailsCount: 0,
      serverSideProps: { totalNumberOfRecords: 10 },
      axiosPayload: { filter: { FilterGroups: [] } },
      multipleEmailsPayload: {},
      showDeleteModal: false,
      selectedEmailTemplate: null
    }

    EmailTemplates.methods.handleMultipleDelete.call(
      ctx,
      [{ resourceId: 'e-1' }, { resourceId: 'e-2' }],
      ['x'],
      false
    )
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedEmailsCount).toBe(2)
    expect(ctx.multipleEmailsPayload.items).toEqual(['e-1', 'e-2'])
    expect(ctx.showDeleteModal).toBe(true)

    EmailTemplates.methods.handleActionDelete.call(ctx, { resourceId: 'e-9' })
    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.selectedEmailTemplate).toEqual({ resourceId: 'e-9' })
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('handleMultipleDelete uses total count when selectAll is true', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedEmailsCount: 0,
      serverSideProps: { totalNumberOfRecords: 42 },
      axiosPayload: { filter: { FilterGroups: [] } },
      multipleEmailsPayload: {},
      showDeleteModal: false
    }

    EmailTemplates.methods.handleMultipleDelete.call(
      ctx,
      [{ resourceId: 'e-1' }],
      ['e-excluded'],
      true
    )

    expect(ctx.multipleDeletedEmailsCount).toBe(42)
    expect(ctx.multipleEmailsPayload.items).toEqual([])
    expect(ctx.multipleEmailsPayload.selectAll).toBe(true)
    expect(ctx.showDeleteModal).toBe(true)
  })
})
