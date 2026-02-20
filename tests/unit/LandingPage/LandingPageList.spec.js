jest.mock('@/api/landingPage', () => ({
  getLandingPageFormDetails: jest.fn(),
  getLandingPageList: jest.fn(),
  exportLandingPage: jest.fn(),
  deleteLandingPage: jest.fn(),
  bulkDeleteLandingPages: jest.fn()
}))

import LandingPageList from '@/components/LandingPage/LandingPageList.vue'
import {
  getLandingPageFormDetails,
  getLandingPageList,
  exportLandingPage
} from '@/api/landingPage'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('LandingPageList.vue', () => {
  const { methods, computed } = LandingPageList

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getCurrentLandingPageTemplate returns selected page content', () => {
    const ctx = {
      landingPageTemplates: [{ content: '<p>page-1</p>' }, { content: '<p>page-2</p>' }],
      selectedLandingPageIndex: 1
    }

    expect(computed.getCurrentLandingPageTemplate.call(ctx)).toBe('<p>page-2</p>')
  })

  it('getCurrentLandingPageTemplate returns undefined for out-of-range index', () => {
    const ctx = {
      landingPageTemplates: [{ content: '<p>page-1</p>' }],
      selectedLandingPageIndex: 5
    }

    expect(computed.getCurrentLandingPageTemplate.call(ctx)).toBeUndefined()
  })

  it('mounted triggers language, lookup and data loaders', () => {
    const ctx = {
      callForLanguages: jest.fn(),
      callForLookups: jest.fn(),
      callForData: jest.fn()
    }

    LandingPageList.mounted.call(ctx)
    expect(ctx.callForLanguages).toHaveBeenCalledWith('refLandingPageList')
    expect(ctx.callForLookups).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('preferredLanguageTypes computed returns list or empty array', () => {
    expect(
      computed.preferredLanguageTypes.call({
        scenarioDetailsLookup: { preferredLanguageTypes: [{ text: 'English' }] }
      })
    ).toEqual([{ text: 'English' }])

    expect(computed.preferredLanguageTypes.call({ scenarioDetailsLookup: {} })).toEqual([])
    expect(computed.preferredLanguageTypes.call({ scenarioDetailsLookup: null })).toEqual([])
  })

  it('handleSearchChange sets filter items, removes captcha filter and triggers refresh', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [{ FieldName: 'old' }] }
          ]
        }
      },
      resetPageNumber,
      callForData
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'name', Value: 'demo' },
              { FieldName: 'isInvisibleCaptchaEnabled', Value: true }
            ]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Value: 'demo' }
    ])
    expect(resetPageNumber).toHaveBeenCalledTimes(1)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSearchChange keeps filters when captcha field is not present', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            { FilterItems: [] },
            { FilterItems: [] }
          ]
        }
      },
      resetPageNumber,
      callForData
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'name', Value: 'demo' }]
          }
        ]
      }
    }

    methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'name', Value: 'demo' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handleEdit and changeNewEmailTemplateModalStatus update modal/edit states', () => {
    const ctx = {
      modalStatus: false,
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: null,
      callForData: jest.fn()
    }

    methods.handleEdit.call(ctx, { resourceId: 'lp-1' }, true)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(true)
    expect(ctx.emailTemplateId).toBe('lp-1')

    methods.changeNewEmailTemplateModalStatus.call(ctx, false, true)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.emailTemplateId).toBe(null)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('handleEdit sets duplicate flag correctly for non-duplicate flow', () => {
    const ctx = {
      modalStatus: false,
      isEdit: false,
      isDuplicate: true,
      emailTemplateId: null
    }

    methods.handleEdit.call(ctx, { resourceId: 'lp-2' }, false)
    expect(ctx.modalStatus).toBe(true)
    expect(ctx.isEdit).toBe(true)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.emailTemplateId).toBe('lp-2')
  })

  it('changeNewEmailTemplateModalStatus without restart closes modal without refresh', () => {
    const callForData = jest.fn()
    const ctx = {
      modalStatus: true,
      isEdit: true,
      isDuplicate: true,
      emailTemplateId: 'lp-1',
      callForData
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx, false, false)

    expect(ctx.modalStatus).toBe(false)
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.emailTemplateId).toBe(null)
    expect(callForData).not.toHaveBeenCalled()
  })

  it('handleMultipleDelete builds payload for selectAll=false and opens modal', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      serverSideProps: { totalNumberOfRecords: 25 },
      axiosPayload: { filter: { FilterGroups: [] } },
      showDeleteModal: false
    }
    const selections = [{ resourceId: 'a' }, { resourceId: 'b' }]
    const excludedItems = ['x']

    methods.handleMultipleDelete.call(ctx, selections, excludedItems, false)

    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedTemplatesCount).toBe(2)
    expect(ctx.multipleTemplatesPayload).toEqual({
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: false,
      filter: { FilterGroups: [] }
    })
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('handleActionDelete sets selected row and opens delete modal', () => {
    const ctx = {
      isMultipleDelete: true,
      selectedLandingPageTemplate: null,
      showDeleteModal: false
    }
    const row = { resourceId: 'lp-9' }

    methods.handleActionDelete.call(ctx, row)

    expect(ctx.isMultipleDelete).toBe(false)
    expect(ctx.selectedLandingPageTemplate).toEqual(row)
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('callForData maps language names and updates server side props', async () => {
    getLandingPageList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ languageTypeName: 'English', name: 'Template A' }]
        }
      }
    })

    const ctx = {
      loading: false,
      getLandingPageTemplatesSearchPermissions: true,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      tableData: []
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(getLandingPageList).toHaveBeenCalledWith(ctx.axiosPayload)
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.tableData[0].languageTypeName).toBe('EN')
    expect(ctx.loading).toBe(false)
  })

  it('callForData preserves unknown languages and array language items', async () => {
    getLandingPageList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [
            { languageTypeName: ['Klingon', 'English'], name: 'Template B' },
            { languageTypeName: 'Unknown', name: 'Template C' }
          ]
        }
      }
    })

    const ctx = {
      loading: false,
      getLandingPageTemplatesSearchPermissions: true,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      tableData: []
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languageTypeName).toEqual(['Klingon', 'EN'])
    expect(ctx.tableData[1].languageTypeName).toBe('Unknown')
  })

  it('callForData keeps undefined languageTypeName as undefined', async () => {
    getLandingPageList.mockResolvedValueOnce({
      data: {
        data: {
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1,
          results: [{ name: 'Template D' }]
        }
      }
    })

    const ctx = {
      loading: false,
      getLandingPageTemplatesSearchPermissions: true,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [{ languageName: 'English', text: 'EN' }],
      tableData: []
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData[0].languageTypeName).toBeUndefined()
  })

  it('callForData does not call api when search permission is missing', async () => {
    const ctx = {
      loading: false,
      getLandingPageTemplatesSearchPermissions: false,
      axiosPayload: { filter: { FilterGroups: [] } },
      serverSideProps: {},
      languageFilterOptions: [],
      tableData: []
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(getLandingPageList).not.toHaveBeenCalled()
    expect(ctx.loading).toBe(true)
  })

  it('callForLookups sets method and difficulty filters and maps domain records', async () => {
    getLandingPageFormDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [{ text: 'GET' }, { text: 'POST' }],
          difficultyTypes: [{ text: 'Easy' }],
          domainRecords: [{ domain: 'a.com', id: 10, urlSchemaType: 'https', urlSchemaTypeId: 1, isStopBotActivity: true }]
        }
      }
    })

    const columns = [{}, {}, {}, {}]
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns },
      $set: set,
      $refs: { refLandingPageList: { reRenderFilters } },
      landingPageData: null
    }

    methods.callForLookups.call(ctx)
    await flushPromises()

    expect(set).toHaveBeenCalled()
    expect(columns[1].filterableItems).toEqual(['GET', 'POST'])
    expect(columns[3].filterableItems).toEqual(['Easy'])
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
    expect(ctx.landingPageData.domainRecords[0]).toEqual({
      text: 'a.com',
      value: '10',
      extraDatas: [
        { text: 'https', value: '1' },
        { text: true, value: true }
      ]
    })
  })

  it('callForLookups is safe when table ref for reRenderFilters is missing', async () => {
    getLandingPageFormDetails.mockResolvedValueOnce({
      data: {
        data: {
          methodTypes: [{ text: 'GET' }],
          difficultyTypes: [{ text: 'Easy' }],
          domainRecords: []
        }
      }
    })

    const columns = [{}, {}, {}, {}]
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const ctx = {
      tableOptions: { columns },
      $set: set,
      $refs: {},
      landingPageData: null
    }

    methods.callForLookups.call(ctx)
    await flushPromises()

    expect(columns[1].filterableItems).toEqual(['GET'])
    expect(columns[3].filterableItems).toEqual(['Easy'])
    expect(ctx.landingPageData.domainRecords).toEqual([])
  })

  it('callForLookups handles missing method/difficulty/domain arrays', async () => {
    getLandingPageFormDetails.mockResolvedValueOnce({
      data: {
        data: {}
      }
    })

    const columns = [{}, {}, {}, {}]
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const ctx = {
      tableOptions: { columns },
      $set: set,
      $refs: { refLandingPageList: { reRenderFilters } },
      landingPageData: null
    }

    methods.callForLookups.call(ctx)
    await flushPromises()

    expect(columns[1].filterableItems).toBeUndefined()
    expect(columns[3].filterableItems).toBeUndefined()
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
    expect(ctx.landingPageData.domainRecords).toBeUndefined()
  })

  it('exportLandingPage creates downloadable links for each export type', async () => {
    exportLandingPage.mockResolvedValue({ data: new Blob(['file']) })
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }
    const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url')
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }

    methods.exportLandingPage.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportLandingPage).toHaveBeenCalledTimes(2)
    expect(exportLandingPage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(exportLandingPage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(link.click).toHaveBeenCalledTimes(2)
    expect(link.download).toBe('LandingPageTemplate.csv')

    if (createElementSpy) createElementSpy.mockRestore()
    if (createObjectURLSpy) createObjectURLSpy.mockRestore()
  })

  it('exportLandingPage does not call api when exportTypes is empty', async () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }

    methods.exportLandingPage.call(ctx, {
      exportTypes: [],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportLandingPage).not.toHaveBeenCalled()
  })

  it('handlePreviousTemplate and handleNextTemplate update selected index', () => {
    const ctx = { selectedLandingPageIndex: 1 }

    methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(0)

    methods.handleNextTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(1)
  })

  it('handlePreviousTemplate can decrement below zero based on current behavior', () => {
    const ctx = { selectedLandingPageIndex: 0 }
    methods.handlePreviousTemplate.call(ctx)
    expect(ctx.selectedLandingPageIndex).toBe(-1)
  })

  it('handleSuccessDeleteAction resets table selection, closes modal and refreshes data', () => {
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      showDeleteModal: true,
      callForData,
      $refs: { refLandingPageList: { resetSelectableParams } }
    }

    methods.handleSuccessDeleteAction.call(ctx, { resourceId: 'lp-1' })

    expect(resetSelectableParams).toHaveBeenCalledTimes(1)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSuccessMultipleDeleteAction safely closes modal and refreshes data', () => {
    const resetSelectableParams = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      showDeleteModal: true,
      callForData,
      $refs: { refLandingPageList: { resetSelectableParams } }
    }

    methods.handleSuccessMultipleDeleteAction.call(ctx)

    expect(resetSelectableParams).toHaveBeenCalledTimes(1)
    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleSuccessMultipleDeleteAction works without table ref via optional chaining', () => {
    const callForData = jest.fn()
    const ctx = {
      showDeleteModal: true,
      callForData,
      $refs: {}
    }

    methods.handleSuccessMultipleDeleteAction.call(ctx)

    expect(ctx.showDeleteModal).toBe(false)
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('handleMultipleDelete uses total count when selectAll is true', () => {
    const ctx = {
      isMultipleDelete: false,
      multipleDeletedTemplatesCount: 0,
      serverSideProps: { totalNumberOfRecords: 99 },
      axiosPayload: { filter: { FilterGroups: [] } },
      showDeleteModal: false
    }

    methods.handleMultipleDelete.call(ctx, [{ resourceId: 'a' }], ['z'], true)

    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedTemplatesCount).toBe(99)
    expect(ctx.multipleTemplatesPayload.items).toEqual([])
    expect(ctx.multipleTemplatesPayload.selectAll).toBe(true)
    expect(ctx.showDeleteModal).toBe(true)
  })

  it('handlePreview selects template row and opens details dialog', () => {
    const row = { resourceId: 'lp-22', name: 'Template 22' }
    const ctx = {
      selectedLandingPageTemplate: null,
      isTemplateDetails: false
    }

    methods.handlePreview.call(ctx, row)

    expect(ctx.selectedLandingPageTemplate).toEqual(row)
    expect(ctx.isTemplateDetails).toBe(true)
  })

  it('handlePreview accepts null row and still opens details dialog', () => {
    const ctx = {
      selectedLandingPageTemplate: { resourceId: 'existing' },
      isTemplateDetails: false
    }

    methods.handlePreview.call(ctx, null)
    expect(ctx.selectedLandingPageTemplate).toBeNull()
    expect(ctx.isTemplateDetails).toBe(true)
  })

  it('handleEditFromPreview closes preview and opens edit mode in nextTick', () => {
    const handleEdit = jest.fn()
    const nextTick = (cb) => cb()
    const row = { resourceId: 'lp-77' }
    const ctx = {
      isTemplateDetails: true,
      handleEdit,
      $nextTick: nextTick
    }

    methods.handleEditFromPreview.call(ctx, row)

    expect(ctx.isTemplateDetails).toBe(false)
    expect(handleEdit).toHaveBeenCalledWith(row, false)
  })

  it('handleEditFromPreview works when preview is already closed', () => {
    const handleEdit = jest.fn()
    const ctx = {
      isTemplateDetails: false,
      handleEdit,
      $nextTick: (cb) => cb()
    }

    methods.handleEditFromPreview.call(ctx, { resourceId: 'lp-88' })
    expect(ctx.isTemplateDetails).toBe(false)
    expect(handleEdit).toHaveBeenCalledWith({ resourceId: 'lp-88' }, false)
  })

  it('checkIfCanCloseGrapesJSModal delegates to inner ref when available', () => {
    const toggleShowGrapesModal = jest.fn()
    const ctx = {
      $refs: {
        newLandingPage: {
          $refs: {
            refEmailTemplate: { toggleShowGrapesModal }
          }
        }
      }
    }

    methods.checkIfCanCloseGrapesJSModal.call(ctx)
    expect(toggleShowGrapesModal).toHaveBeenCalledTimes(1)
  })

  it('checkIfCanCloseGrapesJSModal is safe when refs are missing', () => {
    const missingAll = { $refs: {} }
    const missingInner = { $refs: { newLandingPage: { $refs: {} } } }

    expect(() => methods.checkIfCanCloseGrapesJSModal.call(missingAll)).not.toThrow()
    expect(() => methods.checkIfCanCloseGrapesJSModal.call(missingInner)).not.toThrow()
  })

  it('checkIfCanCloseNewLandingPage delegates to child modal closer', () => {
    const changeNewEmailTemplateModalStatus = jest.fn()
    const ctx = {
      $refs: {
        newLandingPage: {
          changeNewEmailTemplateModalStatus
        }
      }
    }

    methods.checkIfCanCloseNewLandingPage.call(ctx)
    expect(changeNewEmailTemplateModalStatus).toHaveBeenCalledTimes(1)
  })

  it('checkIfCanCloseNewLandingPage is safe when ref is missing', () => {
    const ctx = { $refs: {} }
    expect(() => methods.checkIfCanCloseNewLandingPage.call(ctx)).not.toThrow()
  })

  it('exportLandingPage keeps non-XLS payload type and file extension', async () => {
    exportLandingPage.mockResolvedValueOnce({ data: new Blob(['csv']) })
    const link = { click: jest.fn(), href: '', download: '' }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link)
    const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:csv')
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{}, {}] } }
    }

    methods.exportLandingPage.call(ctx, {
      exportTypes: ['CSV'],
      reportAllPages: false,
      pageNumber: 3,
      pageSize: 25
    })
    await flushPromises()

    expect(exportLandingPage).toHaveBeenCalledWith(
      expect.objectContaining({
        exportType: 'CSV',
        reportAllPages: false,
        pageNumber: 3,
        pageSize: 25
      })
    )
    expect(link.download).toBe('LandingPageTemplate.csv')
    expect(link.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })
})
