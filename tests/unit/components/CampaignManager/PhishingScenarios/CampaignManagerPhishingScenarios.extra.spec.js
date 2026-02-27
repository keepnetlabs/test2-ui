import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { getDefaultAxiosPayload } from '@/utils/functions'

describe('CampaignManagerPhishingScenarios.vue (extra)', () => {
  it('getContainerStyle returns empty object when distribution is not manually', () => {
    const ctx = {
      isValid: false,
      scenarioDistribution: 2
    }
    const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
    expect(result).toEqual({})
  })

  it('transformLandingPages maps main and secondary languages with page templates', () => {
    const ctx = {
      languages: [
        { value: 'en', text: 'English' },
        { value: 'tr', text: 'Turkish' }
      ]
    }
    const landingPages = [
      {
        name: 'Page 1',
        order: 1,
        prompt: 'Prompt',
        content: '<p>EN</p>',
        languageTypeResourceId: 'en',
        languageTypeName: 'English',
        languages: [
          {
            content: '<p>TR</p>',
            languageTypeResourceId: 'tr',
            languageTypeName: 'Turkish'
          }
        ]
      }
    ]

    const result = CampaignManagerPhishingScenarios.methods.transformLandingPages.call(
      ctx,
      landingPages,
      'en',
      'English'
    )

    expect(result.templates).toHaveLength(1)
    expect(result.templates[0].languages).toEqual({
      en: '<p>EN</p>',
      tr: '<p>TR</p>'
    })
    expect(result.languages).toEqual(
      expect.arrayContaining([
        { value: 'en', text: 'English' },
        { value: 'tr', text: 'Turkish' }
      ])
    )
  })

  it('applyLandingPageTemplatePayload updates templates and keeps current language when available', () => {
    const ctx = {
      languages: [{ value: 'en', text: 'English' }],
      landingPageLanguagePreview: 'en',
      landingPageTemplates: [],
      selectedLandingPageLanguages: [],
      transformLandingPages: CampaignManagerPhishingScenarios.methods.transformLandingPages
    }
    const payload = {
      languageTypeResourceId: 'en',
      languageTypeName: 'English',
      landingPages: [
        {
          name: 'LP',
          content: '<p>EN</p>',
          languageTypeResourceId: 'en',
          languageTypeName: 'English',
          languages: []
        }
      ]
    }

    CampaignManagerPhishingScenarios.methods.applyLandingPageTemplatePayload.call(ctx, payload)

    expect(ctx.landingPageTemplates).toHaveLength(1)
    expect(ctx.selectedLandingPageLanguages).toEqual([{ value: 'en', text: 'English' }])
    expect(ctx.landingPageLanguagePreview).toBe('en')
  })

  it('getLandingPageContent returns language-specific then fallback content branches', () => {
    const ctx = { landingPageLanguagePreview: 'tr' }
    const templateWithLanguages = {
      content: '<p>EN default</p>',
      languages: { tr: '<p>TR</p>', en: '<p>EN</p>' }
    }
    const templateWithOnlyContent = { content: '<p>Only main</p>' }
    const templateWithUnknownLanguage = { languages: { en: '<p>EN</p>' } }

    const localized = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithLanguages
    )
    const contentFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithOnlyContent
    )
    const firstLangFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      templateWithUnknownLanguage
    )
    const emptyFallback = CampaignManagerPhishingScenarios.methods.getLandingPageContent.call(
      ctx,
      null
    )

    expect(localized).toBe('<p>TR</p>')
    expect(contentFallback).toBe('<p>Only main</p>')
    expect(firstLangFallback).toBe('<p>EN</p>')
    expect(emptyFallback).toBe('')
  })

  it('handleLandingPageLanguageChange updates only for truthy values', () => {
    const ctx = { landingPageLanguagePreview: 'en' }
    CampaignManagerPhishingScenarios.methods.handleLandingPageLanguageChange.call(ctx, '')
    expect(ctx.landingPageLanguagePreview).toBe('en')

    CampaignManagerPhishingScenarios.methods.handleLandingPageLanguageChange.call(ctx, 'tr')
    expect(ctx.landingPageLanguagePreview).toBe('tr')
  })

  it('handleEmailTemplatePreviewLanguageChange returns early when template not found', () => {
    const setMock = jest.fn()
    const ctx = {
      phishingEmailTemplates: [{ languageTypeResourceId: 'en', template: '<p>EN</p>' }],
      emailTemplateParams: { template: '<p>OLD</p>' },
      emailTemplate: '<p>OLD</p>',
      languagePreview: 'en',
      $set: setMock
    }

    CampaignManagerPhishingScenarios.methods.handleEmailTemplatePreviewLanguageChange.call(ctx, 'tr')

    expect(setMock).not.toHaveBeenCalled()
    expect(ctx.emailTemplate).toBe('<p>OLD</p>')
    expect(ctx.languagePreview).toBe('en')
  })

  describe('extra watchers and methods logic', () => {
    let ctx

    beforeEach(() => {
      ctx = {
        $emit: jest.fn(),
        $set: jest.fn(),
        $store: {
          commit: jest.fn(),
          state: {
            dashboard: { selectedCompanyObject: { logoUrl: 'dash-logo.png' } },
            auth: { logoUrl: 'auth-logo.png' }
          }
        },
        debounce: (cb) => cb(),
        axiosPayload: getDefaultAxiosPayload(),
        category: [],
        method: [],
        language: [],
        difficulty: [],
        search: '',
        scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
        trainingTabModel: {},
        phishingScenarioItems: [],
        value: [],
        type: SCENARIO_TYPES.PHISHING,
        languages: [
          { value: 'en', text: 'English' },
          { value: 'tr', text: 'Turkish' }
        ],
        callForPhishingScenarios: jest.fn(),
        campaignManagerResourceId: 'cm-id',
        isEdit: false,
        defaultPhishingScenariosValuesMapped: [],
        isShowSelectedScenarios: false,
        resetFilters: jest.fn(),
        isDistributionManually: true,
        upperTab: 'scenarios',
        tab: 'email',
        checkboxModel: {},
        emailTemplateParams: {},
        emailTemplatePreviewSelectedRow: null,
        isShowEmailTemplatePreview: false,
        landingPageParams: {},
        landingPagePreviewSelectedRow: null,
        isShowLandingPagePreview: false,
        isShowTrainingDialog: false,
        isShowCategoryTrainingDialog: false,
        selectedTemplateResourceId: '123',
        trainingForCategory: { trainingId: 1, trainingName: 'test' }
      }
    })

    // Watchers tests
    it('initialCategoryFilter setter handles existing array categories', () => {
      const val = {
        filterGroups: [
          {
            filterItems: [
              { fieldName: 'method', value: 'Click,Data' },
              { fieldName: 'LanguageTypeResourceId', value: 'en,tr' },
              { fieldName: 'difficulty', value: 'Easy,Hard' },
              { fieldName: 'Category', value: 'Cat1,Cat2' }
            ]
          },
          {
            filterItems: [
              { fieldName: 'Name', value: 'search term' }
            ]
          }
        ]
      }
      CampaignManagerPhishingScenarios.watch.initialCategoryFilter.handler.call(ctx, val)
      expect(ctx.search).toBe('search term')
      expect(ctx.method).toEqual([{ text: 'Click', value: 'Click' }, { text: 'Data', value: 'Data' }])
      expect(ctx.language).toEqual([{ text: 'English', value: 'en' }, { text: 'Turkish', value: 'tr' }])
      expect(ctx.difficulty).toEqual([{ text: 'Easy', value: 'Easy' }, { text: 'Hard', value: 'Hard' }])
      expect(ctx.category).toEqual(['Cat1', 'Cat2'])
    })

    it('initialCategoryFilter setter handles single items', () => {
      const val = {
        filterGroups: [
          {
            filterItems: [
              { fieldName: 'method', value: 'Click' },
              { fieldName: 'LanguageTypeResourceId', value: 'en' },
              { fieldName: 'difficulty', value: 'Easy' },
              { fieldName: 'Category', value: 'Cat1' }
            ]
          },
          { filterItems: [] }
        ]
      }
      CampaignManagerPhishingScenarios.watch.initialCategoryFilter.handler.call(ctx, val)
      expect(ctx.method).toEqual([{ text: 'Click', value: 'Click' }])
      expect(ctx.language).toEqual([{ text: 'English', value: 'en' }])
      expect(ctx.difficulty).toEqual([{ text: 'Easy', value: 'Easy' }])
      expect(ctx.category).toEqual(['Cat1'])
    })

    it('initialCategoryFilter returns early if val is null', () => {
      CampaignManagerPhishingScenarios.watch.initialCategoryFilter.handler.call(ctx, null)
      expect(ctx.search).toBe('')
    })

    it('scenarioDistribution watch updates upperTab or resets based on value', () => {
      CampaignManagerPhishingScenarios.watch.scenarioDistribution.call(ctx, SCENARIO_DISTRIBUTION.MANUALLY)
      expect(ctx.$emit).toHaveBeenCalledWith('distributionChanged', SCENARIO_DISTRIBUTION.MANUALLY)
      expect(ctx.upperTab).toBe('scenarios')

      CampaignManagerPhishingScenarios.watch.scenarioDistribution.call(ctx, 3) // some id
      expect(ctx.tab).toBe('email')
      expect(ctx.isShowSelectedScenarios).toBe(false)
      expect(ctx.$emit).toHaveBeenCalledWith('input', [])
      expect(ctx.checkboxModel).toEqual({})
    })

    it('defaultPhishingScenariosValuesMapped handles arrays', () => {
      const val = [{ value: 'res1' }, { value: 'res2' }]
      CampaignManagerPhishingScenarios.watch.defaultPhishingScenariosValuesMapped.call(ctx, val)
      expect(ctx.$set).toHaveBeenCalledTimes(2)
      expect(ctx.checkboxModel['res1']).toBe(true)
      expect(ctx.checkboxModel['res2']).toBe(true)
      expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
    })

    it('defaultPhishingScenariosValuesMapped handles single object', () => {
      const val = { value: 'res1' }
      CampaignManagerPhishingScenarios.watch.defaultPhishingScenariosValuesMapped.call(ctx, val)
      expect(ctx.$set).toHaveBeenCalledTimes(1)
      expect(ctx.checkboxModel['res1']).toBe(true)
    })

    it('search watch updates filter and calls scenarios', () => {
      CampaignManagerPhishingScenarios.watch.search.call(ctx, 'foo')
      expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems[0].Value).toBe('foo')
      expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
      expect(ctx.isShowSelectedScenarios).toBe(false)
    })

    it('difficulty watch updates or deletes filter items', () => {
      CampaignManagerPhishingScenarios.watch.difficulty.call(ctx, [{ text: 'Hard' }])
      let diffFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'difficulty')
      expect(diffFilter.Value).toBe('Hard')

      // Empty difficulty removes it
      CampaignManagerPhishingScenarios.watch.difficulty.call(ctx, [])
      diffFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'difficulty')
      expect(diffFilter).toBeUndefined()
    })

    it('method watch updates or deletes filter items', () => {
      CampaignManagerPhishingScenarios.watch.method.call(ctx, [{ text: 'Click' }])
      let methodFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'method')
      expect(methodFilter.Value).toBe('Click')

      CampaignManagerPhishingScenarios.watch.method.call(ctx, null)
      methodFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'method')
      expect(methodFilter).toBeUndefined()
    })

    it('language watch updates or deletes filter items', () => {
      CampaignManagerPhishingScenarios.watch.language.call(ctx, [{ value: 'en' }])
      let langFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'LanguageTypeResourceId')
      expect(langFilter.Value).toBe('en')

      CampaignManagerPhishingScenarios.watch.language.call(ctx, null)
      langFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'LanguageTypeResourceId')
      expect(langFilter).toBeUndefined()
    })

    it('category watch updates or deletes filter items, resets distribution if empty', () => {
      ctx.scenarioDistribution = 3
      CampaignManagerPhishingScenarios.watch.category.call(ctx, [])
      expect(ctx.scenarioDistribution).toBe(SCENARIO_DISTRIBUTION.MANUALLY)
      
      CampaignManagerPhishingScenarios.watch.category.call(ctx, ['Cat1'])
      let catFilter = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.find(i => i.FieldName === 'Category')
      expect(catFilter.Value).toBe('Cat1')
    })

    it('items watch populates phishingScenarioItems with tags', () => {
      const val = [{ id: 1 }, { id: 2, tags: ['a'] }]
      CampaignManagerPhishingScenarios.watch.items.call(ctx, val)
      expect(ctx.phishingScenarioItems[0].tags).toEqual([])
      expect(ctx.phishingScenarioItems[1].tags).toEqual(['a'])
    })

    it('value watch disables isShowSelectedScenarios if empty', () => {
      ctx.isShowSelectedScenarios = true
      CampaignManagerPhishingScenarios.watch.value.call(ctx, [])
      expect(ctx.isShowSelectedScenarios).toBe(false)
    })

    it('isShowSelectedScenarios watch calls resetFilters if true', () => {
      CampaignManagerPhishingScenarios.watch.isShowSelectedScenarios.call(ctx, true)
      expect(ctx.resetFilters).toHaveBeenCalled()
    })

    it('getTrainingPreviewDialog.status watch closes dialogs if false', () => {
      ctx.isShowTrainingDialog = true
      ctx.isShowCategoryTrainingDialog = true
      CampaignManagerPhishingScenarios.watch['getTrainingPreviewDialog.status'].handler.call(ctx, false)
      expect(ctx.isShowTrainingDialog).toBe(false)
      expect(ctx.isShowCategoryTrainingDialog).toBe(false)
    })

    // Methods
    it('handleRemoveFilter removes from type', () => {
      ctx.method = [{ text: 'Click' }, { text: 'Video' }]
      CampaignManagerPhishingScenarios.methods.handleRemoveFilter.call(ctx, { key: 'Type', value: 'Click' })
      expect(ctx.method).toEqual([{ text: 'Video' }])
    })
    it('handleRemoveFilter handles Language', () => {
      ctx.language = 'en'
      CampaignManagerPhishingScenarios.methods.handleRemoveFilter.call(ctx, { key: 'Language', value: 'En' })
      expect(ctx.language).toBe('')
    })
    it('handleRemoveFilter removes from difficulty', () => {
      ctx.difficulty = [{ text: 'Hard' }]
      CampaignManagerPhishingScenarios.methods.handleRemoveFilter.call(ctx, { key: 'Difficulty', value: 'Hard' })
      expect(ctx.difficulty).toEqual([])
    })
    it('handleRemoveFilter removes from category', () => {
      ctx.category = ['Cat1', 'Cat2']
      CampaignManagerPhishingScenarios.methods.handleRemoveFilter.call(ctx, { key: 'Category', value: 'Cat1' })
      expect(ctx.category).toEqual(['Cat2'])
    })

    it('getItemClasses adds correct classes', () => {
      ctx.selectedTemplateResourceId = 'id1'
      ctx.value = [{ resourceId: 'id1' }]
      const classes = CampaignManagerPhishingScenarios.methods.getItemClasses.call(ctx, 'id1')
      expect(classes[1]['bg-phishing-gray']).toBe(true)
      expect(classes[2]['template-list--selected']).toBeTruthy()
    })

    it('getItemDescription returns default space if empty/invalid', () => {
      expect(CampaignManagerPhishingScenarios.methods.getItemDescription.call(ctx, null)).toBe('\xa0')
      expect(CampaignManagerPhishingScenarios.methods.getItemDescription.call(ctx, { description: 'null' })).toBe('\xa0')
      expect(CampaignManagerPhishingScenarios.methods.getItemDescription.call(ctx, { description: 'something' })).toBe('something')
    })
    
    it('resetFilters works correctly', () => {
      ctx.axiosPayload = {} // will be overridden
      CampaignManagerPhishingScenarios.methods.resetFilters.call(ctx)
      expect(ctx.search).toBe('')
      expect(ctx.difficulty).toEqual([])
      expect(ctx.method).toEqual([])
      expect(ctx.language).toBe('')
      expect(ctx.category).toEqual([])
      expect(ctx.axiosPayload.pageSize).toBe(10) // default
      expect(ctx.callForPhishingScenarios).toHaveBeenCalledWith(false)
    })

    it('handleClickPreview for email opens preview', () => {
      ctx.tab = 'email'
      ctx.emailTemplateParams = { resourceId: 'res1', name: 'Email1' }
      CampaignManagerPhishingScenarios.methods.handleClickPreview.call(ctx)
      expect(ctx.emailTemplatePreviewSelectedRow).toEqual({ resourceId: 'res1', name: 'Email1' })
      expect(ctx.isShowEmailTemplatePreview).toBe(true)
    })

    it('handleClickPreview for landing-page opens preview', () => {
      ctx.tab = 'landing-page'
      ctx.landingPageParams = { resourceId: 'res2', name: 'Land1' }
      CampaignManagerPhishingScenarios.methods.handleClickPreview.call(ctx)
      expect(ctx.landingPagePreviewSelectedRow).toEqual({ resourceId: 'res2', name: 'Land1' })
      expect(ctx.isShowLandingPagePreview).toBe(true)
    })

    it('handleScroll calls next page if near bottom', () => {
      const mockEvent = {
        target: {
          scrollTop: 90,
          scrollHeight: 200,
          offsetHeight: 110
        }
      } // Math: 90 - (200 - 110) = 90 - 90 = 0. 0 < 10 and 0 > -10 -> true
      ctx.isShowSelectedScenarios = false
      CampaignManagerPhishingScenarios.methods.handleScroll.call(ctx, mockEvent)
      expect(ctx.callForPhishingScenarios).toHaveBeenCalledWith(false)
      expect(ctx.axiosPayload.pageSize).toBe(20)
    })

    it('handleScroll does nothing if not near bottom', () => {
      const mockEvent = {
        target: { scrollTop: 10, scrollHeight: 200, offsetHeight: 110 }
      }
      CampaignManagerPhishingScenarios.methods.handleScroll.call(ctx, mockEvent)
      expect(ctx.callForPhishingScenarios).not.toHaveBeenCalled()
    })

    it('handleScroll does nothing if isShowSelectedScenarios is true', () => {
      const mockEvent = { target: { scrollTop: 90, scrollHeight: 200, offsetHeight: 110 } }
      ctx.isShowSelectedScenarios = true
      CampaignManagerPhishingScenarios.methods.handleScroll.call(ctx, mockEvent)
      expect(ctx.callForPhishingScenarios).not.toHaveBeenCalled()
    })

    it('setSelectedTemplate toggles checkbox and modifies value array properly', () => {
      ctx.trainingTabModel = { 'item1': {} }
      ctx.value = []
      // Select
      CampaignManagerPhishingScenarios.methods.setSelectedTemplate.call(ctx, { resourceId: 'item1' }, true)
      expect(ctx.$set).toHaveBeenCalledWith(ctx.trainingTabModel['item1'], 'isCheckboxSelected', true)
      expect(ctx.$emit).toHaveBeenCalledWith('input', [{ resourceId: 'item1' }])

      // Deselect
      ctx.value = [{ resourceId: 'item1' }, { resourceId: 'item2' }]
      CampaignManagerPhishingScenarios.methods.setSelectedTemplate.call(ctx, { resourceId: 'item1' }, false)
      expect(ctx.$emit).toHaveBeenCalledWith('input', [{ resourceId: 'item2' }])
    })

    it('handleTrainingPreviewButtonClick toggles dialog to open', () => {
      ctx.trainingTabModel['123'] = { trainingId: 1, trainingName: 'test', trainingLanguageIds: [] }
      CampaignManagerPhishingScenarios.methods.toggleShowTrainingDialog.call(ctx)
      expect(ctx.$store.commit).toHaveBeenCalled()
      expect(ctx.isShowTrainingDialog).toBe(true)
    })
    it('handleTrainingPreviewButtonClick toggles dialog to close', () => {
      ctx.isShowTrainingDialog = true
      CampaignManagerPhishingScenarios.methods.toggleShowTrainingDialog.call(ctx)
      expect(ctx.$store.commit).toHaveBeenCalled()
      expect(ctx.isShowTrainingDialog).toBe(false)
    })

    it('handleCategoryTrainingPreviewButtonClick toggles category dialog to open', () => {
       CampaignManagerPhishingScenarios.methods.toggleShowCategoryTrainingDialog.call(ctx)
       expect(ctx.$store.commit).toHaveBeenCalled()
       expect(ctx.isShowCategoryTrainingDialog).toBe(true)
    })
    it('handleCategoryTrainingPreviewButtonClick toggles category dialog to close', () => {
      ctx.isShowCategoryTrainingDialog = true
       CampaignManagerPhishingScenarios.methods.toggleShowCategoryTrainingDialog.call(ctx)
       expect(ctx.$store.commit).toHaveBeenCalled()
       expect(ctx.isShowCategoryTrainingDialog).toBe(false)
    })
  })
})