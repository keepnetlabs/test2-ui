jest.mock('@/api/smishing', () => ({
  searchSmishingScenarios: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] } } })
  ),
  getSmishingScenario: jest.fn(() =>
    Promise.resolve({ data: { data: { resourceId: 'r1', name: 'Scenario 1' } } })
  ),
  previewSmishingScenario: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          textTemplate: { template: 'Hello', name: 'T1' },
          landingPageTemplate: {
            name: 'LP1',
            description: 'Desc',
            landingPages: [{ content: '<p>Page</p>' }],
            urlTemplate: 'http://x.com'
          },
          methodTypeId: 1
        }
      }
    })
  )
}))

import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CampaignManagerSmishingScenarios from '@/components/SmishingCampaignManager/CampaignManagerSmishingScenarios.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CampaignManagerSmishingScenarios.vue', () => {
  let store

  const createStore = () => {
    return new Vuex.Store({
      modules: {
        permissions: {
          namespaced: true,
          getters: {
            getTrainingSearchPermission: () => true
          }
        },
        trainingLibrary: {
          namespaced: true,
          getters: {
            getTrainingPreviewDialog: () => ({ status: false })
          },
          mutations: {
            SET_TRAINING_PREVIEW_DIALOG: jest.fn()
          }
        }
      }
    })
  }

  const createWrapper = (propsData = {}, dataOverrides = {}) => {
    store = createStore()
    const wrapper = shallowMount(CampaignManagerSmishingScenarios, {
      localVue,
      store,
      propsData: {
        isEdit: true,
        items: [],
        languages: [],
        value: [],
        isValid: true,
        defaultPhishingScenariosValuesMapped: [],
        campaignManagerResourceId: '',
        ...propsData
      },
      stubs: {
        SmishingPreviewDrawer: true,
        TrainingLibraryCommonComponents: true,
        CampaignManagerPhishingScenariosTrainingTab: true,
        ShowMoreTags: true,
        KEmailPreview: true,
        KSelect: true,
        Multipane: true,
        MultipaneResizer: true,
        TabsWithMfaSettings: true,
        ElTabs: true,
        ElTabPane: true
      }
    })
    if (Object.keys(dataOverrides).length) {
      Object.entries(dataOverrides).forEach(([key, val]) => {
        wrapper.setData({ [key]: val })
      })
    }
    return wrapper
  }

  describe('rendering', () => {
    it('renders the component', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('does not render SmishingPreviewDrawer when isShowTemplate is false', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('smishingpreviewdrawer-stub').exists()).toBe(false)
    })

    it('renders SmishingPreviewDrawer when isShowTemplate is true', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ isShowTemplate: true })
      const drawer = wrapper.find('smishingpreviewdrawer-stub')
      expect(drawer.exists()).toBe(true)
    })

    it('passes correct props to SmishingPreviewDrawer', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        isShowTemplate: true,
        landingPageParams: { name: 'My LP' }
      })
      const drawer = wrapper.find('smishingpreviewdrawer-stub')
      expect(drawer.attributes('status')).toBe('true')
      expect(drawer.attributes('title')).toBe('Landing Page Template Preview')
    })
  })

  describe('computed: getContainerStyle', () => {
    it('returns empty object when valid', () => {
      const wrapper = createWrapper({ isValid: true })
      expect(wrapper.vm.getContainerStyle).toEqual({})
    })

    it('returns border style when invalid', () => {
      const wrapper = createWrapper({ isValid: false })
      const style = wrapper.vm.getContainerStyle
      expect(style.border).toContain('1px solid')
      expect(style.border).toContain('#ff5252')
    })
  })

  describe('computed: getTemplateHeader', () => {
    it('returns landing page name', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ landingPageParams: { name: 'Template A' } })
      expect(wrapper.vm.getTemplateHeader).toBe('Template A')
    })

    it('returns empty string when landingPageParams is null', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTemplateHeader).toBe('')
    })
  })

  describe('computed: getItems', () => {
    it('returns value when isShowSelectedScenarios is true', async () => {
      const items = [{ resourceId: 's1' }]
      const wrapper = createWrapper({ value: items })
      await wrapper.setData({ isShowSelectedScenarios: true })
      expect(wrapper.vm.getItems).toEqual(items)
    })

    it('returns phishingScenarioItems when isShowSelectedScenarios is false', async () => {
      const scenarioItems = [{ resourceId: 's2' }]
      const wrapper = createWrapper()
      await wrapper.setData({ phishingScenarioItems: scenarioItems })
      expect(wrapper.vm.getItems).toEqual(scenarioItems)
    })
  })

  describe('computed: getSelectedScenarioSwitchLabel', () => {
    it('shows count of selected scenarios', () => {
      const wrapper = createWrapper({ value: [{ resourceId: 'a' }, { resourceId: 'b' }] })
      expect(wrapper.vm.getSelectedScenarioSwitchLabel).toBe('Only show selected scenarios (2)')
    })
  })

  describe('computed: isFilterOrSearchActive', () => {
    it('returns false when no filters or search', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isFilterOrSearchActive).toBeFalsy()
    })

    it('returns truthy when search has value', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ search: 'test' })
      expect(wrapper.vm.isFilterOrSearchActive).toBeTruthy()
    })

    it('returns truthy when method has value', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ method: 'Click-Only' })
      expect(wrapper.vm.isFilterOrSearchActive).toBeTruthy()
    })

    it('returns truthy when difficulty has value', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ difficulty: 'Easy' })
      expect(wrapper.vm.isFilterOrSearchActive).toBeTruthy()
    })
  })

  describe('computed: getTableEmptyTextMessage', () => {
    it('returns no-scenarios message when no filters active', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTableEmptyTextMessage).toBe(
        'You do not have any Smishing Scenarios'
      )
    })

    it('returns no-results message when filter is active', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ search: 'xyz' })
      expect(wrapper.vm.getTableEmptyTextMessage).toContain('no results')
    })
  })

  describe('computed: getTableEmptySubMessage', () => {
    it('returns filter-adjustment message when no filters active', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getTableEmptySubMessage).toContain('adjusting')
    })

    it('returns create-scenario message when filter is active', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ method: 'Click-Only' })
      expect(wrapper.vm.getTableEmptySubMessage).toContain('Smishing Simulator')
    })
  })

  describe('computed: getStyle', () => {
    it('returns empty object when items exist', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ phishingScenarioItems: [{ resourceId: '1' }] })
      expect(wrapper.vm.getStyle).toEqual({})
    })

    it('returns centered layout when no items', () => {
      const wrapper = createWrapper()
      const style = wrapper.vm.getStyle
      expect(style.maxHeight).toBe('360px')
      expect(style.display).toBe('flex')
      expect(style.justifyContent).toBe('center')
      expect(style.alignItems).toBe('center')
    })
  })

  describe('computed: getTemplatePreviewContent', () => {
    it('returns emailTemplate when tab is textMessage', () => {
      const ctx = { tab: 'textMessage', emailTemplate: '<p>email</p>' }
      const result = CampaignManagerSmishingScenarios.computed.getTemplatePreviewContent.call(ctx)
      expect(result).toBe('<p>email</p>')
    })

    it('returns landing page content when tab is not textMessage', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        tab: 'landing-page',
        landingPageTemplates: [{ content: '<p>landing</p>' }]
      })
      expect(wrapper.vm.getTemplatePreviewContent).toBe('<p>landing</p>')
    })
  })

  describe('computed: getCurrentLandingPageTemplate', () => {
    it('returns first template content when single template', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        landingPageTemplates: [{ content: '<p>single</p>' }]
      })
      expect(wrapper.vm.getCurrentLandingPageTemplate).toBe('<p>single</p>')
    })

    it('returns selected tab template when multiple templates', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        landingPageTemplates: [
          { content: '<p>first</p>' },
          { content: '<p>second</p>' }
        ],
        selectedLandingPageTab: '2'
      })
      expect(wrapper.vm.getCurrentLandingPageTemplate).toBe('<p>second</p>')
    })

    it('returns empty string when no templates', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getCurrentLandingPageTemplate).toBe('')
    })
  })

  describe('computed: isLandingPageTabsVisible', () => {
    it('returns true when multiple landing pages', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
      expect(wrapper.vm.isLandingPageTabsVisible).toBe(true)
    })

    it('returns false when single landing page', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ landingPageTemplates: [{ content: 'a' }] })
      expect(wrapper.vm.isLandingPageTabsVisible).toBe(false)
    })
  })

  describe('computed: getSingleTemplateDetails', () => {
    it('returns first template content', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        landingPageTemplates: [{ content: '<div>LP</div>' }]
      })
      expect(wrapper.vm.getSingleTemplateDetails).toBe('<div>LP</div>')
    })

    it('returns empty string when no templates', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getSingleTemplateDetails).toBe('')
    })
  })

  describe('methods: handleClickPreview', () => {
    it('sets isShowTemplate to true', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.isShowTemplate).toBe(false)
      wrapper.vm.handleClickPreview()
      expect(wrapper.vm.isShowTemplate).toBe(true)
    })

    it('opens SmishingPreviewDrawer after click', async () => {
      const wrapper = createWrapper()
      wrapper.vm.handleClickPreview()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('smishingpreviewdrawer-stub').exists()).toBe(true)
    })
  })

  describe('drawer close behavior', () => {
    it('hides drawer when isShowTemplate set to false', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ isShowTemplate: true })
      expect(wrapper.find('smishingpreviewdrawer-stub').exists()).toBe(true)
      await wrapper.setData({ isShowTemplate: false })
      expect(wrapper.find('smishingpreviewdrawer-stub').exists()).toBe(false)
    })
  })

  describe('methods: getItemClasses', () => {
    it('returns template-list class always', () => {
      const wrapper = createWrapper()
      const classes = wrapper.vm.getItemClasses('abc')
      expect(classes[0]).toBe('template-list')
    })

    it('adds bg-phishing-gray when item is selected', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ selectedTemplateResourceId: 'abc' })
      const classes = wrapper.vm.getItemClasses('abc')
      expect(classes[1]).toEqual({ 'bg-phishing-gray': true })
    })

    it('does not add bg-phishing-gray for other items', () => {
      const wrapper = createWrapper()
      const classes = wrapper.vm.getItemClasses('abc')
      expect(classes[1]).toEqual({ 'bg-phishing-gray': false })
    })

    it('adds template-list--selected when item is in value', () => {
      const wrapper = createWrapper({
        value: [{ resourceId: 'abc' }]
      })
      const classes = wrapper.vm.getItemClasses('abc')
      expect(classes[2]['template-list--selected']).toBeTruthy()
    })
  })

  describe('methods: getItemDescription', () => {
    it('returns description when present', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getItemDescription({ description: 'Test desc' })).toBe('Test desc')
    })

    it('returns non-breaking space for null description', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getItemDescription({ description: 'null' })).toBe('\xa0')
    })

    it('returns non-breaking space for undefined description', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getItemDescription({ description: 'undefined' })).toBe('\xa0')
    })

    it('returns non-breaking space when no description', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getItemDescription({})).toBe('\xa0')
    })

    it('handles empty input', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getItemDescription()).toBe('\xa0')
    })
  })

  describe('methods: resetFilters', () => {
    it('clears all filter values', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({
        search: 'hello',
        difficulty: 'Easy',
        method: 'Click-Only',
        language: 'en'
      })
      wrapper.vm.resetFilters()
      expect(wrapper.vm.search).toBe('')
      expect(wrapper.vm.difficulty).toBe('')
      expect(wrapper.vm.method).toBe('')
      expect(wrapper.vm.language).toBe('')
    })
  })

  describe('methods: setSelectedTemplate', () => {
    it('emits input with added item when value is true', () => {
      const wrapper = createWrapper({ value: [] })
      const item = { resourceId: 'new-item' }
      wrapper.vm.setSelectedTemplate(item, true)
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual([item])
    })

    it('emits input without the item when value is false', () => {
      const existing = { resourceId: 'r1' }
      const wrapper = createWrapper({ value: [existing] })
      wrapper.vm.setSelectedTemplate(existing, false)
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual([])
    })
  })

  describe('methods: handleScroll', () => {
    it('does nothing when isShowSelectedScenarios is true', async () => {
      const wrapper = createWrapper()
      await wrapper.setData({ isShowSelectedScenarios: true })
      const initialPageSize = wrapper.vm.axiosPayload.pageSize
      wrapper.vm.handleScroll({
        target: { scrollTop: 100, scrollHeight: 110, offsetHeight: 10 }
      })
      expect(wrapper.vm.axiosPayload.pageSize).toBe(initialPageSize)
    })
  })
})
