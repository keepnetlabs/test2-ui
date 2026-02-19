jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchQuishingEmailTemplates: jest.fn(),
    exportQuishingEmailTemplates: jest.fn(),
    getQuishingPdfPreviewContent: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'name', Value: 'x' }]),
  columnFilterCleared: jest.fn(() => [])
}))

import QuishingService from '@/api/quishing'
import QuishingEmailTemplatesTable from '@/components/QuishingEmailTemplates/QuishingEmailTemplatesTable.vue'
import {
  QUISHING_EMAIL_TEMPLATE_TYPES
} from '@/components/QuishingEmailTemplates/utils'
import {
  columnFilterChanged as columnFilterChangedHelper,
  columnFilterCleared as columnFilterClearedHelper
} from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingEmailTemplatesTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('data() builds permission-aware row actions', () => {
    const data = QuishingEmailTemplatesTable.data.call({
      $store: {
        getters: {
          'permissions/getQuishingEmailTemplatesEditPermissions': false,
          'permissions/getQuishingEmailTemplatesDeletePermissions': true,
          'permissions/getQuishingEmailTemplatesExportPermissions': false,
          'permissions/getQuishingEmailTemplatesCreatePermissions': true
        }
      }
    })

    expect(data.tableOptions.rowActions[1].disabled).toBe(true)
    expect(data.tableOptions.rowActions[3].disabled).toBe(false)
    expect(data.tableOptions.downloadButton.disabled).toBe(true)
    expect(data.tableOptions.addButton.disabled).toBe(false)
  })

  it('restoreQuishingTypeFilter reads DataTable filter values safely', () => {
    const ctx = {
      $refs: {
        refEmailTemplatesList: {
          filterValues: { quishingType: { selectValue: 'email,individual,' } }
        }
      },
      activeTemplateTypes: []
    }

    QuishingEmailTemplatesTable.methods.restoreQuishingTypeFilter.call(ctx)
    expect(ctx.activeTemplateTypes).toEqual(['email', 'individual'])

    const noRefCtx = { $refs: {}, activeTemplateTypes: ['email'] }
    QuishingEmailTemplatesTable.methods.restoreQuishingTypeFilter.call(noRefCtx)
    expect(noRefCtx.activeTemplateTypes).toEqual(['email'])
  })

  it('checkIsQuishingTypePrintout handles row and null values', () => {
    expect(
      QuishingEmailTemplatesTable.methods.checkIsQuishingTypePrintout.call({}, {
        quishingType: 'INDIVIDUAL'
      })
    ).toBe(true)
    expect(
      QuishingEmailTemplatesTable.methods.checkIsQuishingTypePrintout.call({}, {
        quishingType: 'email'
      })
    ).toBe(false)
    expect(QuishingEmailTemplatesTable.methods.checkIsQuishingTypePrintout.call({}, null)).toBe(
      false
    )
  })

  it('callForData sets loading, maps language names and updates serverSideProps', async () => {
    QuishingService.searchQuishingEmailTemplates.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 15,
          totalNumberOfPages: 2,
          pageNumber: 1,
          results: [
            { id: '1', languageTypeName: 'EN' },
            { id: '2', languageTypeName: 'DE' }
          ]
        }
      }
    })

    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      languageFilterOptions: [{ languageName: 'EN', text: 'English' }],
      serverSideProps: {},
      tableData: []
    }

    QuishingEmailTemplatesTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(ctx.axiosPayload.templateTypes).toEqual([QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(15)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData[0].languageTypeName).toBe('English')
    expect(ctx.tableData[1].languageTypeName).toBe('DE')
    expect(ctx.setLoading).toHaveBeenCalledTimes(2)
  })

  it('emit handlers route to proper events', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      checkIsQuishingTypePrintout: QuishingEmailTemplatesTable.methods.checkIsQuishingTypePrintout
    }

    QuishingEmailTemplatesTable.methods.handleEmitEmailTemplateModal.call(
      ctx,
      { quishingType: 'individual' },
      true
    )
    QuishingEmailTemplatesTable.methods.handleEmitEmailTemplateModal.call(
      ctx,
      { quishingType: 'email' },
      false
    )
    QuishingEmailTemplatesTable.methods.handlePreview.call(ctx, { id: 1 })
    QuishingEmailTemplatesTable.methods.handleDelete.call(ctx, { id: 2 })
    QuishingEmailTemplatesTable.methods.handleMultipleDelete.call(
      { ...ctx, axiosPayload: { a: 1 }, serverSideProps: { p: 1 } },
      ['s1'],
      ['e1'],
      true
    )

    expect(emit).toHaveBeenCalledWith(
      'on-add-individual-printout-template',
      { quishingType: 'individual' },
      true
    )
    expect(emit).toHaveBeenCalledWith('on-edit-or-new', { quishingType: 'email' }, false)
    expect(emit).toHaveBeenCalledWith('on-preview', { id: 1 })
    expect(emit).toHaveBeenCalledWith('on-delete', { id: 2 })
    expect(emit).toHaveBeenCalledWith('on-multiple-delete', {
      selections: ['s1'],
      excludedItems: ['e1'],
      selectAll: true,
      axiosPayload: { a: 1 },
      serverSideProps: { p: 1 }
    })
  })

  it('handleAddQuishingTemplate emits based on selected item text', () => {
    const emit = jest.fn()
    const ctx = {
      $emit: emit,
      addQuishingItems: [
        { text: 'Email Template' },
        { text: 'Individual Printout Template' }
      ],
      handleEmitEmailTemplateModal: jest.fn()
    }

    QuishingEmailTemplatesTable.methods.handleAddQuishingTemplate.call(ctx, {
      text: 'Email Template'
    })
    QuishingEmailTemplatesTable.methods.handleAddQuishingTemplate.call(ctx, {
      text: 'Individual Printout Template'
    })
    QuishingEmailTemplatesTable.methods.handleAddQuishingTemplate.call(ctx, null)

    expect(ctx.handleEmitEmailTemplateModal).toHaveBeenCalledWith(null, false)
    expect(emit).toHaveBeenCalledWith('on-add-individual-printout-template', null, false)
  })

  it('exportQuishingEmailTemplates exports each selected type and triggers download', async () => {
    QuishingService.exportQuishingEmailTemplates.mockResolvedValue({ data: new Blob(['x']) })
    if (!window.URL.createObjectURL) window.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:quishing')
    const click = jest.fn()
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue({ href: '', download: '', click })

    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    }

    QuishingEmailTemplatesTable.methods.exportQuishingEmailTemplates.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 20
    })
    await flushPromises()

    expect(QuishingService.exportQuishingEmailTemplates).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel', reportAllPages: true })
    )
    expect(QuishingService.exportQuishingEmailTemplates).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV', reportAllPages: true })
    )
    expect(click).toHaveBeenCalledTimes(2)
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2)

    createObjectURLSpy.mockRestore()
    createElementSpy.mockRestore()
  })

  it('handlePrintPreview opens blob url and sets preview title', async () => {
    jest.useFakeTimers()
    QuishingService.getQuishingPdfPreviewContent.mockResolvedValueOnce({
      data: new Blob(['pdf'])
    })
    const newWindow = { onload: null, document: { title: '' } }
    const openSpy = jest.spyOn(window, 'open').mockReturnValue(newWindow)
    if (!window.URL.createObjectURL) window.URL.createObjectURL = jest.fn()
    const createObjectURLSpy = jest
      .spyOn(window.URL, 'createObjectURL')
      .mockReturnValue('blob:pdf')

    QuishingEmailTemplatesTable.methods.handlePrintPreview.call({}, { resourceId: 'rid-1' })
    await Promise.resolve()
    await Promise.resolve()
    newWindow.onload()
    jest.runAllTimers()

    expect(QuishingService.getQuishingPdfPreviewContent).toHaveBeenCalledWith('rid-1')
    expect(openSpy).toHaveBeenCalledWith('blob:pdf')
    expect(newWindow.document.title).toBe('Quishing PDF Preview')

    openSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('columnFilterChanged updates template types or filter items and refreshes data', () => {
    const ctx = {
      activeTemplateTypes: [],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: ['old'] }] } },
      callForData: jest.fn()
    }

    QuishingEmailTemplatesTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'quishingType',
      Value: ''
    })
    expect(ctx.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])

    QuishingEmailTemplatesTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'quishingType',
      Value: 'email,individual'
    })
    expect(ctx.activeTemplateTypes).toEqual(['email', 'individual'])

    QuishingEmailTemplatesTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'name',
      Value: 'abc'
    })
    expect(columnFilterChangedHelper).toHaveBeenCalled()
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'name', Value: 'x' }
    ])
    expect(ctx.callForData).toHaveBeenCalledTimes(3)
  })

  it('columnFilterCleared resets template types or clears filter items and refreshes data', () => {
    const ctx = {
      activeTemplateTypes: ['email'],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: ['old'] }] } },
      callForData: jest.fn()
    }

    QuishingEmailTemplatesTable.methods.columnFilterCleared.call(ctx, 'quishingType')
    expect(ctx.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])

    QuishingEmailTemplatesTable.methods.columnFilterCleared.call(ctx, 'name')
    expect(columnFilterClearedHelper).toHaveBeenCalledWith('name', ctx.axiosPayload)
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(ctx.callForData).toHaveBeenCalledTimes(2)
  })
})
