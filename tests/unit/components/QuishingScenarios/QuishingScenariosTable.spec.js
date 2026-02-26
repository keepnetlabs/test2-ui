jest.mock('@/api/quishing', () => ({
  searchScenarios: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportScenarios: jest.fn(() => Promise.resolve({ data: 'mock-export-blob' })),
  getQuishingPdfScenarioPreviewContent: jest.fn(() =>
    Promise.resolve({ data: 'mock-preview-blob' })
  )
}))

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(() => [{ FieldName: 'mappedField', Value: 'mappedValue' }]),
  columnFilterCleared: jest.fn(() => [{ FieldName: 'keptField', Value: 'keptValue' }])
}))

import QuishingScenariosTable from '@/components/QuishingScenarios/QuishingScenariosTable.vue'
import QuishingService from '@/api/quishing'
import { QUISHING_EMAIL_TEMPLATE_TYPES } from '@/components/QuishingEmailTemplates/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingScenariosTable.vue', () => {
  it('data() sets disabled states from permissions and default template types', () => {
    const vmData = QuishingScenariosTable.data.call({
      $store: {
        getters: {
          'permissions/getQuishingCampaignManagerParentCreatePermissions': false,
          'permissions/getQuishingScenariosEditPermissions': false,
          'permissions/getQuishingScenariosDeletePermissions': false,
          'permissions/getQuishingScenariosExportPermissions': false,
          'permissions/getQuishingScenariosCreatePermissions': false
        }
      }
    })

    expect(vmData.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])
    expect(vmData.tableOptions.rowActions[0].disabled).toBe(true)
    expect(vmData.tableOptions.rowActions[1].disabled).toBe(true)
    expect(vmData.tableOptions.rowActions[4].disabled).toBe(true)
    expect(vmData.tableOptions.downloadButton.disabled).toBe(true)
    expect(vmData.tableOptions.empty.disabled).toBe(true)
    expect(vmData.tableOptions.addButton.disabled).toBe(true)
  })

  it('handleFastLaunch emits on-fast-launch', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleFastLaunch.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-fast-launch', row)
  })

  it('handleEmitScenarioModal emits on-edit-or-new', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleEmitScenarioModal.call(ctx, row, false)
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit-or-new', row, false)
  })

  it('handlePreview emits on-preview', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handlePreview.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-preview', row)
  })

  it('handleDelete emits on-delete', () => {
    const ctx = { $emit: jest.fn() }
    const row = { resourceId: 's1' }
    QuishingScenariosTable.methods.handleDelete.call(ctx, row)
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', row)
  })

  it('preferredLanguageTypes computed returns lookup value or fallback', () => {
    const withValue = QuishingScenariosTable.computed.preferredLanguageTypes.call({
      scenarioDetailsLookup: { preferredLanguageTypes: ['English'] }
    })
    const withoutValue = QuishingScenariosTable.computed.preferredLanguageTypes.call({
      scenarioDetailsLookup: null
    })

    expect(withValue).toEqual(['English'])
    expect(withoutValue).toEqual([])
  })

  it('restoreQuishingTypeFilter updates activeTemplateTypes from saved selectValue', () => {
    const ctx = {
      $refs: {
        refScenariosList: {
          filterValues: {
            quishingType: { selectValue: 'Email,IndividualPrintout' }
          }
        }
      },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    }

    QuishingScenariosTable.methods.restoreQuishingTypeFilter.call(ctx)

    expect(ctx.activeTemplateTypes).toEqual(['Email', 'IndividualPrintout'])
  })

  it('restoreQuishingTypeFilter keeps activeTemplateTypes when saved value is missing', () => {
    const original = [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    const ctx = {
      $refs: { refScenariosList: {} },
      activeTemplateTypes: [...original]
    }

    QuishingScenariosTable.methods.restoreQuishingTypeFilter.call(ctx)

    expect(ctx.activeTemplateTypes).toEqual(original)
  })

  it('restoreQuishingTypeFilter accepts direct string filter object format', () => {
    const ctx = {
      $refs: {
        refScenariosList: {
          filterValues: {
            quishingType: 'Email,IndividualPrintout'
          }
        }
      },
      activeTemplateTypes: []
    }

    QuishingScenariosTable.methods.restoreQuishingTypeFilter.call(ctx)

    expect(ctx.activeTemplateTypes).toEqual(['Email', 'IndividualPrintout'])
  })

  it('restoreQuishingTypeFilter accepts array selectValue and removes empty entries', () => {
    const ctx = {
      $refs: {
        refScenariosList: {
          filterValues: {
            quishingType: { selectValue: ['Email', '', 'IndividualPrintout'] }
          }
        }
      },
      activeTemplateTypes: []
    }

    QuishingScenariosTable.methods.restoreQuishingTypeFilter.call(ctx)

    expect(ctx.activeTemplateTypes).toEqual(['Email', 'IndividualPrintout'])
  })

  it('restoreQuishingTypeFilter throws when saved selectValue is empty string', () => {
    const ctx = {
      $refs: {
        refScenariosList: {
          filterValues: {
            quishingType: { selectValue: '' }
          }
        }
      },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    }

    expect(() =>
      QuishingScenariosTable.methods.restoreQuishingTypeFilter.call(ctx)
    ).toThrow()
  })

  it('callForData maps language names and updates server-side props', async () => {
    QuishingService.searchScenarios.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ languageTypeName: 'en-US', name: 'Scenario A' }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const setLoading = jest.fn()
    const ctx = {
      setLoading,
      axiosPayload: { filter: { FilterGroups: [[], []] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      languageFilterOptions: [{ languageName: 'en-US', text: 'English' }],
      serverSideProps: {},
      tableData: []
    }

    QuishingScenariosTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(ctx.axiosPayload.templateTypes).toEqual([QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData[0].languageTypeName).toBe('English')
  })

  it('callForData keeps original language when language filter option is missing', async () => {
    QuishingService.searchScenarios.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ languageTypeName: 'xx-YY', name: 'Scenario B' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: { filter: { FilterGroups: [[], []] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      languageFilterOptions: [{ languageName: 'en-US', text: 'English' }],
      serverSideProps: {},
      tableData: []
    }

    QuishingScenariosTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languageTypeName).toBe('xx-YY')
  })

  it('callForData handles missing payload data by falling back to empty table', async () => {
    QuishingService.searchScenarios.mockResolvedValueOnce({
      data: {
        data: {}
      }
    })
    const setLoading = jest.fn()
    const ctx = {
      setLoading,
      axiosPayload: { filter: { FilterGroups: [[], []] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      languageFilterOptions: [],
      serverSideProps: {
        totalNumberOfRecords: 99,
        totalNumberOfPages: 9,
        pageNumber: 3
      },
      tableData: [{ resourceId: 'old' }]
    }

    QuishingScenariosTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.serverSideProps.totalNumberOfRecords).toBeUndefined()
    expect(ctx.serverSideProps.totalNumberOfPages).toBeUndefined()
    expect(ctx.serverSideProps.pageNumber).toBeUndefined()
    expect(ctx.tableData).toEqual([])
    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenLastCalledWith()
  })

  it('columnFilterChanged handles quishingType filter with value', () => {
    const ctx = {
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'quishingType',
      Value: 'Email,IndividualPrintout'
    })

    expect(ctx.activeTemplateTypes).toEqual(['Email', 'IndividualPrintout'])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterChanged resets quishingType filter when value is empty', () => {
    const ctx = {
      activeTemplateTypes: ['SomethingElse'],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'quishingType',
      Value: ''
    })

    expect(ctx.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterChanged resets quishingType filter when value is undefined', () => {
    const ctx = {
      activeTemplateTypes: ['SomethingElse'],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'quishingType'
    })

    expect(ctx.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterChanged delegates non-quishingType filters to helper mapping', () => {
    const ctx = {
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterChanged.call(ctx, {
      FieldName: 'name',
      Value: 'Scenario'
    })

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'mappedField', Value: 'mappedValue' }
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterCleared resets quishingType and calls refresh', () => {
    const ctx = {
      activeTemplateTypes: ['Other'],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [{ FieldName: 'x' }] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterCleared.call(ctx, 'quishingType')

    expect(ctx.activeTemplateTypes).toEqual([
      QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL,
      QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterCleared delegates non-quishingType fields to helper mapping', () => {
    const ctx = {
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      callForData: jest.fn()
    }

    QuishingScenariosTable.methods.columnFilterCleared.call(ctx, 'name')

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'keptField', Value: 'keptValue' }
    ])
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleMultipleDelete emits payload with table context', () => {
    const ctx = {
      $emit: jest.fn(),
      axiosPayload: { pageNumber: 1 },
      serverSideProps: { totalNumberOfRecords: 15 }
    }
    const selections = [{ resourceId: '1' }]
    const excludedItems = [{ resourceId: '2' }]

    QuishingScenariosTable.methods.handleMultipleDelete.call(
      ctx,
      selections,
      excludedItems,
      true
    )

    expect(ctx.$emit).toHaveBeenCalledWith('on-multiple-delete', {
      selections,
      excludedItems,
      selectAll: true,
      axiosPayload: ctx.axiosPayload,
      serverSideProps: ctx.serverSideProps
    })
  })

  it('handleFastLaunch/handleEmitScenarioModal/handlePreview/handleDelete use default row argument', () => {
    const ctx = { $emit: jest.fn() }

    QuishingScenariosTable.methods.handleFastLaunch.call(ctx)
    QuishingScenariosTable.methods.handleEmitScenarioModal.call(ctx)
    QuishingScenariosTable.methods.handlePreview.call(ctx)
    QuishingScenariosTable.methods.handleDelete.call(ctx)

    expect(ctx.$emit).toHaveBeenCalledWith('on-fast-launch', {})
    expect(ctx.$emit).toHaveBeenCalledWith('on-edit-or-new', {}, false)
    expect(ctx.$emit).toHaveBeenCalledWith('on-preview', {})
    expect(ctx.$emit).toHaveBeenCalledWith('on-delete', {})
  })

  it('checkRowIsIndividualPrintout returns true only for individual printout type', () => {
    const isTrue = QuishingScenariosTable.methods.checkRowIsIndividualPrintout.call({}, {
      quishingType: QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT
    })
    const isFalse = QuishingScenariosTable.methods.checkRowIsIndividualPrintout.call({}, {
      quishingType: 'email'
    })

    expect(isTrue).toBe(true)
    expect(isFalse).toBe(false)
  })

  it('checkRowIsIndividualPrintout throws when row quishingType is missing', () => {
    expect(() => QuishingScenariosTable.methods.checkRowIsIndividualPrintout.call({}, {})).toThrow()
  })

  it('exportScenarios maps XLS payload and triggers link click', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { href: '', download: '', click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    }
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test-url')
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    }

    QuishingScenariosTable.methods.exportScenarios.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 3,
      pageSize: 50
    })
    await flushPromises()

    expect(QuishingService.exportScenarios).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(QuishingService.exportScenarios).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('exportScenarios keeps lowercase xls payload type and still downloads xlsx', async () => {
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
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:test-url')
    }
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test-url')
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } },
      activeTemplateTypes: [QUISHING_EMAIL_TEMPLATE_TYPES.EMAIL]
    }

    QuishingScenariosTable.methods.exportScenarios.call(ctx, {
      exportTypes: ['xls'],
      reportAllPages: false,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(QuishingService.exportScenarios).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls' })
    )
    expect(createdLinks[0].download).toBe('Quishing-Scenarios.xlsx')
    expect(createdLinks[0].click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('handlePrintPreview sets window title after file preview opens', async () => {
    jest.useFakeTimers()
    const openWindow = {
      document: { title: '' },
      onload: null
    }
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => openWindow)
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:preview')
    }
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:preview')

    QuishingScenariosTable.methods.handlePrintPreview.call({}, { resourceId: 'q-1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(QuishingService.getQuishingPdfScenarioPreviewContent).toHaveBeenCalledWith('q-1')
    expect(openSpy).toHaveBeenCalledWith('blob:preview')
    openWindow.onload()
    jest.runAllTimers()
    expect(openWindow.document.title).toBe('Quishing PDF Preview')

    createObjectURLSpy.mockRestore()
    openSpy.mockRestore()
    jest.useRealTimers()
  })

  it('scenarioDetailsLookup watcher maps method/difficulty items to filter lists', () => {
    const setSpy = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      $set: setSpy,
      tableOptions: {
        columns: [{}, {}, {}, {}, {}, {}]
      }
    }
    const lookup = {
      methodTypes: [{ text: 'QR' }, { text: 'Link' }],
      difficultyTypes: [{ text: 'Easy' }, { text: 'Hard' }]
    }

    const scenarioWatcher = QuishingScenariosTable.watch.scenarioDetailsLookup
    if (typeof scenarioWatcher === 'function') {
      scenarioWatcher.call(ctx, lookup)
    } else {
      scenarioWatcher.handler.call(ctx, lookup)
    }

    expect(setSpy).toHaveBeenNthCalledWith(
      1,
      ctx.tableOptions.columns[2],
      'filterableItems',
      [
        { text: 'QR', value: 'QR' },
        { text: 'Link', value: 'Link' }
      ]
    )
    expect(setSpy).toHaveBeenNthCalledWith(
      2,
      ctx.tableOptions.columns[5],
      'filterableItems',
      [
        { text: 'Easy', value: 'Easy' },
        { text: 'Hard', value: 'Hard' }
      ]
    )
  })

  it('scenarioDetailsLookup watcher returns early when incoming value is falsy', () => {
    const setSpy = jest.fn()
    const ctx = {
      $set: setSpy,
      tableOptions: {
        columns: [{}, {}, {}, {}, {}, {}]
      }
    }

    const scenarioWatcher = QuishingScenariosTable.watch.scenarioDetailsLookup
    if (typeof scenarioWatcher === 'function') {
      scenarioWatcher.call(ctx, null)
    } else {
      scenarioWatcher.handler.call(ctx, null)
    }

    expect(setSpy).not.toHaveBeenCalled()
  })

  it('scenarioDetailsLookup watcher sets empty filter lists when method/difficulty are missing', () => {
    const setSpy = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      $set: setSpy,
      tableOptions: {
        columns: [{}, {}, {}, {}, {}, {}]
      }
    }

    const scenarioWatcher = QuishingScenariosTable.watch.scenarioDetailsLookup
    if (typeof scenarioWatcher === 'function') {
      scenarioWatcher.call(ctx, {})
    } else {
      scenarioWatcher.handler.call(ctx, {})
    }

    expect(setSpy).toHaveBeenNthCalledWith(1, ctx.tableOptions.columns[2], 'filterableItems', [])
    expect(setSpy).toHaveBeenNthCalledWith(2, ctx.tableOptions.columns[5], 'filterableItems', [])
  })

  it('mounted calls language loader and then restores filter + fetches data in nextTick', () => {
    const callForLanguages = jest.fn()
    const restoreQuishingTypeFilter = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      callForLanguages,
      restoreQuishingTypeFilter,
      callForData,
      $nextTick: (cb) => cb()
    }

    QuishingScenariosTable.mounted.call(ctx)

    expect(callForLanguages).toHaveBeenCalledWith('refScenariosList')
    expect(restoreQuishingTypeFilter).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handlePrintPreview uses default row argument and passes undefined resourceId', async () => {
    const openWindow = {
      document: { title: '' },
      onload: null
    }
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => openWindow)
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = jest.fn(() => 'blob:preview-default')
    }
    const createObjectURLSpy = jest
      .spyOn(globalThis.URL, 'createObjectURL')
      .mockImplementation(() => 'blob:preview-default')

    QuishingScenariosTable.methods.handlePrintPreview.call({})
    await flushPromises()

    expect(QuishingService.getQuishingPdfScenarioPreviewContent).toHaveBeenCalledWith(undefined)
    expect(openSpy).toHaveBeenCalledWith('blob:preview-default')

    createObjectURLSpy.mockRestore()
    openSpy.mockRestore()
  })
})
