import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportGroupsColumn from '@/components/CampaignManagerReport/CampaignManagerReportGroupsColumn'

describe('CampaignManagerReportGroupsColumn.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportGroupsColumn, {
      localVue,
      propsData: { value: '', ...propsData },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportGroupsColumn')
    })

    it('should render span element', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept value prop as string', () => {
      const wrapper = mountComponent({ value: 'group1,group2' })
      expect(wrapper.vm.value).toBe('group1,group2')
    })

    it('should accept value prop as array', () => {
      const wrapper = mountComponent({ value: ['group1', 'group2'] })
      expect(wrapper.vm.value).toEqual(['group1', 'group2'])
    })

    it('should have default value empty string', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.value).toBe('')
    })
  })

  describe('Computed Properties', () => {
    it('should have groups computed property', () => {
      const wrapper = mountComponent({ value: 'group1,group2,group3' })
      expect(Array.isArray(wrapper.vm.groups)).toBe(true)
    })

    it('should parse comma-separated groups from string', () => {
      const wrapper = mountComponent({ value: 'group1,group2' })
      expect(wrapper.vm.groups).toEqual(['group1', 'group2'])
    })

    it('should handle groups array directly', () => {
      const wrapper = mountComponent({ value: ['group1', 'group2'] })
      expect(wrapper.vm.groups).toEqual(['group1', 'group2'])
    })

    it('should trim whitespace from groups', () => {
      const wrapper = mountComponent({ value: ' group1 , group2 ' })
      expect(wrapper.vm.groups).toEqual(['group1', 'group2'])
    })

    it('should filter out empty groups', () => {
      const wrapper = mountComponent({ value: 'group1,,group2,' })
      expect(wrapper.vm.groups).toEqual(['group1', 'group2'])
    })

    it('should have count computed property', () => {
      const wrapper = mountComponent({ value: 'group1,group2,group3' })
      expect(wrapper.vm.count).toBe(3)
    })

    it('should count zero for empty value', () => {
      const wrapper = mountComponent({ value: '' })
      expect(wrapper.vm.count).toBe(0)
    })

    it('should have label computed property', () => {
      const wrapper = mountComponent({ value: 'group1' })
      expect(typeof wrapper.vm.label).toBe('string')
    })

    it('should display dash for no groups', () => {
      const wrapper = mountComponent({ value: '' })
      expect(wrapper.vm.label).toBe('-')
    })

    it('should display "1 group" for single group', () => {
      const wrapper = mountComponent({ value: 'group1' })
      expect(wrapper.vm.label).toBe('1 group')
    })

    it('should display "X groups" for multiple groups', () => {
      const wrapper = mountComponent({ value: 'group1,group2,group3' })
      expect(wrapper.vm.label).toBe('3 groups')
    })

    it('should have labelStyle computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.labelStyle).toBe('object')
    })

    it('should have cursor pointer when count > 0', () => {
      const wrapper = mountComponent({ value: 'group1' })
      expect(wrapper.vm.labelStyle.cursor).toBe('pointer')
    })

    it('should not have cursor pointer when count = 0', () => {
      const wrapper = mountComponent({ value: '' })
      expect(wrapper.vm.labelStyle.cursor).toBeUndefined()
    })
  })

  describe('Methods', () => {
    it('should have handleClick method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClick).toBe('function')
    })
  })

  describe('Event Emissions', () => {
    it('should emit click event with groups when clicked', async () => {
      const wrapper = mountComponent({ value: 'group1,group2' })
      await wrapper.vm.handleClick()
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')[0][0]).toEqual(['group1', 'group2'])
    })

    it('should not emit click event when no groups', async () => {
      const wrapper = mountComponent({ value: '' })
      await wrapper.vm.handleClick()
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Label Display', () => {
    it('should display correct label for 1 group', () => {
      const wrapper = mountComponent({ value: 'admin' })
      expect(wrapper.text()).toContain('1 group')
    })

    it('should display correct label for multiple groups', () => {
      const wrapper = mountComponent({ value: 'admin,user,developer' })
      expect(wrapper.text()).toContain('3 groups')
    })

    it('should display dash for empty groups', () => {
      const wrapper = mountComponent({ value: '' })
      expect(wrapper.text()).toBe('-')
    })
  })

  describe('Style Application', () => {
    it('should have blue color', () => {
      const wrapper = mountComponent({ value: 'group1' })
      expect(wrapper.vm.labelStyle.color).toBe('#2196F3')
    })

    it('should have correct font size', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labelStyle.fontSize).toBe('12px')
    })

    it('should have correct font weight', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.labelStyle.fontWeight).toBe(600)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent column instances', () => {
      const wrapper1 = mountComponent({ value: 'admin,user' })
      const wrapper2 = mountComponent({ value: 'group1,group2,group3' })

      expect(wrapper1.vm.count).toBe(2)
      expect(wrapper2.vm.count).toBe(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null value', () => {
      const wrapper = mountComponent({ value: null })
      expect(wrapper.vm.groups.length).toBe(0)
    })

    it('should handle single group without comma', () => {
      const wrapper = mountComponent({ value: 'admin' })
      expect(wrapper.vm.groups).toEqual(['admin'])
    })

    it('should handle groups with special characters', () => {
      const wrapper = mountComponent({ value: 'group-1,group_2' })
      expect(wrapper.vm.groups).toEqual(['group-1', 'group_2'])
    })

    it('should handle array with empty strings', () => {
      const wrapper = mountComponent({ value: ['group1', '', 'group2'] })
      expect(wrapper.vm.groups).toEqual(['group1', 'group2'])
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render and emit groups', async () => {
      const wrapper = mountComponent({ value: 'admin,user,developer' })

      expect(wrapper.vm.count).toBe(3)
      expect(wrapper.vm.label).toBe('3 groups')
      expect(wrapper.text()).toContain('3 groups')

      await wrapper.vm.handleClick()
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent({ value: 'group1,group2,group3' })
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})
