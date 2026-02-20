import CallbackTemplateSelectList from '@/components/CallbackScenarios/CallbackTemplateSelectList.vue'
import CallbackService from '@/api/callback'

jest.mock('@/api/callback', () => ({
  searchCallbackTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          totalNumberOfPages: 1,
          results: []
        }
      }
    })
  ),
  getCallbackTemplatePreview: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          steps: [{ title: 'invalid' }, { title: 'greeting' }, { title: 'step-1' }]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackTemplateSelectList.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createCtx = (overrides = {}) => ({
    search: null,
    listData: [],
    defaultListData: [],
    template: null,
    templateResourceId: 't-1',
    totalNumberOfPages: 2,
    selectedPreviousIndex: 0,
    loadingTemplates: false,
    loadingTemplatePreview: false,
    showLoader: false,
    bodyData: {
      pageNumber: 1,
      pageSize: 10,
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { value: '', FieldName: 'language' },
              { value: '', FieldName: 'voice' },
              { value: '', FieldName: 'difficulty' }
            ]
          },
          {
            FilterItems: [
              { value: '', FieldName: 'name' },
              { value: '', FieldName: 'difficulty' },
              { value: '', FieldName: 'createdBy' },
              { value: '', FieldName: 'tags' },
              { value: '', FieldName: 'createTime' }
            ]
          }
        ]
      }
    },
    languages: [
      { language: 'English', name: 'Amy', voiceProviderTypeId: 2, resourceId: 'v-1' },
      { language: 'English', name: 'Brian', voiceProviderTypeId: 1, resourceId: 'v-2' },
      { language: 'German', name: 'Hans', voiceProviderTypeId: 3, resourceId: 'v-3' }
    ],
    isTextToSpeechCompatible: false,
    voiceResourceId: '',
    debounce: (fn) => fn(),
    checkAndAddResourceIdToPayload:
      CallbackTemplateSelectList.methods.checkAndAddResourceIdToPayload,
    setSelectedTemplate: jest.fn(),
    getTemplates: jest.fn(),
    callForSearch: jest.fn(),
    getDataAfterValidScroll: jest.fn(),
    $emit: jest.fn(),
    ...overrides
  })

  it('computed getLanguageItems and getVoiceItems map values correctly', () => {
    const ctx = createCtx()
    expect(CallbackTemplateSelectList.computed.getLanguageItems.call(ctx)).toEqual([
      'English',
      'English',
      'German'
    ])

    const voiceCtx = createCtx({
      getSelectedLanguage: 'English'
    })
    expect(CallbackTemplateSelectList.computed.getVoiceItems.call(voiceCtx)).toEqual([
      'Amy',
      'Brian'
    ])
  })

  it('computed getVoiceItems returns empty list when language is not selected', () => {
    const ctx = createCtx()
    ctx.bodyData.filter.FilterGroups[0].FilterItems[0].value = ''
    expect(CallbackTemplateSelectList.computed.getVoiceItems.call(ctx)).toEqual([])
  })

  it('watch getSelectedLanguage resets selected voice', () => {
    const ctx = createCtx()
    ctx.bodyData.filter.FilterGroups[0].FilterItems[1].value = 'Amy'
    CallbackTemplateSelectList.watch.getSelectedLanguage.call(ctx)
    expect(ctx.bodyData.filter.FilterGroups[0].FilterItems[1].value).toBe('')
  })

  it('watch search restores default list when search becomes empty and no filters', () => {
    const ctx = createCtx({
      templateResourceId: 't-2',
      defaultListData: [{ resourceId: 't-1' }, { resourceId: 't-2' }],
      listData: []
    })
    CallbackTemplateSelectList.watch.search.call(ctx, '', 'abc')
    expect(ctx.listData[1].selected).toBe(true)
    expect(ctx.callForSearch).not.toHaveBeenCalled()
  })

  it('watch search calls getTemplates when search is cleared but filters are active', () => {
    const ctx = createCtx()
    ctx.bodyData.filter.FilterGroups[0].FilterItems[0].value = 'English'
    CallbackTemplateSelectList.watch.search.call(ctx, '', 'abc')
    expect(ctx.getTemplates).toHaveBeenCalledWith(true)
  })

  it('watch search triggers callForSearch for changed non-empty values', () => {
    const ctx = createCtx()
    CallbackTemplateSelectList.watch.search.call(ctx, 'abc', 'ab')
    expect(ctx.callForSearch).toHaveBeenCalled()
  })

  it('getTemplatesForSearch routes to search or normal template fetch', () => {
    const searchCtx = createCtx({ search: 'query' })
    CallbackTemplateSelectList.methods.getTemplatesForSearch.call(searchCtx)
    expect(searchCtx.bodyData.pageSize).toBe(100)
    expect(searchCtx.callForSearch).toHaveBeenCalled()

    const normalCtx = createCtx({ search: '' })
    CallbackTemplateSelectList.methods.getTemplatesForSearch.call(normalCtx)
    expect(normalCtx.getTemplates).toHaveBeenCalledWith(true, 't-1', normalCtx.bodyData, true)
  })

  it('checkAndAddResourceIdToPayload sets loading and appends resource filter', () => {
    const ctx = createCtx()
    const payload = JSON.parse(JSON.stringify(ctx.bodyData))
    CallbackTemplateSelectList.methods.checkAndAddResourceIdToPayload.call(ctx, true, payload)
    expect(ctx.loadingTemplates).toBe(true)
    expect(ctx.$emit).toHaveBeenCalledWith('loading', true)
    expect(payload.filter.FilterGroups[1].FilterItems.at(-1)).toEqual({
      FieldName: 'ResourceId',
      Operator: 'Include',
      value: 't-1'
    })
  })

  it('callForSearch updates list and clears loaders for empty response', async () => {
    const ctx = createCtx({
      search: 'abc',
      listData: [{ resourceId: 'x' }],
      template: { id: 1 }
    })

    CallbackTemplateSelectList.methods.callForSearch.call(ctx)
    await flushPromises()

    expect(CallbackService.searchCallbackTemplates).toHaveBeenCalled()
    expect(ctx.listData).toEqual([])
    expect(ctx.template).toBeNull()
    expect(ctx.loadingTemplates).toBe(false)
    expect(ctx.$emit).toHaveBeenCalledWith('loading', false)
  })

  it('getDataAfterValidScroll increments page and fetches next data only when valid', () => {
    const ctx = createCtx({
      bodyData: { pageNumber: 1 },
      totalNumberOfPages: 3,
      search: '',
      getTemplates: jest.fn()
    })
    CallbackTemplateSelectList.methods.getDataAfterValidScroll.call(ctx)
    expect(ctx.bodyData.pageNumber).toBe(2)
    expect(ctx.getTemplates).toHaveBeenCalled()

    const blockedCtx = createCtx({
      bodyData: { pageNumber: 3 },
      totalNumberOfPages: 3,
      search: 'query',
      getTemplates: jest.fn()
    })
    CallbackTemplateSelectList.methods.getDataAfterValidScroll.call(blockedCtx)
    expect(blockedCtx.bodyData.pageNumber).toBe(3)
    expect(blockedCtx.getTemplates).not.toHaveBeenCalled()
  })

  it('setSelectedTemplate maps preview data and emits selectedTemplateChange', async () => {
    const ctx = createCtx({
      listData: [{ resourceId: 't-1', language: 'English', voice: 'Amy', selected: false }],
      selectedPreviousIndex: 0
    })
    const item = { resourceId: 't-1', language: 'English', voice: 'Amy' }

    CallbackTemplateSelectList.methods.setSelectedTemplate.call(ctx, item, 0, true)
    await flushPromises()

    expect(CallbackService.getCallbackTemplatePreview).toHaveBeenCalledWith('t-1')
    expect(ctx.template.invalidDialingNotice).toBeDefined()
    expect(ctx.template.callGreeting).toBeDefined()
    expect(ctx.template.steps.length).toBe(1)
    expect(ctx.isTextToSpeechCompatible).toBe(true)
    expect(ctx.voiceResourceId).toBe('v-1')
    expect(ctx.$emit).toHaveBeenCalledWith('selectedTemplateResourceId', 't-1')
    expect(ctx.$emit).toHaveBeenCalledWith('initialTemplateId', 't-1')
    expect(ctx.$emit).toHaveBeenCalledWith(
      'selectedTemplateChange',
      expect.objectContaining({ resourceId: 't-1' })
    )
  })
})
