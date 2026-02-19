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
  })

  it('getItemDescription and getItemClasses handle edge values', () => {
    expect(CampaignManagerCallbackScenarios.methods.getItemDescription({})).toBe('\xa0')
    expect(CampaignManagerCallbackScenarios.methods.getItemDescription({ description: 'null' })).toBe(
      '\xa0'
    )
    expect(
      CampaignManagerCallbackScenarios.methods.getItemDescription({ description: 'desc' })
    ).toBe('desc')

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
})
