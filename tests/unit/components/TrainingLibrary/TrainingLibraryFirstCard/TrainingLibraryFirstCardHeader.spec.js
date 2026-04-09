jest.mock('@/api/awarenessEducator', () => ({
  exportTrainingList: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import TrainingLibraryFirstCardHeader from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardHeader.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { downloadButtonOptions } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingLibraryFirstCardHeader.vue', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('enables download only when table has exportable data', () => {
    expect(
      TrainingLibraryFirstCardHeader.computed.hasDownloadableData.call({
        tableData: [],
        serverSideProps: { totalNumberOfRecords: 0 }
      })
    ).toBe(false)

    expect(
      TrainingLibraryFirstCardHeader.computed.hasDownloadableData.call({
        tableData: [{ trainingId: '1' }],
        serverSideProps: { totalNumberOfRecords: 0 }
      })
    ).toBe(true)

    expect(
      TrainingLibraryFirstCardHeader.computed.hasDownloadableData.call({
        tableData: [],
        serverSideProps: { totalNumberOfRecords: 12 }
      })
    ).toBe(true)
  })

  it('uses DataTable-style disabled state and tooltip for download button', () => {
    expect(
      TrainingLibraryFirstCardHeader.computed.isDownloadButtonDisabled.call({
        hasDownloadableData: false
      })
    ).toBe(true)

    expect(
      TrainingLibraryFirstCardHeader.computed.downloadButtonTooltipText.call({
        hasDownloadableData: false
      })
    ).toBe('No data available to export. Download will be enabled once data is available.')

    expect(
      TrainingLibraryFirstCardHeader.computed.downloadButtonTooltipText.call({
        hasDownloadableData: true
      })
    ).toBe('Download Options')
  })

  it('handleDownloadButtonClick sets modal visible', () => {
    const ctx = {
      isShowDownloadModal: false,
      downloadModalTitle: '',
      isDownloadButtonDisabled: false
    }
    TrainingLibraryFirstCardHeader.methods.handleDownloadButtonClick.call(ctx, 'Excel')
    expect(ctx.isShowDownloadModal).toBe(true)
    expect(ctx.downloadModalTitle).toBe('Excel')
  })

  it('handleDownloadButtonClick does nothing when download button is disabled', () => {
    const ctx = {
      isShowDownloadModal: false,
      downloadModalTitle: '',
      isDownloadButtonDisabled: true
    }
    TrainingLibraryFirstCardHeader.methods.handleDownloadButtonClick.call(ctx, 'Excel')
    expect(ctx.isShowDownloadModal).toBe(false)
    expect(ctx.downloadModalTitle).toBe('')
  })

  it('toggleDownloadModal toggles isShowDownloadModal', () => {
    const ctx = { isShowDownloadModal: false }
    TrainingLibraryFirstCardHeader.methods.toggleDownloadModal.call(ctx)
    expect(ctx.isShowDownloadModal).toBe(true)
    TrainingLibraryFirstCardHeader.methods.toggleDownloadModal.call(ctx)
    expect(ctx.isShowDownloadModal).toBe(false)
  })

  it('downloadButtonOptions from utils', () => {
    expect(TrainingLibraryFirstCardHeader.data().downloadButtonOptions).toEqual(downloadButtonOptions)
  })

  it('handleDebouncedSearch delegates to debounce and forwards the search value', () => {
    const handleSearch = jest.fn()
    const debounce = jest.fn((cb) => cb())

    TrainingLibraryFirstCardHeader.methods.handleDebouncedSearch.call(
      {
        debounce,
        handleSearch
      },
      'poster'
    )

    expect(debounce).toHaveBeenCalledTimes(1)
    expect(handleSearch).toHaveBeenCalledWith('poster')
  })

  it('icon helpers return asset references for both list and card view states', () => {
    expect(
      TrainingLibraryFirstCardHeader.computed.getBulletedIcon.call({
        isListView: true
      })
    ).toBeDefined()
    expect(
      TrainingLibraryFirstCardHeader.computed.getBulletedIcon.call({
        isListView: false
      })
    ).toBeDefined()
    expect(
      TrainingLibraryFirstCardHeader.computed.getCardViewIcon.call({
        isListView: true
      })
    ).toBeDefined()
    expect(
      TrainingLibraryFirstCardHeader.computed.getCardViewIcon.call({
        isListView: false
      })
    ).toBeDefined()
  })

  it('downloadEvent exports with current-page and all-pages payload branches', async () => {
    const createdLinks = []
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
      const link = {
        href: '',
        download: '',
        click: jest.fn()
      }
      createdLinks.push(link)
      return link
    })
    const originalCreateObjectURL = global.URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:training-library')

    const baseCtx = {
      axiosPayload: {
        pageNumber: 3,
        pageSize: 25,
        orderBy: 'name',
        ascending: true,
        filter: { foo: 'bar' },
        trainingSearchType: 'All',
        trainingType: 'Poster'
      },
      downloadButtonOptions
    }

    TrainingLibraryFirstCardHeader.methods.downloadEvent.call(
      {
        ...baseCtx,
        downloadModalTitle: downloadButtonOptions[0]
      },
      ['XLS']
    )

    await flushPromises()

    expect(AwarenessEducatorService.exportTrainingList).toHaveBeenNthCalledWith(1, {
      pageNumber: 3,
      pageSize: 25,
      orderBy: 'name',
      ascending: true,
      reportAllPages: false,
      exportType: 'Excel',
      filter: { foo: 'bar' },
      trainingSearchType: 'All',
      trainingType: 'Poster'
    })
    expect(createdLinks[0].download).toBe('Training-Library-List.xlsx')
    expect(createdLinks[0].href).toBe('blob:training-library')
    expect(createdLinks[0].click).toHaveBeenCalled()

    TrainingLibraryFirstCardHeader.methods.downloadEvent.call(
      {
        ...baseCtx,
        downloadModalTitle: downloadButtonOptions[1]
      },
      ['CSV']
    )

    await flushPromises()

    expect(AwarenessEducatorService.exportTrainingList).toHaveBeenNthCalledWith(2, {
      pageNumber: 3,
      pageSize: 25,
      orderBy: 'name',
      ascending: true,
      reportAllPages: true,
      exportType: 'CSV',
      filter: { foo: 'bar' },
      trainingSearchType: 'All',
      trainingType: 'Poster'
    })
    expect(createdLinks[1].download).toBe('Training-Library-List.csv')
    expect(createdLinks[1].click).toHaveBeenCalled()

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2)
    global.URL.createObjectURL = originalCreateObjectURL
  })
})
