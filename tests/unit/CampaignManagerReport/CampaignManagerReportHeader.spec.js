import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'

describe('CampaignManagerReportHeader.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportHeader, {
      localVue,
      propsData: { title: 'Campaign Report', subtitle: 'Q1 2025', ...propsData },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportHeader')
    })

    it('should render main container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-header-container').exists()).toBe(true)
    })

    it('should render title div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-header__title').exists()).toBe(true)
    })

    it('should render subtitle div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-summary-header__subtitle').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept title prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.title).toBe('Campaign Report')
    })

    it('should accept subtitle prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.subtitle).toBe('Q1 2025')
    })

    it('should accept empty title', () => {
      const wrapper = mountComponent({ title: '' })
      expect(wrapper.vm.title).toBe('')
    })

    it('should accept undefined title', () => {
      const wrapper = mountComponent({ title: undefined })
      expect(wrapper.vm.title).toBeUndefined()
    })
  })

  describe('Title Display', () => {
    it('should display title text', () => {
      const wrapper = mountComponent({ title: 'Test Title' })
      expect(wrapper.text()).toContain('Test Title')
    })

    it('should display different titles', () => {
      const wrapper = mountComponent({ title: 'Custom Campaign Report' })
      expect(wrapper.text()).toContain('Custom Campaign Report')
    })

    it('should handle long title text', () => {
      const longTitle = 'This is a very long campaign report title that should still display correctly'
      const wrapper = mountComponent({ title: longTitle })
      expect(wrapper.text()).toContain('This is a very long campaign')
    })

    it('should handle special characters in title', () => {
      const wrapper = mountComponent({ title: 'Campaign 2025 - Q1 & Q2' })
      expect(wrapper.text()).toContain('Campaign 2025')
    })
  })

  describe('Subtitle Display', () => {
    it('should display subtitle text', () => {
      const wrapper = mountComponent({ subtitle: 'Test Subtitle' })
      expect(wrapper.text()).toContain('Test Subtitle')
    })

    it('should display different subtitles', () => {
      const wrapper = mountComponent({ subtitle: 'Custom Period' })
      expect(wrapper.text()).toContain('Custom Period')
    })

    it('should handle date-based subtitles', () => {
      const wrapper = mountComponent({ subtitle: 'January 1 - March 31, 2025' })
      expect(wrapper.text()).toContain('January 1')
    })

    it('should handle empty subtitle', () => {
      const wrapper = mountComponent({ subtitle: '' })
      expect(wrapper.vm.subtitle).toBe('')
    })
  })

  describe('Title and Subtitle Together', () => {
    it('should display both title and subtitle', () => {
      const wrapper = mountComponent({
        title: 'Phishing Campaign Report',
        subtitle: 'January 2025'
      })
      expect(wrapper.text()).toContain('Phishing Campaign Report')
      expect(wrapper.text()).toContain('January 2025')
    })

    it('should maintain correct order', () => {
      const wrapper = mountComponent({
        title: 'Title',
        subtitle: 'Subtitle'
      })
      const titleIndex = wrapper.text().indexOf('Title')
      const subtitleIndex = wrapper.text().indexOf('Subtitle')
      expect(titleIndex).toBeLessThan(subtitleIndex)
    })
  })

  describe('CSS Classes', () => {
    it('should have correct title class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-header__title').exists()).toBe(true)
    })

    it('should have correct subtitle class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-summary-header__subtitle').exists()).toBe(true)
    })

    it('should have correct container class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.campaign-manager-report-header-container').exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent header instances', () => {
      const wrapper1 = mountComponent({
        title: 'Report 1',
        subtitle: 'Q1'
      })
      const wrapper2 = mountComponent({
        title: 'Report 2',
        subtitle: 'Q2'
      })

      expect(wrapper1.text()).toContain('Report 1')
      expect(wrapper2.text()).toContain('Report 2')
    })
  })

  describe('Dynamic Content Updates', () => {
    it('should update title when prop changes', async () => {
      const wrapper = mountComponent({ title: 'Original Title' })
      expect(wrapper.text()).toContain('Original Title')

      await wrapper.setProps({ title: 'Updated Title' })
      expect(wrapper.text()).toContain('Updated Title')
    })

    it('should update subtitle when prop changes', async () => {
      const wrapper = mountComponent({ subtitle: 'Original Subtitle' })
      expect(wrapper.text()).toContain('Original Subtitle')

      await wrapper.setProps({ subtitle: 'Updated Subtitle' })
      expect(wrapper.text()).toContain('Updated Subtitle')
    })

    it('should update both props simultaneously', async () => {
      const wrapper = mountComponent()

      await wrapper.setProps({
        title: 'New Title',
        subtitle: 'New Subtitle'
      })

      expect(wrapper.text()).toContain('New Title')
      expect(wrapper.text()).toContain('New Subtitle')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null title', () => {
      const wrapper = mountComponent({ title: null })
      expect(wrapper.vm.title).toBeNull()
    })

    it('should handle null subtitle', () => {
      const wrapper = mountComponent({ subtitle: null })
      expect(wrapper.vm.subtitle).toBeNull()
    })

    it('should handle numeric title', () => {
      const wrapper = mountComponent({ title: '2025' })
      expect(wrapper.text()).toContain('2025')
    })

    it('should handle title with numbers and letters', () => {
      const wrapper = mountComponent({ title: 'Q1 2025 Campaign Report' })
      expect(wrapper.text()).toContain('Q1 2025')
    })
  })

  describe('Content Structure', () => {
    it('should have proper div nesting', () => {
      const wrapper = mountComponent()
      const container = wrapper.find('.campaign-manager-report-header-container')
      expect(container.exists()).toBe(true)
      expect(container.find('.campaign-manager-report-header__title').exists()).toBe(true)
    })

    it('should render text nodes correctly', () => {
      const wrapper = mountComponent({
        title: 'Test Title',
        subtitle: 'Test Subtitle'
      })
      expect(wrapper.vm.$el.textContent).toContain('Test Title')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render header with campaign data', () => {
      const wrapper = mountComponent({
        title: 'Phishing Campaign Report',
        subtitle: 'January 1 - March 31, 2025'
      })

      expect(wrapper.find('.campaign-manager-report-header-container').exists()).toBe(true)
      expect(wrapper.text()).toContain('Phishing Campaign Report')
      expect(wrapper.text()).toContain('January 1')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
