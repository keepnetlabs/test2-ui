jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCallbackScenario: jest.fn(),
    getCallbackScenarioPreview: jest.fn(),
    searchCallbackScenarios: jest.fn()
  }
}))

import CampaignManagerCallbackScenarios from '@/components/CallbackCampaignManager/CampaignManagerCallbackScenarios.vue'
import CallbackService from '@/api/callback'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerCallbackScenarios.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed helpers return expected values', () => {
    expect(
      CampaignManagerCallbackScenarios.computed.getVoiceResourceId.call({
        callbackTemplate: { vishingLanguageResourceId: 'lang-1' }
      })
    ).toBe('lang-1')
    expect(
      CampaignManagerCallbackScenarios.computed.getVoiceResourceId.call({ callbackTemplate: null })
    ).toBe(null)

    expect(
      CampaignManagerCallbackScenarios.computed.getLanguageItems.call({
        languageItems: [{ language: 'English' }, { language: 'Turkish' }]
      })
    ).toEqual(['English', 'Turkish'])

    expect(
      CampaignManagerCallbackScenarios.computed.getStyle.call({
        getItems: []
      })
    ).toEqual({
      maxHeight: '360px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    })
    expect(
      CampaignManagerCallbackScenarios.computed.getStyle.call({
        getItems: [{ resourceId: '1' }]
      })
    ).toEqual({})
  })

  it('computed style/switch/template helpers return expected values', () => {
    expect(
      CampaignManagerCallbackScenarios.computed.getContainerStyle.call({ isValid: false })
    ).toEqual({ border: '1px solid #ff5252 !important', borderRadius: '20px' })
    expect(CampaignManagerCallbackScenarios.computed.getContainerStyle.call({ isValid: true })).toEqual(
      {}
    )

    expect(
      CampaignManagerCallbackScenarios.computed.getSelectedScenarioSwitchLabel.call({
        value: [{}, {}, {}]
      })
    ).toBe('Only show selected scenarios (3)')

    expect(
      CampaignManagerCallbackScenarios.computed.isFilterOrSearchActive.call({
        method: '',
        difficulty: '',
        search: ''
      })
    ).toBe('')
    expect(
      CampaignManagerCallbackScenarios.computed.isFilterOrSearchActive.call({
        method: 'voice',
        difficulty: '',
        search: ''
      })
    ).toBe('voice')

    expect(
      CampaignManagerCallbackScenarios.computed.getItems.call({
        isShowSelectedScenarios: true,
        value: [{ resourceId: 'a' }],
        phishingScenarioItems: [{ resourceId: 'b' }]
      })
    ).toEqual([{ resourceId: 'a' }])
    expect(
      CampaignManagerCallbackScenarios.computed.getItems.call({
        isShowSelectedScenarios: false,
        value: [{ resourceId: 'a' }],
        phishingScenarioItems: [{ resourceId: 'b' }]
      })
    ).toEqual([{ resourceId: 'b' }])

    expect(
      CampaignManagerCallbackScenarios.computed.getTemplatePreviewContent.call({
        emailTemplate: '<html />'
      })
    ).toBe('<html />')
    expect(
      CampaignManagerCallbackScenarios.computed.getTemplateHeader.call({
        emailTemplateParams: { name: 'Template X' }
      })
    ).toBe('Template X')
    expect(
      CampaignManagerCallbackScenarios.computed.getTemplateHeader.call({
        emailTemplateParams: null
      })
    ).toBe('')
  })

  it('computed empty-message helpers switch text by filter/search state', () => {
    expect(
      CampaignManagerCallbackScenarios.computed.getTableEmptyTextMessage.call({
        isFilterOrSearchActive: true
      })
    ).toContain('no results')
    expect(
      CampaignManagerCallbackScenarios.computed.getTableEmptyTextMessage.call({
        isFilterOrSearchActive: false
      })
    ).toContain('Callback Scenarios')

    expect(
      CampaignManagerCallbackScenarios.computed.getTableEmptySubMessage.call({
        isFilterOrSearchActive: true
      })
    ).toContain('Callback Simulator')
    expect(
      CampaignManagerCallbackScenarios.computed.getTableEmptySubMessage.call({
        isFilterOrSearchActive: false
      })
    ).toContain('adjusting your search')
  })

  it('selected language and voice computed values work', () => {
    const ctx = {
      axiosPayload: {
        filter: { FilterGroups: [{ FilterItems: [{ Value: 'lr-1' }, { Value: '' }] }] }
      },
      languages: [{ value: 'lr-1', text: 'EN' }, { value: 'lr-2', text: 'TR' }],
      languageItems: [
        { languageCode: 'EN', name: 'Alice' },
        { languageCode: 'TR', name: 'Ayse' }
      ]
    }
    expect(CampaignManagerCallbackScenarios.computed.getSelectedLanguage.call(ctx)).toBe('lr-1')
    expect(CampaignManagerCallbackScenarios.computed.getSelectedLanguageShortCode.call(ctx)).toBe(
      'EN'
    )
    expect(
      CampaignManagerCallbackScenarios.computed.getVoiceItems.call({
        ...ctx,
        getSelectedLanguageShortCode: 'EN'
      })
    ).toEqual(['Alice'])
    expect(
      CampaignManagerCallbackScenarios.computed.getVoiceItems.call({
        ...ctx,
        getSelectedLanguageShortCode: ''
      })
    ).toEqual(['Alice', 'Ayse'])
    expect(
      CampaignManagerCallbackScenarios.computed.getSelectedLanguageShortCode.call({
        ...ctx,
        axiosPayload: { filter: { FilterGroups: [{ FilterItems: [{ Value: 'unknown' }] }] } }
      })
    ).toBe('')
  })

  it('getItemDescription and getItemClasses handle edge values', () => {
    expect(CampaignManagerCallbackScenarios.methods.getItemDescription({})).toBe('\xa0')
    expect(CampaignManagerCallbackScenarios.methods.getItemDescription({ description: 'null' })).toBe(
      '\xa0'
    )
    expect(
      CampaignManagerCallbackScenarios.methods.getItemDescription({ description: 'desc' })
    ).toBe('desc')
    expect(
      CampaignManagerCallbackScenarios.methods.getItemDescription({ description: 'undefined' })
    ).toBe('\xa0')

    const classes = CampaignManagerCallbackScenarios.methods.getItemClasses.call(
      {
        selectedTemplateResourceId: 'r1',
        value: [{ resourceId: 'r1' }]
      },
      'r1'
    )
    expect(classes[0]).toBe('template-list')
    expect(classes[1]['bg-phishing-gray']).toBe(true)
    expect(classes[2]['template-list--selected']).toBeTruthy()
  })

  it('setSelectedTemplate emits add/remove and updates trainingTabModel', () => {
    const emit = jest.fn()
    const ctx = {
      trainingTabModel: {},
      value: [{ resourceId: 'r1' }, { resourceId: 'r2' }],
      $emit: emit,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }

    CampaignManagerCallbackScenarios.methods.setSelectedTemplate.call(
      ctx,
      { resourceId: 'r3' },
      true
    )
    expect(ctx.trainingTabModel.r3).toBeTruthy()
    expect(emit).toHaveBeenCalledWith('input', [
      { resourceId: 'r1' },
      { resourceId: 'r2' },
      { resourceId: 'r3' }
    ])

    CampaignManagerCallbackScenarios.methods.setSelectedTemplate.call(
      ctx,
      { resourceId: 'r2' },
      false
    )
    expect(emit).toHaveBeenLastCalledWith('input', [{ resourceId: 'r1' }])
  })

  it('handleScroll triggers pagination fetch near list end', () => {
    const ctx = {
      isShowSelectedScenarios: false,
      axiosPayload: { pageSize: 10 },
      debounce: (cb) => cb(),
      callForPhishingScenarios: jest.fn()
    }
    CampaignManagerCallbackScenarios.methods.handleScroll.call(ctx, {
      target: { scrollTop: 90, scrollHeight: 100, offsetHeight: 10 }
    })
    expect(ctx.axiosPayload.pageSize).toBe(20)
    expect(ctx.callForPhishingScenarios).toHaveBeenCalledWith(false)
  })

  it('handleScroll returns early when selected-scenarios mode is active', () => {
    const ctx = {
      isShowSelectedScenarios: true,
      axiosPayload: { pageSize: 10 },
      debounce: (cb) => cb(),
      callForPhishingScenarios: jest.fn()
    }
    CampaignManagerCallbackScenarios.methods.handleScroll.call(ctx, {
      target: { scrollTop: 90, scrollHeight: 100, offsetHeight: 10 }
    })

    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(ctx.callForPhishingScenarios).not.toHaveBeenCalled()
  })

  it('handleScroll does not fetch when not near list end', () => {
    const ctx = {
      isShowSelectedScenarios: false,
      axiosPayload: { pageSize: 10 },
      debounce: (cb) => cb(),
      callForPhishingScenarios: jest.fn()
    }
    CampaignManagerCallbackScenarios.methods.handleScroll.call(ctx, {
      target: { scrollTop: 20, scrollHeight: 200, offsetHeight: 100 }
    })

    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(ctx.callForPhishingScenarios).not.toHaveBeenCalled()
  })

  it('resetFilters clears all filter fields and fetches scenarios', () => {
    const ctx = {
      search: 'old',
      axiosPayload: {
        filter: {
          FilterGroups: [
            { FilterItems: [{ Value: 'a' }, { Value: 'b' }, { Value: 'c' }] },
            { FilterItems: [{ Value: 'x' }] }
          ]
        }
      },
      callForPhishingScenarios: jest.fn()
    }
    CampaignManagerCallbackScenarios.methods.resetFilters.call(ctx)
    expect(ctx.search).toBe('')
    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('')
    expect(ctx.callForPhishingScenarios).toHaveBeenCalledWith(false)
  })

  it('watchers update state and trigger reset behavior', () => {
    const watcherCtx = {
      isShowSelectedScenarios: true,
      callForPhishingScenarios: jest.fn(),
      resetFilters: jest.fn()
    }
    CampaignManagerCallbackScenarios.watch.value.call(watcherCtx, [])
    expect(watcherCtx.isShowSelectedScenarios).toBe(false)

    CampaignManagerCallbackScenarios.watch.isShowSelectedScenarios.call(watcherCtx, true)
    expect(watcherCtx.resetFilters).toHaveBeenCalled()

    watcherCtx.resetFilters.mockClear()
    CampaignManagerCallbackScenarios.watch.isShowSelectedScenarios.call(watcherCtx, false)
    expect(watcherCtx.resetFilters).not.toHaveBeenCalled()
  })

  it('value watcher keeps selected-only mode when value list is not empty', () => {
    const watcherCtx = { isShowSelectedScenarios: true }
    CampaignManagerCallbackScenarios.watch.value.call(watcherCtx, [{ resourceId: 'x' }])
    expect(watcherCtx.isShowSelectedScenarios).toBe(true)
  })

  it('filter watchers update payload and trigger fetch', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: 'LanguageTypeResourceId', Value: '' },
                { FieldName: 'voice', Value: '' },
                { FieldName: 'difficulty', Value: '' }
              ]
            }
          ]
        }
      },
      callForPhishingScenarios: jest.fn()
    }

    CampaignManagerCallbackScenarios.watch.difficulty.call(ctx, 'Hard')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[2].Value).toBe('Hard')

    CampaignManagerCallbackScenarios.watch.language.call(ctx, 'lang-1')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('lang-1')

    CampaignManagerCallbackScenarios.watch.method.call(ctx, 'Voice')
    const methodItem = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(
      (item) => item.FieldName === 'method'
    )
    expect(methodItem.Value).toBe('Voice')
    expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
  })

  it('toggleTemplateDialog toggles modal visibility', () => {
    const ctx = { isShowTemplate: false }

    CampaignManagerCallbackScenarios.methods.toggleTemplateDialog.call(ctx)
    expect(ctx.isShowTemplate).toBe(true)

    CampaignManagerCallbackScenarios.methods.toggleTemplateDialog.call(ctx)
    expect(ctx.isShowTemplate).toBe(false)
  })

  it('created hook calls fetch only when not edit mode', () => {
    const callForPhishingScenarios = jest.fn()
    CampaignManagerCallbackScenarios.created.call({
      isEdit: false,
      callForPhishingScenarios
    })
    expect(callForPhishingScenarios).toHaveBeenCalled()

    callForPhishingScenarios.mockClear()
    CampaignManagerCallbackScenarios.created.call({
      isEdit: true,
      callForPhishingScenarios
    })
    expect(callForPhishingScenarios).not.toHaveBeenCalled()
  })

  it('watch getSelectedLanguageShortCode clears selected voice value', () => {
    const ctx = {
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [{ Value: '' }, { Value: 'Alice' }, { Value: '' }] }]
        }
      }
    }

    CampaignManagerCallbackScenarios.watch.getSelectedLanguageShortCode.call(ctx, 'EN')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[1].Value).toBe('')
  })

  it('adjustTrainingModel watcher initializes missing model and sets default language when needed', () => {
    const setDefaultValue = jest.fn()
    const ctx = {
      trainingTabModel: {},
      $set: (obj, key, val) => {
        obj[key] = val
      },
      $refs: {
        trainingTab: {
          $refs: {
            inputContentLanguage: { setDefaultValue }
          }
        }
      }
    }

    CampaignManagerCallbackScenarios.watch.adjustTrainingModel.call(ctx, 'res-1')
    expect(ctx.trainingTabModel['res-1']).toBeTruthy()

    ctx.trainingTabModel['res-2'] = { trainingId: 't2', trainingLanguageIds: [] }
    CampaignManagerCallbackScenarios.watch.adjustTrainingModel.call(ctx, 'res-2')
    expect(setDefaultValue).toHaveBeenCalled()
  })

  it('adjustTrainingModel watcher returns early when resource id is empty', () => {
    const ctx = {
      trainingTabModel: {},
      $set: jest.fn()
    }
    CampaignManagerCallbackScenarios.watch.adjustTrainingModel.call(ctx, '')
    expect(ctx.$set).not.toHaveBeenCalled()
  })

  it('watch defaultPhishingScenariosValuesMapped handles array and object inputs', () => {
    const ctx = {
      checkboxModel: {},
      trainingTabModel: {},
      $set: (obj, key, val) => {
        obj[key] = val
      },
      callForPhishingScenarios: jest.fn()
    }

    CampaignManagerCallbackScenarios.watch.defaultPhishingScenariosValuesMapped.call(ctx, [
      { value: 'r1', trainingId: 't1', trainingName: 'T1', trainingLanguageIds: ['EN'] }
    ])
    expect(ctx.checkboxModel.r1).toBe(true)
    expect(ctx.trainingTabModel.r1).toBeTruthy()
    expect(ctx.callForPhishingScenarios).toHaveBeenCalled()

    CampaignManagerCallbackScenarios.watch.defaultPhishingScenariosValuesMapped.call(ctx, {
      value: 'r2',
      trainingId: 't2',
      trainingName: 'T2',
      trainingLanguageIds: ['TR']
    })
    expect(ctx.checkboxModel.r2).toBe(true)
    expect(ctx.trainingTabModel.r2).toBeTruthy()
  })

  it('watch search applies contains filters and disables selected-only mode', () => {
    const ctx = {
      search: '',
      isShowSelectedScenarios: true,
      debounce: (cb) => cb(),
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      callForPhishingScenarios: jest.fn()
    }

    CampaignManagerCallbackScenarios.watch.search.call(ctx, 'urgent')
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toHaveLength(5)
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems[0]).toEqual(
      expect.objectContaining({ FieldName: 'name', Value: 'urgent' })
    )
    expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
    expect(ctx.isShowSelectedScenarios).toBe(false)
  })

  it('callForPhishingScenarios maps result and auto-selects first item', async () => {
    CallbackService.searchCallbackScenarios.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ resourceId: 'r1', languageTypeName: 'English', isSelected: false }]
        }
      }
    })
    const ctx = {
      isEdit: false,
      defaultPhishingScenariosValuesMapped: [],
      value: [],
      campaignManagerResourceId: '',
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
      },
      languages: [{ languageTypeName: 'English', text: 'EN' }],
      phishingScenarioItems: [],
      callForSelectedPhishingScenario: jest.fn()
    }

    CampaignManagerCallbackScenarios.methods.callForPhishingScenarios.call(ctx, true)
    await flushPromises()

    expect(CallbackService.searchCallbackScenarios).toHaveBeenCalled()
    expect(ctx.phishingScenarioItems[0].languageTypeName).toBe('EN')
    expect(ctx.callForSelectedPhishingScenario).toHaveBeenCalledWith('r1')
  })

  it('callForPhishingScenarios applies edit payload adjustments and auto-selects rows', async () => {
    CallbackService.searchCallbackScenarios.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            { resourceId: 'r10', languageTypeName: 'English', isSelected: true },
            { resourceId: 'r11', languageTypeName: 'English', isSelected: false }
          ]
        }
      }
    })
    const value = []
    const ctx = {
      isEdit: true,
      defaultPhishingScenariosValuesMapped: [{ value: 'x' }, { value: 'y' }, { value: 'z' }],
      value,
      campaignManagerResourceId: 'cmp-1',
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
      },
      languages: [{ languageTypeName: 'English', text: 'EN' }],
      phishingScenarioItems: [],
      callForSelectedPhishingScenario: jest.fn()
    }

    CampaignManagerCallbackScenarios.methods.callForPhishingScenarios.call(ctx, false)
    await flushPromises()

    expect(ctx.axiosPayload.resourceId).toBe('cmp-1')
    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(value.find((x) => x.resourceId === 'r10')).toBeTruthy()
    expect(ctx.callForSelectedPhishingScenario).not.toHaveBeenCalled()
  })

  it('callForPhishingScenarios keeps default page size when edit has existing selected values', async () => {
    CallbackService.searchCallbackScenarios.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const ctx = {
      isEdit: true,
      defaultPhishingScenariosValuesMapped: [{ value: 'x' }, { value: 'y' }, { value: 'z' }],
      value: [{ resourceId: 'existing' }],
      campaignManagerResourceId: 'cmp-2',
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
      },
      languages: [],
      phishingScenarioItems: [],
      callForSelectedPhishingScenario: jest.fn()
    }

    CampaignManagerCallbackScenarios.methods.callForPhishingScenarios.call(ctx, false)
    await flushPromises()

    expect(ctx.axiosPayload.resourceId).toBe('cmp-2')
    expect(ctx.axiosPayload.pageSize).toBe(10)
  })

  it('callForPhishingScenarios expands page size for large default selection in edit mode', async () => {
    CallbackService.searchCallbackScenarios.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const defaults = new Array(15).fill(null).map((_, i) => ({ value: `x-${i}` }))
    const ctx = {
      isEdit: true,
      defaultPhishingScenariosValuesMapped: defaults,
      value: [],
      campaignManagerResourceId: 'cmp-large',
      axiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
      },
      languages: [],
      phishingScenarioItems: [],
      callForSelectedPhishingScenario: jest.fn()
    }

    CampaignManagerCallbackScenarios.methods.callForPhishingScenarios.call(ctx, false)
    await flushPromises()

    expect(ctx.axiosPayload.resourceId).toBe('cmp-large')
    expect(ctx.axiosPayload.pageSize).toBe(15)
  })

  it('handleClickPreview delegates to toggleTemplateDialog', () => {
    const ctx = {
      toggleTemplateDialog: jest.fn()
    }
    CampaignManagerCallbackScenarios.methods.handleClickPreview.call(ctx)
    expect(ctx.toggleTemplateDialog).toHaveBeenCalled()
  })

  it('callForSelectedPhishingScenario maps preview data and callback metadata', async () => {
    CallbackService.getCallbackScenario.mockResolvedValueOnce({
      data: { data: { resourceId: 'cb-1', name: 'Scenario 1' } }
    })
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          callbackTemplate: {
            vishingLanguageResourceId: 'lang-1',
            voiceProviderTypeId: 2,
            steps: [{ id: 's1' }, { id: 's2' }, { id: 's3' }]
          },
          emailTemplate: {
            template: '<html />',
            fromName: 'From',
            fromAddress: 'from@test.com',
            name: 'Email Name',
            subject: 'Subj',
            difficultyResourceId: 1,
            attachments: [],
            languageTypeResourceId: 'lang-1',
            phishingFileName: 'file'
          }
        }
      }
    })

    const ctx = {
      phishingScenarioItems: [],
      selectedTemplateResourceId: null,
      languageItems: [{ resourceId: 'lang-1', language: 'English', name: 'Alice' }],
      callbackTemplate: null,
      emailTemplate: null,
      emailTemplateParams: null,
      tab: 'callbackTemplate',
      isTextToSpeechCompatible: false
    }

    CampaignManagerCallbackScenarios.methods.callForSelectedPhishingScenario.call(ctx, 'cb-1')
    await flushPromises()
    await flushPromises()

    expect(ctx.selectedTemplateResourceId).toBe('cb-1')
    expect(ctx.emailTemplate).toBe('<html />')
    expect(ctx.callbackTemplate.language).toBe('English')
    expect(ctx.callbackTemplate.voice).toBe('Alice')
    expect(ctx.callbackTemplate.steps).toHaveLength(1)
    expect(ctx.isTextToSpeechCompatible).toBe(true)
    expect(ctx.tab).toBe('email')
  })

  it('callForSelectedPhishingScenario keeps existing list item and sets tts false for other providers', async () => {
    CallbackService.getCallbackScenario.mockResolvedValueOnce({
      data: { data: { resourceId: 'cb-2', name: 'Scenario 2' } }
    })
    CallbackService.getCallbackScenarioPreview.mockResolvedValueOnce({
      data: {
        data: {
          callbackTemplate: {
            vishingLanguageResourceId: 'lang-2',
            voiceProviderTypeId: 1,
            steps: [{ id: 's1' }, { id: 's2' }]
          },
          emailTemplate: {
            template: '<html2 />',
            name: 'Email 2',
            subject: 'Subj 2'
          }
        }
      }
    })

    const ctx = {
      phishingScenarioItems: [{ resourceId: 'cb-2', name: 'Already Exists' }],
      selectedTemplateResourceId: null,
      languageItems: [{ resourceId: 'lang-2', language: 'Turkish', name: 'Ayse' }],
      callbackTemplate: null,
      emailTemplate: null,
      emailTemplateParams: null,
      tab: 'callbackTemplate',
      isTextToSpeechCompatible: true
    }

    CampaignManagerCallbackScenarios.methods.callForSelectedPhishingScenario.call(ctx, 'cb-2')
    await flushPromises()
    await flushPromises()

    expect(ctx.phishingScenarioItems).toHaveLength(1)
    expect(ctx.callbackTemplate.language).toBe('Turkish')
    expect(ctx.callbackTemplate.voice).toBe('Ayse')
    expect(ctx.callbackTemplate.steps).toHaveLength(0)
    expect(ctx.isTextToSpeechCompatible).toBe(false)
  })
})
