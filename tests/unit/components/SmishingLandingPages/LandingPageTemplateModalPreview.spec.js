import { shallowMount } from '@vue/test-utils'
import LandingPageTemplateModalPreview from '@/components/SmishingLandingPages/LandingPageTemplateModalPreview.vue'

describe('SmishingLandingPages LandingPageTemplateModalPreview.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(LandingPageTemplateModalPreview, {
      propsData: {
        templateName: 'Test Template',
        landingPageTemplates: [],
        phishingUrl: 'https://example.com',
        ...propsData
      },
      stubs: { KEmailPreview: true }
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

  describe('hasNextTemplate', () => {
    it('returns false when at last template', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }]
      })
      expect(wrapper.vm.hasNextTemplate).toBe(false)
    })

    it('returns true when more templates exist', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
      expect(wrapper.vm.hasNextTemplate).toBe(true)
    })
  })

  describe('hasPreviousTemplate', () => {
    it('returns false when at index 0', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }]
      })
      expect(wrapper.vm.hasPreviousTemplate).toBe(false)
    })

    it('returns true when index > 0', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
      wrapper.vm.selectedLandingPageIndex = 1
      expect(wrapper.vm.hasPreviousTemplate).toBe(true)
    })
  })

  describe('handlePreviousTemplate', () => {
    it('decrements selectedLandingPageIndex', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
      wrapper.vm.selectedLandingPageIndex = 1
      wrapper.vm.handlePreviousTemplate()
      expect(wrapper.vm.selectedLandingPageIndex).toBe(0)
    })
  })

  describe('handleNextTemplate', () => {
    it('increments selectedLandingPageIndex', () => {
      const wrapper = createWrapper({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
      wrapper.vm.handleNextTemplate()
      expect(wrapper.vm.selectedLandingPageIndex).toBe(1)
    })
  })
})
