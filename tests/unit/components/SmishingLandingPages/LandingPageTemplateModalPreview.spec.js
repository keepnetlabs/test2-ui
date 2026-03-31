import { shallowMount } from '@vue/test-utils'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview.vue'

describe('SmishingLandingPages uses LandingPage/LandingPageTemplateModalPreview', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(LandingPageTemplateModalPreview, {
      propsData: {
        templateName: 'Test Template',
        landingPageTemplates: [],
        phishingUrl: 'https://example.com',
        ...propsData
      },
      stubs: { KEmailPreview: true, BrowserToolbar: true, InputLanguagePreview: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('hasLandingPageTemplate', () => {
    it('returns false when landingPageTemplates is empty', () => {
      const wrapper = createWrapper({ landingPageTemplates: [] })
      expect(wrapper.vm.hasLandingPageTemplate).toBe(false)
    })

    it('returns true when landingPageTemplates has items', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: '<p>test</p>' }]
      })
      expect(wrapper.vm.hasLandingPageTemplate).toBe(true)
    })
  })

  describe('getCurrentLandingPageTemplate', () => {
    it('returns content at selectedLandingPageIndex', () => {
      const templates = [{ content: 'page1' }, { content: 'page2' }]
      const wrapper = createWrapper({ landingPageTemplates: templates })
      expect(wrapper.vm.getCurrentLandingPageTemplate).toBe('page1')
      wrapper.vm.selectedLandingPageIndex = 1
      expect(wrapper.vm.getCurrentLandingPageTemplate).toBe('page2')
    })
  })
})
