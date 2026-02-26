jest.mock('@/api/vishing', () => ({
  exportVishingTemplates: jest.fn(() => Promise.resolve({ data: {} })),
  getVishingTemplates: jest.fn(),
  getVishingTemplateLanguages: jest.fn()
}))

import VishingTemplates from '@/views/VishingTemplates.vue'
import {
  exportVishingTemplates,
  getVishingTemplates,
  getVishingTemplateLanguages
} from '@/api/vishing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('VishingTemplates.vue (extra)', () => {
  const { computed, methods, watch, beforeRouteLeave } = VishingTemplates

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTemplateId returns empty string when no selected template', () => {
    expect(computed.getTemplateId.call({ selectedTemplate: null })).toBe('')
    expect(computed.getTemplateId.call({ selectedTemplate: { resourceId: 'v-1' } })).toBe('v-1')
  })

  it('selectedTemplate watcher resets voice fields when value is null', () => {
    const ctx = {
      voiceResourceId: 'x',
      isTextToSpeechCompatible: true
    }
    watch.selectedTemplate.handler.call(ctx, null)
    expect(ctx.voiceResourceId).toBe('')
    expect(ctx.isTextToSpeechCompatible).toBe(false)
  })

  it('selectedTemplate watcher maps language item and sets text-to-speech compatibility', () => {
    const ctx = {
      languageItems: [
        {
          language: 'English',
          name: 'Amy',
          resourceId: 'r1',
          voiceProviderTypeId: 2
        }
      ],
      voiceResourceId: '',
      isTextToSpeechCompatible: false,
      selectedTemplateLanguage: '',
      selectedTemplateVoice: ''
    }
    watch.selectedTemplate.handler.call(ctx, { language: 'English', voice: 'Amy' })
    expect(ctx.voiceResourceId).toBe('r1')
    expect(ctx.isTextToSpeechCompatible).toBe(true)
    expect(ctx.selectedTemplateLanguage).toBe('English')
    expect(ctx.selectedTemplateVoice).toBe('Amy')
  })

  it('beforeRouteLeave blocks when modal is open and allows otherwise', () => {
    const next = jest.fn()
    const changeVishingTemplateModalStatus = jest.fn()
    beforeRouteLeave.call(
      {
        $refs: { refVishingTemplateModal: { status: true, changeVishingTemplateModalStatus } }
      },
      {},
      {},
      next
    )
    expect(changeVishingTemplateModalStatus).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    const next2 = jest.fn()
    beforeRouteLeave.call({ $refs: {} }, {}, {}, next2)
    expect(next2).toHaveBeenCalledWith()
  })

  it('changeNewVishingTemplateModalStatus resets fields and refreshes when restart=true', () => {
    const ctx = {
      modalStatus: true,
      vishingTemplateId: 'old',
      isEdit: true,
      isDuplicate: true,
      selectedTemplate: { resourceId: 't1' },
      callForData: jest.fn()
    }
    methods.changeNewVishingTemplateModalStatus.call(ctx, false, true)
    expect(ctx.modalStatus).toBe(false)
    expect(ctx.vishingTemplateId).toBeNull()
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
    expect(ctx.selectedTemplate).toBeNull()
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData pushes home route when no search permission', () => {
    const push = jest.fn()
    methods.callForData.call({
      getVishingTemplatesSearchPermissions: false,
      $router: { push }
    })
    expect(push).toHaveBeenCalledWith('/')
  })

  it('callForData handles API error by setting tableData to empty', async () => {
    getVishingTemplates.mockRejectedValueOnce(new Error('fail'))
    const ctx = {
      getVishingTemplatesSearchPermissions: true,
      isLoading: false,
      axiosPayload: {},
      tableData: [{ id: 1 }],
      serverSideProps: {}
    }
    methods.callForData.call(ctx)
    await flushPromises()
    expect(ctx.tableData).toEqual([])
    expect(ctx.isLoading).toBe(false)
  })

  it('callForLanguages fills unique language/voice filters and rerenders filters', async () => {
    getVishingTemplateLanguages.mockResolvedValueOnce({
      data: {
        data: [
          { language: 'English', name: 'Amy' },
          { language: 'English', name: 'Brian' },
          { language: 'Turkish', name: 'Cem' }
        ]
      }
    })
    const columns = [{ property: 'voice' }, { property: 'language' }]
    const reRenderFilters = jest.fn()
    const ctx = {
      languageItems: [],
      voices: [],
      languages: [],
      tableOptions: { columns },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: { refVishingTemplatesList: { reRenderFilters } }
    }
    methods.callForLanguages.call(ctx)
    await flushPromises()
    expect(ctx.voices).toEqual(['Amy', 'Brian', 'Cem'])
    expect(ctx.languages).toEqual(['English', 'Turkish'])
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
  })

  it('handleMultipleDelete builds payload for selectAll and opens modal', () => {
    const ctx = {
      isMultipleDelete: false,
      serverSideProps: { totalNumberOfRecords: 12 },
      multipleDeletedTemplatesCount: 0,
      multipleTemplatesPayload: {},
      axiosPayload: { filter: { FilterGroups: [] } },
      isDeleteModalVisible: false
    }
    methods.handleMultipleDelete.call(ctx, [{ resourceId: '1' }], ['x'], true)
    expect(ctx.isMultipleDelete).toBe(true)
    expect(ctx.multipleDeletedTemplatesCount).toBe(12)
    expect(ctx.multipleTemplatesPayload.items).toEqual([])
    expect(ctx.isDeleteModalVisible).toBe(true)
  })

  it('exportVishingTemplates downloads only when response data is Blob', async () => {
    class MockBlob {
      constructor() {
        this.type = 'application/octet-stream'
      }
    }
    global.Blob = MockBlob
    exportVishingTemplates
      .mockResolvedValueOnce({ data: new MockBlob() })
      .mockResolvedValueOnce({ data: {} })

    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click
    })
    const originalCreateObjectURL = window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:mock')

    const ctx = { axiosPayload: { filter: { FilterGroups: [] } } }
    methods.exportVishingTemplates.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      reportAllPages: true,
      pageNumber: 1,
      pageSize: 10
    })
    await flushPromises()

    expect(exportVishingTemplates).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(1)

    createElementSpy.mockRestore()
    window.URL.createObjectURL = originalCreateObjectURL
  })
})
