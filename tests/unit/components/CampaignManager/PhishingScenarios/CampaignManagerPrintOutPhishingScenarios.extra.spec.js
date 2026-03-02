import CampaignManagerPrintOutPhishingScenarios from '@/components/CampaignManager/PhishingScenarios/CampaignManagerPrintOutPhishingScenarios.vue'
import { getScenario, getScenariosList } from '@/api/scenarios'
import QuishingService from '@/api/quishing'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'

jest.mock('@/api/scenarios')
jest.mock('@/api/quishing')
jest.mock('@/api/phishingsimulator')

describe('CampaignManagerPrintOutPhishingScenarios.vue (extra branching coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('watchers', () => {
    let ctx
    beforeEach(() => {
      ctx = {
        debounce: (cb) => cb(),
        axiosPayload: {
          filter: {
            FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
          }
        },
        callForPhishingScenarios: jest.fn(),
        isShowSelectedScenarios: true
      }
    })

    it('search maps FilterGroups index 1 correctly and triggers api call', () => {
      CampaignManagerPrintOutPhishingScenarios.watch.search.call(ctx, 'findme')
      
      const filterItems = ctx.axiosPayload.filter.FilterGroups[1].FilterItems
      expect(filterItems.length).toBeGreaterThan(0)
      expect(filterItems[0].Value).toBe('findme')
      expect(ctx.callForPhishingScenarios).toHaveBeenCalled()
      expect(ctx.isShowSelectedScenarios).toBe(false)
    })

    it('difficulty pushes or updates filter gracefully', () => {
      const difficultyWatcher = CampaignManagerPrintOutPhishingScenarios.watch.difficulty

      difficultyWatcher.call(ctx, 'Hard')
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('Hard')
      
      difficultyWatcher.call(ctx, 'Easy')
      // Ensure it updates the existing instead of duplicating
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems.length).toBe(1)
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('Easy')
      
      expect(ctx.callForPhishingScenarios).toHaveBeenCalledTimes(2)
    })

    it('method pushes or updates filter gracefully', () => {
      const methodWatcher = CampaignManagerPrintOutPhishingScenarios.watch.method

      methodWatcher.call(ctx, 'Click-Only')
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('Click-Only')
      
      methodWatcher.call(ctx, 'Attachment')
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems.length).toBe(1)
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('Attachment')
    })

    it('language pushes or updates filter gracefully', () => {
      const langWatcher = CampaignManagerPrintOutPhishingScenarios.watch.language

      langWatcher.call(ctx, 'EN')
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('EN')
      
      langWatcher.call(ctx, 'TR')
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems.length).toBe(1)
      expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].Value).toBe('TR')
    })
  })

  describe('callForSelectedPhishingScenario mappings and bindings', () => {
    it('sets phishing models and parses quishing data securely', async () => {
      QuishingService.getScenario.mockResolvedValueOnce({
        data: { data: { resourceId: 'q-res', methodTypeId: 2 } }
      })
      QuishingService.getQuishingScenarioLandingPageAndEmailTemplate.mockResolvedValueOnce({
        data: {
           data: {
             quishingTemplate: {
                fromName: 'q-name', type: 'individual'
             }
           }
        }
      })

      const ctx = {
        type: 'Quishing', // SCENARIO_TYPES.QUISHING bypass
        adjustTrainingModel: jest.fn(),
        phishingScenarioItems: [],
        setSelectedTemplate: jest.fn(),
        isSingle: true,
        trainingTabModel: {}
      }

      CampaignManagerPrintOutPhishingScenarios.methods.callForSelectedPhishingScenario.call(ctx, 'q-res', { quishingType: 'individual printout' })
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()

      expect(ctx.adjustTrainingModel).toHaveBeenCalledWith('q-res')
      // ensures that isSingle branch calls setter safely
      expect(ctx.setSelectedTemplate).toHaveBeenCalled()
      expect(ctx.tab).toBe('individual-printout')
    })
  })

  describe('callForPhishingScenarios list enrichment logic', () => {
    it('enriches languageTypeName using string and array maps safely', async () => {
      getScenariosList.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              { resourceId: '1', languageTypeName: 'EN' },
              { resourceId: '2', languageTypeName: ['FR'] }
            ]
          }
        }
      })

      const ctx = {
        type: 'Phishing',
        isEdit: true,
        defaultPhishingScenariosValuesMapped: ['m1'],
        value: [],
        axiosPayload: { pageSize: 0, templateTypes: [] },
        languages: [
          { languageTypeName: 'EN', text: 'English' },
          { languageTypeName: 'FR', text: 'French' }
        ],
        campaignManagerResourceId: 'camp-id',
        callForSelectedPhishingScenario: jest.fn()
      }

      CampaignManagerPrintOutPhishingScenarios.methods.callForPhishingScenarios.call(ctx, true)
      await Promise.resolve()

      expect(ctx.axiosPayload.pageSize).toBe(10) // Map max logic fallback
      expect(ctx.phishingScenarioItems[0].languageTypeName).toBe('English')
      expect(ctx.phishingScenarioItems[1].languageTypeName[0]).toBe('French')
      expect(ctx.callForSelectedPhishingScenario).toHaveBeenCalled()
    })
  })
})
