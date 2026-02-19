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
    expect(link.click).toHaveBeenCalledTimes(2)
    expect(link.download).toBe('LandingPageTemplate.csv')

    if (createElementSpy) createElementSpy.mockRestore()
    if (createObjectURLSpy) createObjectURLSpy.mockRestore()
  })
})
