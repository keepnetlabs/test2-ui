import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportActivityColumn from '@/components/CampaignManagerReport/CampaignManagerReportActivityColumn'
import { ACTIVITY_TYPES } from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerReportActivityColumn.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    scope: {
      row: {
        activityType: ACTIVITY_TYPES.HUMAN,
        isChangedActivity: false
      }
    },
    tooltipText: 'Bot activities are displayed in the details list'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportActivityColumn, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: {
        VIcon: true,
        VTooltip: true
      },
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportActivityColumn')
    })

    it('should render activity type text', () => {
      const wrapper = mountComponent()
      expect(wrapper.text()).toContain('Human Activity')
    })

    it('should render span wrapper', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept scope prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.scope).toBeDefined()
    })

    it('should accept tooltipText prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.tooltipText).toBeDefined()
    })

    it('should have default tooltipText', () => {
      const wrapper = mountComponent({ tooltipText: undefined })
      expect(wrapper.vm.tooltipText).toBe('Bot activities are displayed in the details list')
    })
  })

  describe('Computed Properties', () => {
    it('should have isRenderTooltip computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isRenderTooltip).toBe('boolean')
    })

    it('should render tooltip for BOT activity type', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, isChangedActivity: false } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should render tooltip for changed human activity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true } }
      })
      expect(wrapper.vm.isRenderTooltip).toBe(true)
    })

    it('should have isChangedActivityAndActivityHuman computed property', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.isChangedActivityAndActivityHuman).toBe('boolean')
    })
  })

  describe('Methods', () => {
    it('should have getActivityTooltipText method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getActivityTooltipText).toBe('function')
    })

    it('should return default tooltip text for BOT without sandBoxType', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: undefined } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot activities are displayed in the details list')
    })

    it('should return text for changed human activity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot activity has been changed to human activity')
    })

    it('should return A1 rules text for sandBoxType 1', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 1 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A1')
    })

    it('should return A1 rules text for sandBoxType 2', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 2 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A1')
    })

    it('should return A4.2 rules text for sandBoxType >= 32', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 32 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A4.2')
    })

    it('should return A4.2 rules text for sandBoxType > 32', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 50 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A4.2')
    })

    it('should return A4.1 rules text for sandBoxType 16-31', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 16 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A4.1')
    })

    it('should return A3 rules text for sandBoxType 8-15', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 8 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A3')
    })

    it('should return A2 rules text as default fallback', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 0 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A2')
    })
  })

  describe('Tooltip Rendering', () => {
    it('should render VTooltip for BOT activity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(true)
    })

    it('should not render VTooltip for normal human activity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })

    it('should render tooltip with bottom alignment', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT } }
      })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.attributes('bottom')).toBe('true')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent column instances', () => {
      const wrapper1 = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT } }
      })
      const wrapper2 = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN } }
      })

      expect(wrapper1.vm.scope.row.activityType).toBe(ACTIVITY_TYPES.BOT)
      expect(wrapper2.vm.scope.row.activityType).toBe(ACTIVITY_TYPES.HUMAN)
    })
  })

  describe('Edge Cases', () => {
    it('should handle different sandBoxType values', () => {
      const wrapper1 = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 0 } }
      })
      expect(wrapper1.vm.getActivityTooltipText()).toBe('Bot Activity Rules: A2')

      const wrapper2 = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 4 } }
      })
      expect(wrapper2.vm.getActivityTooltipText()).toBe('Bot Activity Rules: A2')
    })

    it('should handle sandBoxType edge values', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 15 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A3')
    })

    it('should handle high sandBoxType values', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 100 } }
      })
      const text = wrapper.vm.getActivityTooltipText()
      expect(text).toBe('Bot Activity Rules: A4.2')
    })

    it('should handle false isChangedActivity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false } }
      })
      expect(wrapper.vm.isChangedActivityAndActivityHuman).toBe(false)
    })
  })

  describe('Icon Rendering', () => {
    it('should render tooltip when bot activity detected', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT } }
      })
      const tooltip = wrapper.findComponent({ name: 'VTooltip' })
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.attributes('bottom')).toBe('true')
    })

    it('should not render tooltip for normal human activity without change', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: false } }
      })
      expect(wrapper.findComponent({ name: 'VTooltip' }).exists()).toBe(false)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render bot activity with sandbox rules', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.BOT, sandBoxType: 16, isChangedActivity: false } },
        tooltipText: 'Custom tooltip text'
      })

      expect(wrapper.vm.scope.row.activityType).toBe(ACTIVITY_TYPES.BOT)
      expect(wrapper.vm.isRenderTooltip).toBe(true)
      expect(wrapper.vm.getActivityTooltipText()).toBe('Bot Activity Rules: A4.1')
    })

    it('complete workflow: render changed human activity', () => {
      const wrapper = mountComponent({
        scope: { row: { activityType: ACTIVITY_TYPES.HUMAN, isChangedActivity: true } }
      })

      expect(wrapper.vm.isChangedActivityAndActivityHuman).toBe(true)
      expect(wrapper.vm.getActivityTooltipText()).toBe('Bot activity has been changed to human activity')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
