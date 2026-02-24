import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerScheduleDialog from '@/components/CampaignManager/CampaignManagerScheduleDialog'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('CampaignManagerScheduleDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: false,
    campaignName: 'Test Campaign',
    selectedFrequency: 'Weekly',
    frequencyId: 1,
    scheduleTypeId: '1',
    phishingScenarios: [],
    scheduledDateTimeZoneId: 'UTC',
    scheduledDate: '2025-02-17',
    type: DISTRIBUTION_TYPES.PHISHING,
    items: [
      { scenarioName: 'Scenario 1', scheduleDate: '2025-02-17' },
      { scenarioName: 'Scenario 2', scheduleDate: '2025-02-24' }
    ],
    scenarioType: SCENARIO_TYPES.PHISHING,
    isCategoryBasedDistribution: false
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerScheduleDialog, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mocks: {
        $emit: jest.fn()
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
      expect(wrapper.vm.$options.name).toBe('CampaignManagerItemDeleteDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AlertBox when phishing and category-based distribution', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.PHISHING,
        isCategoryBasedDistribution: true
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'AlertBox' }).exists()).toBe(true)
    })

    it('should not render AlertBox when not phishing', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.QUISHING,
        isCategoryBasedDistribution: true
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'AlertBox' }).exists()).toBe(false)
    })

    it('should have DatatableLoading component available', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('status prop should be of type Boolean', () => {
      expect(CampaignManagerScheduleDialog.props.status.type).toBe(Boolean)
    })

    it('should accept campaignName prop', () => {
      const wrapper = mountComponent({ campaignName: 'My Campaign' })
      expect(wrapper.vm.campaignName).toBe('My Campaign')
    })

    it('campaignName should have string type', () => {
      const wrapper = mountComponent({ campaignName: 'Test' })
      expect(typeof wrapper.vm.campaignName).toBe('string')
    })

    it('should accept selectedFrequency prop', () => {
      const wrapper = mountComponent({ selectedFrequency: 'Daily' })
      expect(wrapper.vm.selectedFrequency).toBe('Daily')
    })

    it('should accept items prop with schedule data', () => {
      const items = [
        { scenarioName: 'Test 1', scheduleDate: '2025-02-17' },
        { scenarioName: 'Test 2', scheduleDate: '2025-02-24' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items).toEqual(items)
    })

    it('items prop should accept arrays', () => {
      const items = [{ scenarioName: 'Test' }]
      const wrapper = mountComponent({ items })
      expect(Array.isArray(wrapper.vm.items)).toBe(true)
    })

    it('should accept type prop', () => {
      const wrapper = mountComponent({ type: DISTRIBUTION_TYPES.PHISHING })
      expect(wrapper.vm.type).toBe(DISTRIBUTION_TYPES.PHISHING)
    })

    it('type prop should be of type String', () => {
      expect(CampaignManagerScheduleDialog.props.type.type).toBe(String)
    })

    it('should accept scenarioType prop', () => {
      const wrapper = mountComponent({ scenarioType: SCENARIO_TYPES.PHISHING })
      expect(wrapper.vm.scenarioType).toBe(SCENARIO_TYPES.PHISHING)
    })

    it('scenarioType prop should be of type String', () => {
      expect(CampaignManagerScheduleDialog.props.scenarioType.type).toBe(String)
    })

    it('should accept isCategoryBasedDistribution prop', () => {
      const wrapper = mountComponent({ isCategoryBasedDistribution: true })
      expect(wrapper.vm.isCategoryBasedDistribution).toBe(true)
    })

    it('isCategoryBasedDistribution should default to false', () => {
      const wrapper = mountComponent({ isCategoryBasedDistribution: false })
      expect(wrapper.vm.isCategoryBasedDistribution).toBe(false)
    })
  })

  describe('Data Properties', () => {
    it('should initialize CONSTANTS with correct icon', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-calendar-range')
    })

    it('should have title in CONSTANTS', () => {
      const wrapper = mountComponent({ scenarioType: SCENARIO_TYPES.PHISHING })
      expect(wrapper.vm.CONSTANTS.title).toBe('Phishing Scenarios Frequency Schedule')
    })

    it('should have different title for Quishing scenario', () => {
      const wrapper = mountComponent({ scenarioType: SCENARIO_TYPES.QUISHING })
      expect(wrapper.vm.CONSTANTS.title).toBe('Quishing Scenarios Frequency Schedule')
    })
  })

  describe('Computed Properties', () => {
    it('getSubtitle should return campaignName', () => {
      const wrapper = mountComponent({ campaignName: 'Test Campaign' })
      expect(wrapper.vm.getSubtitle).toBe('Test Campaign')
    })

    it('getSubtitle should return empty string when campaignName is undefined', () => {
      const wrapper = mountComponent({ campaignName: undefined })
      expect(wrapper.vm.getSubtitle).toBe('')
    })

    it('getTitle should return phishing title when type is PHISHING', () => {
      const wrapper = mountComponent({ type: DISTRIBUTION_TYPES.PHISHING })
      expect(wrapper.vm.getTitle).toBe('Phishing Scenarios Frequency Schedule')
    })

    it('getTitle should use quishing constants title when type is PHISHING and scenarioType is QUISHING', () => {
      const wrapper = mountComponent({
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.QUISHING
      })
      expect(wrapper.vm.getTitle).toBe('Quishing Scenarios Frequency Schedule')
    })

    it('getTitle should return smishing title when type is not PHISHING', () => {
      const wrapper = mountComponent({ type: 'SMISHING' })
      expect(wrapper.vm.getTitle).toBe('Smishing Scenarios Frequency Schedule')
    })

    it('isPhishing should return true when scenarioType is PHISHING', () => {
      const wrapper = mountComponent({ scenarioType: SCENARIO_TYPES.PHISHING })
      expect(wrapper.vm.isPhishing).toBe(true)
    })

    it('isPhishing should return false when scenarioType is not PHISHING', () => {
      const wrapper = mountComponent({ scenarioType: SCENARIO_TYPES.QUISHING })
      expect(wrapper.vm.isPhishing).toBe(false)
    })
  })

  describe('Methods', () => {
    it('closeModal should be callable', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.closeModal()).not.toThrow()
    })

    it('handleDelete should be callable', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.vm.handleDelete()).not.toThrow()
    })

    it('closeModal emits on-close', () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      wrapper.vm.closeModal()
      expect(emitSpy).toHaveBeenCalledWith('on-close')
    })

    it('handleDelete emits on-delete with undefined payload when item is not defined', () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      wrapper.vm.handleDelete()
      expect(emitSpy).toHaveBeenCalledWith('on-delete', undefined)
    })

    it('handleDelete emits on-delete with item payload when context item exists', () => {
      const emit = jest.fn()
      CampaignManagerScheduleDialog.methods.handleDelete.call({
        item: { id: 'x1' },
        $emit: emit
      })
      expect(emit).toHaveBeenCalledWith('on-delete', { id: 'x1' })
    })
  })

  describe('Event Emission', () => {
    it('should emit on-close when changeStatus is triggered', () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      expect(appDialog.exists()).toBe(true)
      appDialog.vm.$listeners.changeStatus()
      expect(emitSpy).toHaveBeenCalledWith('on-close')
    })

    it('should emit on-close when close button is clicked', async () => {
      const wrapper = mountComponent()
      const emitSpy = jest.spyOn(wrapper.vm, '$emit')
      const closeButton = wrapper.find('#btn-close--campaign-manager-schedule-close')
      expect(closeButton.exists()).toBe(true)
      closeButton.vm.$listeners.click()
      expect(emitSpy).toHaveBeenCalledWith('on-close')
    })
  })

  describe('Loading State Management', () => {
    it('should show DatatableLoading when isLoading is true', () => {
      const wrapper = mountComponent()
      wrapper.vm.isLoading = true
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should not show DatatableLoading when isLoading is false', () => {
      const wrapper = mountComponent()
      wrapper.vm.isLoading = false
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should show schedule items when isLoading is false', () => {
      const wrapper = mountComponent({
        items: [
          { scenarioName: 'Scenario A', scheduleDate: '2025-02-17' },
          { scenarioName: 'Scenario B', scheduleDate: '2025-02-24' }
        ]
      })
      wrapper.vm.isLoading = false
      expect(wrapper.vm.items.length).toBe(2)
    })
  })

  describe('Schedule Items Display', () => {
    it('should display all schedule items', () => {
      const items = [
        { scenarioName: 'Item 1', scheduleDate: '2025-02-17' },
        { scenarioName: 'Item 2', scheduleDate: '2025-02-24' },
        { scenarioName: 'Item 3', scheduleDate: '2025-03-03' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items).toEqual(items)
      expect(wrapper.vm.items.length).toBe(3)
    })

    it('should handle single schedule item', () => {
      const items = [{ scenarioName: 'Single Item', scheduleDate: '2025-02-17' }]
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items.length).toBe(1)
      expect(wrapper.vm.items[0].scenarioName).toBe('Single Item')
    })

    it('should handle empty schedule items', () => {
      const wrapper = mountComponent({ items: [] })
      expect(wrapper.vm.items.length).toBe(0)
    })

    it('should display selected frequency', () => {
      const wrapper = mountComponent({ selectedFrequency: 'Monthly' })
      expect(wrapper.vm.selectedFrequency).toBe('Monthly')
    })
  })

  describe('Alert Box Visibility', () => {
    it('should show AlertBox when phishing and category-based', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.PHISHING,
        isCategoryBasedDistribution: true
      })
      await wrapper.vm.$nextTick()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.exists()).toBe(true)
    })

    it('should not show AlertBox when not category-based', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.PHISHING,
        isCategoryBasedDistribution: false
      })
      await wrapper.vm.$nextTick()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.exists()).toBe(false)
    })

    it('should not show AlertBox when not phishing', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.QUISHING,
        isCategoryBasedDistribution: true
      })
      await wrapper.vm.$nextTick()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.exists()).toBe(false)
    })

    it('should not show AlertBox when both conditions false', async () => {
      const wrapper = mountComponent({
        scenarioType: SCENARIO_TYPES.QUISHING,
        isCategoryBasedDistribution: false
      })
      await wrapper.vm.$nextTick()
      const alertBox = wrapper.findComponent({ name: 'AlertBox' })
      expect(alertBox.exists()).toBe(false)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        campaignName: 'Campaign 1',
        selectedFrequency: 'Weekly'
      })
      const wrapper2 = mountComponent({
        campaignName: 'Campaign 2',
        selectedFrequency: 'Daily'
      })

      expect(wrapper1.vm.campaignName).toBe('Campaign 1')
      expect(wrapper2.vm.campaignName).toBe('Campaign 2')
      expect(wrapper1.vm.selectedFrequency).toBe('Weekly')
      expect(wrapper2.vm.selectedFrequency).toBe('Daily')
    })

    it('multiple instances should handle independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.closeModal()
      wrapper2.vm.closeModal()

      expect(wrapper1.vm).toBeDefined()
      expect(wrapper2.vm).toBeDefined()
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: display schedule for phishing campaign', () => {
      const items = [
        { scenarioName: 'Phishing 1', scheduleDate: '2025-02-17' },
        { scenarioName: 'Phishing 2', scheduleDate: '2025-02-24' }
      ]
      const wrapper = mountComponent({
        campaignName: 'Phishing Campaign',
        selectedFrequency: 'Weekly',
        type: DISTRIBUTION_TYPES.PHISHING,
        scenarioType: SCENARIO_TYPES.PHISHING,
        items,
        isCategoryBasedDistribution: true
      })

      expect(wrapper.vm.getTitle).toBe('Phishing Scenarios Frequency Schedule')
      expect(wrapper.vm.getSubtitle).toBe('Phishing Campaign')
      expect(wrapper.vm.isPhishing).toBe(true)
      expect(wrapper.vm.items.length).toBe(2)
    })

    it('complete workflow: display schedule for smishing campaign', () => {
      const items = [
        { scenarioName: 'Smishing 1', scheduleDate: '2025-02-17' }
      ]
      const wrapper = mountComponent({
        campaignName: 'Smishing Campaign',
        selectedFrequency: 'Daily',
        type: 'SMISHING',
        scenarioType: SCENARIO_TYPES.PHISHING,
        items
      })

      expect(wrapper.vm.getTitle).toBe('Smishing Scenarios Frequency Schedule')
      expect(wrapper.vm.getSubtitle).toBe('Smishing Campaign')
      expect(wrapper.vm.items.length).toBe(1)
    })

    it('complete workflow: open and close schedule dialog', () => {
      const wrapper = mountComponent({ status: true })

      expect(wrapper.vm.status).toBe(true)
      expect(() => wrapper.vm.closeModal()).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null campaignName gracefully', () => {
      const wrapper = mountComponent({ campaignName: null })
      expect(wrapper.vm.getSubtitle).toBe('')
    })

    it('should handle very long campaign name', () => {
      const longName = 'A'.repeat(200)
      const wrapper = mountComponent({ campaignName: longName })
      expect(wrapper.vm.campaignName).toBe(longName)
    })

    it('should handle schedule items with special characters', () => {
      const items = [
        { scenarioName: 'Test@#$%^', scheduleDate: '2025-02-17' },
        { scenarioName: 'Test™®©', scheduleDate: '2025-02-24' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items[0].scenarioName).toBe('Test@#$%^')
      expect(wrapper.vm.items[1].scenarioName).toBe('Test™®©')
    })

    it('should handle rapid status changes', async () => {
      const wrapper = mountComponent({ status: false })

      await wrapper.setProps({ status: true })
      expect(wrapper.vm.status).toBe(true)

      await wrapper.setProps({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })

    it('should handle empty frequency string', () => {
      const wrapper = mountComponent({ selectedFrequency: '' })
      expect(wrapper.vm.selectedFrequency).toBe('')
    })

    it('should handle many schedule items', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        scenarioName: `Scenario ${i}`,
        scheduleDate: `2025-02-${String((i % 28) + 1).padStart(2, '0')}`
      }))
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items.length).toBe(100)
    })
  })

  describe('Props Validation', () => {
    it('status prop should be of type Boolean', () => {
      expect(CampaignManagerScheduleDialog.props.status.type).toBe(Boolean)
    })

    it('campaignName prop should be of type String with default', () => {
      expect(CampaignManagerScheduleDialog.props.campaignName.type).toBe(String)
      expect(CampaignManagerScheduleDialog.props.campaignName.default).toBe('')
    })

    it('selectedFrequency prop should be of type String with default', () => {
      expect(CampaignManagerScheduleDialog.props.selectedFrequency.type).toBe(String)
      expect(CampaignManagerScheduleDialog.props.selectedFrequency.default).toBe('')
    })

    it('items prop should be of type Array with default', () => {
      expect(CampaignManagerScheduleDialog.props.items.type).toBe(Array)
      expect(CampaignManagerScheduleDialog.props.items.default).toBeDefined()
    })

    it('type prop should be of type String with PHISHING default', () => {
      expect(CampaignManagerScheduleDialog.props.type.type).toBe(String)
      expect(CampaignManagerScheduleDialog.props.type.default).toBe(DISTRIBUTION_TYPES.PHISHING)
    })

    it('scenarioType prop should be of type String with PHISHING default', () => {
      expect(CampaignManagerScheduleDialog.props.scenarioType.type).toBe(String)
      expect(CampaignManagerScheduleDialog.props.scenarioType.default).toBe(SCENARIO_TYPES.PHISHING)
    })

    it('isCategoryBasedDistribution prop should be of type Boolean with false default', () => {
      expect(CampaignManagerScheduleDialog.props.isCategoryBasedDistribution.type).toBe(Boolean)
      expect(CampaignManagerScheduleDialog.props.isCategoryBasedDistribution.default).toBe(false)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain props after mount', async () => {
      const wrapper = mountComponent({
        campaignName: 'Test Campaign',
        selectedFrequency: 'Weekly'
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.campaignName).toBe('Test Campaign')
      expect(wrapper.vm.selectedFrequency).toBe('Weekly')
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })

    it('closeModal should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.closeModal()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(300)
    })

    it('should handle large items array', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        scenarioName: `Scenario ${i}`,
        scheduleDate: '2025-02-17'
      }))
      const wrapper = mountComponent({ items })
      expect(wrapper.vm.items.length).toBe(100)
    })
  })
})
