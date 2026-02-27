import CampaignManagerPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPhishingScenarios.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'

describe('CampaignManagerPhishingScenarios.vue', () => {
  let ctx

  beforeEach(() => {
    ctx = {
      $emit: jest.fn(),
      $set: jest.fn(),
      type: SCENARIO_TYPES.PHISHING,
      tab: 'email',
      scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
      getTrainingSearchPermission: true,
      value: [],
      method: [],
      language: [],
      difficulty: [],
      category: [],
      emailTemplateParams: {},
      isPhishing: true,
      isFilterOrSearchActive: false,
      isShowSelectedScenarios: false,
      phishingScenarioItems: [],
      getItems: [],
      landingPageTemplates: [],
      getLandingPageContent: jest.fn(),
      getSingleTemplateDetails: '',
      isSelectedLandingTemplateRedFlagged: false,
      isEdit: false,
      callForPhishingScenarios: jest.fn(),
      callForEnrollmentFormDetails: jest.fn(),
      isShowTemplate: false,
      trainingTabModel: {},
      $refs: {
        trainingTab: {
          $refs: {
            inputContentLanguage: {
              setDefaultValue: jest.fn()
            }
          }
        }
      },
      $store: {
        state: {
          dashboard: { selectedCompanyObject: { logoUrl: 'dash-logo.png' } },
          auth: { logoUrl: 'auth-logo.png' },
          whitelabel: { mainLogoUrl: 'white-logo.png' }
        }
      }
    }
  })

  describe('computed', () => {
    it('getMethodItems returns quishingMethods when type is QUISHING', () => {
      ctx.type = SCENARIO_TYPES.QUISHING
      const result = CampaignManagerPhishingScenarios.computed.getMethodItems.call(ctx)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('getMethodItems returns methods when type is PHISHING', () => {
      ctx.type = SCENARIO_TYPES.PHISHING
      const result = CampaignManagerPhishingScenarios.computed.getMethodItems.call(ctx)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('getContainerStyle returns border style when invalid and manually', () => {
      ctx.isValid = false
      ctx.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
      const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
      expect(result).toHaveProperty('border')
      expect(result.border).toContain('#ff5252')
    })

    it('getContainerStyle returns empty when valid', () => {
      ctx.isValid = true
      ctx.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
      const result = CampaignManagerPhishingScenarios.computed.getContainerStyle.call(ctx)
      expect(result).toEqual({})
    })

    it('getEmailTemplatePreviewLanguageHint formats correctly', () => {
      ctx.selectedTemplateLanguages = [{ id: 1 }]
      const result = CampaignManagerPhishingScenarios.computed.getEmailTemplatePreviewLanguageHint.call(ctx)
      expect(result).toContain('1 language')
    })

    it('getEmailTemplatePreviewLanguageHint uses plural for multiple', () => {
      ctx.selectedTemplateLanguages = [{ id: 1 }, { id: 2 }]
      const result = CampaignManagerPhishingScenarios.computed.getEmailTemplatePreviewLanguageHint.call(ctx)
      expect(result).toContain('2 languages')
    })

    it('getBadges returns empty array when no filters', () => {
      ctx.method = []
      ctx.language = []
      ctx.difficulty = []
      ctx.category = []
      const result = CampaignManagerPhishingScenarios.computed.getBadges.call(ctx)
      expect(result).toEqual([])
    })

    it('getBadges includes method badges when method has items', () => {
      ctx.method = [{ text: 'Click-Only' }]
      const result = CampaignManagerPhishingScenarios.computed.getBadges.call(ctx)
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('Type')
      expect(result[0].value).toBe('Click-Only')
    })

    it('getLandingPageKey returns string with random when tab is landing-page', () => {
      ctx.tab = 'landing-page'
      expect(CampaignManagerPhishingScenarios.computed.getLandingPageKey.call(ctx)).toMatch(/^key-/)
    })

    it('isDistributionManually returns true when scenarioDistribution is MANUALLY', () => {
      ctx.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
      expect(CampaignManagerPhishingScenarios.computed.isDistributionManually.call(ctx)).toBe(true)
    })

    it('getCategoryItems returns categories texts if formDetails exist', () => {
      ctx.formDetails = { categories: [{ text: 'Cat1' }, { text: 'Cat2' }] }
      expect(CampaignManagerPhishingScenarios.computed.getCategoryItems.call(ctx)).toEqual(['Cat1', 'Cat2'])
    })

    it('isShowTrainingTab returns true when training permission is true and distribution is manually', () => {
      ctx.getTrainingSearchPermission = true
      ctx.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
      expect(CampaignManagerPhishingScenarios.computed.isShowTrainingTab.call(ctx)).toBe(true)
    })

    it('isShowSelectedScenariosSwitchDisabled returns true if value is empty', () => {
      ctx.value = []
      ctx.scenarioDistribution = SCENARIO_DISTRIBUTION.MANUALLY
      expect(CampaignManagerPhishingScenarios.computed.isShowSelectedScenariosSwitchDisabled.call(ctx)).toBe(true)
    })

    it('getPhishingFile returns object with name if phishingFileName exists', () => {
      ctx.emailTemplateParams = { phishingFileName: 'test.doc' }
      const result = CampaignManagerPhishingScenarios.computed.getPhishingFile.call(ctx)
      expect(result).toEqual({ name: 'test.doc' })
    })

    it('getPhishingFile returns null if no phishingFileName', () => {
      ctx.emailTemplateParams = {}
      expect(CampaignManagerPhishingScenarios.computed.getPhishingFile.call(ctx)).toBeNull()
    })

    it('getSelectedScenarioSwitchLabel returns correct label', () => {
      ctx.value = [1, 2, 3]
      expect(CampaignManagerPhishingScenarios.computed.getSelectedScenarioSwitchLabel.call(ctx)).toBe('Only show selected scenarios (3)')
    })

    it('getTableEmptyTextMessage returns filter message if filter is active', () => {
      ctx.isFilterOrSearchActive = true
      expect(CampaignManagerPhishingScenarios.computed.getTableEmptyTextMessage.call(ctx)).toBe('Sorry, that search and filter criteria has no results.')
    })

    it('getTableEmptySubMessage returns adjusted filter message if filter is active', () => {
      ctx.isFilterOrSearchActive = true
      ctx.isPhishing = true
      expect(CampaignManagerPhishingScenarios.computed.getTableEmptySubMessage.call(ctx)).toBe('Go to Phishing Simulator > Phishing Scenarios to create a new scenario')
    })
    
    it('isFilterOrSearchActive returns true if method exists', () => {
      ctx.method = [1]
      expect(CampaignManagerPhishingScenarios.computed.isFilterOrSearchActive.call(ctx)).toBeTruthy()
    })

    it('getItems returns value if isShowSelectedScenarios is true', () => {
      ctx.isShowSelectedScenarios = true
      ctx.value = ['val1']
      expect(CampaignManagerPhishingScenarios.computed.getItems.call(ctx)).toEqual(['val1'])
    })

    it('getStyle returns setup styles if getItems is empty', () => {
      Object.defineProperty(ctx, 'getItems', { get: () => [] })
      expect(CampaignManagerPhishingScenarios.computed.getStyle.call(ctx)).toEqual({
        maxHeight: '360px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      })
    })

    it('isLandingPageTabsVisible returns true if landingPageTemplates length > 1', () => {
      ctx.landingPageTemplates = [1, 2]
      expect(CampaignManagerPhishingScenarios.computed.isLandingPageTabsVisible.call(ctx)).toBe(true)
    })

    it('getSingleTemplateDetails uses getLandingPageContent', () => {
      ctx.landingPageTemplates = [{ content: 'fallback' }]
      ctx.getLandingPageContent.mockReturnValue('content')
      expect(CampaignManagerPhishingScenarios.computed.getSingleTemplateDetails.call(ctx)).toBe('content')
    })

    it('isSelectedLandingTemplateRedFlagged returns true if html contains data-redflag', () => {
      Object.defineProperty(ctx, 'getSingleTemplateDetails', { get: () => '<div data-redflag></div>' })
      expect(CampaignManagerPhishingScenarios.computed.isSelectedLandingTemplateRedFlagged.call(ctx)).toBe(true)
    })

    it('isPhishing returns true if type is PHISHING', () => {
      ctx.type = SCENARIO_TYPES.PHISHING
      expect(CampaignManagerPhishingScenarios.computed.isPhishing.call(ctx)).toBe(true)
    })
  })

  describe('created hook', () => {
    it('calls callForPhishingScenarios when isEdit is false', () => {
      ctx.isEdit = false
      CampaignManagerPhishingScenarios.created.call(ctx)
      expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
    })

    it('calls callForEnrollmentFormDetails when getTrainingSearchPermission is true', () => {
      ctx.getTrainingSearchPermission = true
      CampaignManagerPhishingScenarios.created.call(ctx)
      expect(ctx.callForEnrollmentFormDetails).toHaveBeenCalled()
    })
  })

  describe('simple methods', () => {
    it('handleCreatePhishingScenarioClick emits on-create-phishing-scenario', () => {
      CampaignManagerPhishingScenarios.methods.handleCreatePhishingScenarioClick.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('on-create-phishing-scenario')
    })

    it('getListItemClasses returns v-list-item--active true if scenarioDistribution matches', () => {
      ctx.scenarioDistribution = '123'
      const result = CampaignManagerPhishingScenarios.methods.getListItemClasses.call(ctx, '123')
      expect(result['v-list-item--active']).toBe(true)
    })

    it('toggleTemplateDialog toggles isShowTemplate boolean', () => {
      ctx.isShowTemplate = false
      CampaignManagerPhishingScenarios.methods.toggleTemplateDialog.call(ctx)
      expect(ctx.isShowTemplate).toBe(true)
    })

    it('adjustTrainingModel creates new TrainingTabModel if it does not exist', () => {
      CampaignManagerPhishingScenarios.methods.adjustTrainingModel.call(ctx, 'res1')
      expect(ctx.$set).toHaveBeenCalledWith(ctx.trainingTabModel, 'res1', expect.any(Object))
    })

    it('adjustTrainingModel calls setDefaultValue if rainingLanguageIds is empty', () => {
      ctx.trainingTabModel = {
        'res2': { trainingId: 1, trainingLanguageIds: [] }
      }
      CampaignManagerPhishingScenarios.methods.adjustTrainingModel.call(ctx, 'res2')
      expect(ctx.$refs.trainingTab.$refs.inputContentLanguage.setDefaultValue).toHaveBeenCalled()
    })
  })
})
