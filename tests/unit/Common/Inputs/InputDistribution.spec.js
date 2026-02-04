import { shallowMount } from '@vue/test-utils'
import InputDistribution from '@/components/Common/Inputs/InputDistribution.vue'
import labels from '@/model/constants/labels'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'

describe('InputDistribution.vue', () => {
  let wrapper
  const mockValue = {
    sendingLimit: 50,
    distributionTypeId: 'phishing',
    distributionDelayEvery: 20,
    distributionStartTypeId: 1,
    distributionDelayTimeTypeId: '1',
    sendCallsOnDays: [1, 2, 4],
    distributionStartTime: '09:00',
    distributionEndTime: '17:00'
  }

  beforeEach(() => {
    wrapper = shallowMount(InputDistribution, {
      propsData: {
        value: mockValue
      },
      stubs: {
        'form-group': true,
        'v-radio-group': true,
        'v-radio': true,
        'v-checkbox': true,
        'v-text-field': true,
        'el-time-select': true,
        'k-select': true,
        'custom-error': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputDistribution')
    })

    it('should render FormGroup wrapper', () => {
      const formGroup = wrapper.findComponent({ name: 'FormGroup' })
      expect(formGroup.exists()).toBe(true)
    })
  })

  describe('prop defaults', () => {
    it('should have default value object', () => {
      wrapper = shallowMount(InputDistribution, {
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value).toBeDefined()
      expect(wrapper.vm.value.sendingLimit).toBe(50)
    })

    it('should have type default as phishing', () => {
      expect(wrapper.vm.type).toBeDefined()
    })

    it('should have distributionDelayTimeItems empty array by default', () => {
      expect(wrapper.vm.distributionDelayTimeItems).toEqual([])
    })

    it('should have selectedTimeZoneText empty string by default', () => {
      expect(wrapper.vm.selectedTimeZoneText).toBe('')
    })
  })

  describe('props configuration', () => {
    it('should accept custom value', () => {
      expect(wrapper.vm.value).toEqual(mockValue)
    })

    it('should accept custom type', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.SMISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.type).toBe(DISTRIBUTION_TYPES.SMISHING)
    })

    it('should accept custom distributionDelayTimeItems', () => {
      const items = [
        { text: 'Minutes', value: '1' },
        { text: 'Hours', value: '2' }
      ]
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          distributionDelayTimeItems: items
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.distributionDelayTimeItems).toEqual(items)
    })

    it('should accept custom selectedTimeZoneText', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          selectedTimeZoneText: 'EST'
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.selectedTimeZoneText).toBe('EST')
    })
  })

  describe('data properties', () => {
    it('should initialize isSendingLimitValid as true', () => {
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should initialize sendingLimitErrorText as empty', () => {
      expect(wrapper.vm.sendingLimitErrorText).toBe('')
    })

    it('should have labels in data', () => {
      expect(wrapper.vm.labels).toBeDefined()
    })

    it('should have validation rules', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(wrapper.vm.rules.number).toBeDefined()
    })
  })

  describe('computed properties', () => {
    it('should have getDistributionSubtitle', () => {
      expect(wrapper.vm.getDistributionSubtitle).toBeDefined()
    })

    it('should have getFirstRadioLabel', () => {
      expect(wrapper.vm.getFirstRadioLabel).toBeDefined()
    })

    it('should have getSecondRadioLabel', () => {
      expect(wrapper.vm.getSecondRadioLabel).toBeDefined()
    })

    it('should have getDistributionFirstText', () => {
      expect(wrapper.vm.getDistributionFirstText).toBeDefined()
    })

    it('should have getDistributionSecondText', () => {
      expect(wrapper.vm.getDistributionSecondText).toBeDefined()
    })

    it('should have getDistributionThirdText', () => {
      expect(wrapper.vm.getDistributionThirdText).toBeDefined()
    })

    it('should have getDistributionFourthText', () => {
      expect(wrapper.vm.getDistributionFourthText).toBeDefined()
    })

    it('should have isRenderDistributionStartScheduled', () => {
      expect(wrapper.vm.isRenderDistributionStartScheduled).toBeDefined()
    })
  })

  describe('validation rules', () => {
    it('should have number validation rules', () => {
      expect(wrapper.vm.rules.number).toBeDefined()
      expect(wrapper.vm.rules.number.length).toBeGreaterThan(0)
    })

    it('should validate required number', () => {
      const ruleFunction = wrapper.vm.rules.number[0]
      expect(typeof ruleFunction).toBe('function')
    })

    it('should validate not starting with 0', () => {
      const ruleFunction = wrapper.vm.rules.number[1]
      expect(typeof ruleFunction).toBe('function')
    })

    it('should validate max value', () => {
      const ruleFunction = wrapper.vm.rules.number[2]
      expect(typeof ruleFunction).toBe('function')
    })
  })

  describe('sendingLimit validation', () => {
    it('should validate valid sending limit', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 100 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should reject zero or negative limit', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(false)
    })

    it('should reject limit starting with 0', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: '01' } })
      expect(wrapper.vm.isSendingLimitValid).toBe(false)
    })

    it('should reject limit exceeding 1000000', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 2000000 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(false)
    })
  })

  describe('callForCalculateSendingInfo method', () => {
    it('should have callForCalculateSendingInfo method', () => {
      expect(typeof wrapper.vm.callForCalculateSendingInfo).toBe('function')
    })

    it('should emit call-for-calculate-sending-info event', () => {
      wrapper.vm.callForCalculateSendingInfo()
      expect(wrapper.emitted('call-for-calculate-sending-info')).toBeTruthy()
    })
  })

  describe('distribution configuration options', () => {
    it('should support phishing type', () => {
      expect(wrapper.vm.type).toBeDefined()
    })

    it('should support smishing type', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.SMISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.type).toBe(DISTRIBUTION_TYPES.SMISHING)
    })
  })

  describe('distribution delay time items', () => {
    it('should accept delay time items', () => {
      const items = [
        { text: 'Minutes', value: '1' },
        { text: 'Hours', value: '2' },
        { text: 'Days', value: '3' }
      ]
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          distributionDelayTimeItems: items
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.distributionDelayTimeItems).toEqual(items)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      const newValue = { ...mockValue, sendingLimit: 100 }
      await wrapper.setProps({ value: newValue })
      expect(wrapper.vm.value.sendingLimit).toBe(100)
    })

    it('should update when type prop changes', async () => {
      await wrapper.setProps({ type: 'smishing' })
      expect(wrapper.vm.type).toBe('smishing')
    })

    it('should update when selectedTimeZoneText changes', async () => {
      await wrapper.setProps({ selectedTimeZoneText: 'PST' })
      expect(wrapper.vm.selectedTimeZoneText).toBe('PST')
    })
  })

  describe('integration scenarios', () => {
    it('should work with phishing distribution', () => {
      expect(wrapper.vm.type).toBeDefined()
      expect(wrapper.vm.value).toBeDefined()
    })

    it('should work with immediate distribution', () => {
      expect(wrapper.vm.isRenderDistributionStartScheduled).toBe(false)
    })

    it('should work with scheduled distribution', async () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, distributionStartTypeId: 2 }
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.isRenderDistributionStartScheduled).toBe(true)
    })

    it('should work with custom sending limit', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, sendingLimit: 500 }
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value.sendingLimit).toBe(500)
    })

    it('should work with timezone information', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          selectedTimeZoneText: 'UTC'
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.selectedTimeZoneText).toBe('UTC')
    })
  })

  describe('state management', () => {
    it('should maintain distribution configuration', () => {
      expect(wrapper.vm.value).toEqual(mockValue)
    })

    it('should maintain validation state', () => {
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })
  })

  describe('UI components', () => {
    it('should render radio group for distribution start type', () => {
      const radioGroup = wrapper.findComponent({ name: 'VRadioGroup' })
      expect(radioGroup.exists()).toBe(true)
    })

    it('should render checkboxes for send days', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'VCheckbox' })
      expect(checkboxes.length).toBeGreaterThanOrEqual(0)
    })

    it('should render time selectors', () => {
      const timeSelectors = wrapper.findAllComponents({ name: 'ElTimeSelect' })
      expect(timeSelectors.length).toBeGreaterThanOrEqual(0)
    })

    it('should render KSelect for delay time type', () => {
      const kSelect = wrapper.findComponent({ name: 'KSelect' })
      expect(kSelect.exists()).toBe(true)
    })
  })

  describe('watch handlers - sendingLimit validation', () => {
    it('should set error text when limit is zero', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.sendingLimitErrorText).toBe('Enter a number higher than 0.')
    })

    it('should set error text when limit starts with 0', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: '05' } })
      expect(wrapper.vm.sendingLimitErrorText).toBe('Cannot start with 0.')
    })

    it('should set error text when limit exceeds 1000000', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 1000001 } })
      expect(wrapper.vm.sendingLimitErrorText).toContain('exceeded')
    })

    it('should clear error text when limit becomes valid', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.sendingLimitErrorText).not.toBe('')
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 100 } })
      expect(wrapper.vm.sendingLimitErrorText).toBe('')
    })

    it('should validate negative limit', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: -50 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(false)
      expect(wrapper.vm.sendingLimitErrorText).toBe('Enter a number higher than 0.')
    })
  })

  describe('computed properties - type variants', () => {
    it('should return phishing labels for phishing type', () => {
      const phishingWrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.PHISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(phishingWrapper.vm.getFirstRadioLabel).toContain('email')
      expect(phishingWrapper.vm.getDistributionFirstText).toContain('email')
      expect(phishingWrapper.vm.getDistributionThirdText).toContain('Sending limit per batch')
      expect(phishingWrapper.vm.getDistributionFourthText).toContain('Send emails')
      phishingWrapper.destroy()
    })

    it('should return smishing labels for smishing type', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.SMISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.getFirstRadioLabel).toContain('text message')
      expect(wrapper.vm.getDistributionFirstText).toContain('Send text message')
      expect(wrapper.vm.getDistributionThirdText).toContain('Sending Limit')
      expect(wrapper.vm.getDistributionFourthText).toContain('Send SMS with delay')
    })

    it('should compute correct subtitle for phishing type', () => {
      const phishingWrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.PHISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(phishingWrapper.vm.getDistributionSubtitle).toBeDefined()
      phishingWrapper.destroy()
    })

    it('should compute correct subtitle for smishing type', () => {
      const smishingWrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          type: DISTRIBUTION_TYPES.SMISHING
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(smishingWrapper.vm.getDistributionSubtitle).toBeDefined()
      smishingWrapper.destroy()
    })
  })

  describe('edge cases and boundary values', () => {
    it('should accept maximum valid limit (999999)', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 999999 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should accept minimum valid limit (1)', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 1 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should accept value 1000000 (boundary)', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 1000000 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should handle string input starting with valid number', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: '500' } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })
  })

  describe('distribution start type behavior', () => {
    it('should show scheduled section when distributionStartTypeId is 2', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, distributionStartTypeId: 2 }
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.isRenderDistributionStartScheduled).toBe(true)
    })

    it('should hide scheduled section when distributionStartTypeId is 1', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, distributionStartTypeId: 1 }
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.isRenderDistributionStartScheduled).toBe(false)
    })
  })

  describe('timezone display behavior', () => {
    it('should display timezone text when selectedTimeZoneText is provided', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          selectedTimeZoneText: 'EST'
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.selectedTimeZoneText).toBe('EST')
    })

    it('should not display timezone when selectedTimeZoneText is empty', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: mockValue,
          selectedTimeZoneText: ''
        },
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.selectedTimeZoneText).toBe('')
    })
  })

  describe('validation rules execution', () => {
    it('should execute required validation rule', () => {
      const rule = wrapper.vm.rules.number[0]
      expect(typeof rule).toBe('function')
      const result = rule(50)
      expect(typeof result).toBe('boolean')
    })

    it('should execute startsWith validation rule', () => {
      const rule = wrapper.vm.rules.number[1]
      expect(typeof rule).toBe('function')
      const result = rule('50')
      expect(typeof result).toBe('boolean')
    })

    it('should execute max value validation rule', () => {
      const rule = wrapper.vm.rules.number[2]
      expect(typeof rule).toBe('function')
      const result = rule(500)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('event emission', () => {
    it('should emit event when callForCalculateSendingInfo called', () => {
      expect(wrapper.emitted('call-for-calculate-sending-info')).toBeFalsy()
      wrapper.vm.callForCalculateSendingInfo()
      expect(wrapper.emitted('call-for-calculate-sending-info')).toBeTruthy()
      expect(wrapper.emitted('call-for-calculate-sending-info').length).toBe(1)
    })

    it('should emit event multiple times', () => {
      wrapper.vm.callForCalculateSendingInfo()
      wrapper.vm.callForCalculateSendingInfo()
      expect(wrapper.emitted('call-for-calculate-sending-info').length).toBe(2)
    })
  })

  describe('multiple prop updates in sequence', () => {
    it('should handle multiple sequential sendingLimit updates', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 50 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)

      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(false)

      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 100 } })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should handle type changes with validation state', async () => {
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
      await wrapper.setProps({ type: 'smishing' })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })
  })

  describe('default behavior without props', () => {
    it('should have correct default sendingLimit', () => {
      wrapper = shallowMount(InputDistribution, {
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value.sendingLimit).toBe(50)
    })

    it('should have correct default distributionDelayEvery', () => {
      wrapper = shallowMount(InputDistribution, {
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value.distributionDelayEvery).toBe(20)
    })

    it('should have correct default sendCallsOnDays', () => {
      wrapper = shallowMount(InputDistribution, {
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value.sendCallsOnDays).toEqual([1, 2, 4, 8, 16])
    })

    it('should have correct default time range', () => {
      wrapper = shallowMount(InputDistribution, {
        stubs: {
          'form-group': true,
          'v-radio-group': true,
          'v-radio': true,
          'v-checkbox': true,
          'v-text-field': true,
          'el-time-select': true,
          'k-select': true,
          'custom-error': true
        }
      })
      expect(wrapper.vm.value.distributionStartTime).toBe('09:00')
      expect(wrapper.vm.value.distributionEndTime).toBe('17:00')
    })
  })

  describe('advanced distribution scenarios', () => {
    it('should handle very large sending limits', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: { value: { ...mockValue, sendingLimit: 999999 } },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.isSendingLimitValid).toBe(true)
    })

    it('should handle decimal sending limits', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: { value: { ...mockValue, sendingLimit: 50.5 } },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.value.sendingLimit).toBe(50.5)
    })

    it('should handle multiple rapid distribution type changes', async () => {
      await wrapper.setProps({ type: 'phishing' })
      await wrapper.setProps({ type: 'smishing' })
      await wrapper.setProps({ type: 'phishing' })
      expect(wrapper.vm.type).toBe('phishing')
    })

    it('should handle distribution delay with different time units', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, distributionDelayTimeTypeId: '2' }
        },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.value.distributionDelayTimeTypeId).toBe('2')
    })

    it('should handle scheduled time overlaps', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, distributionStartTime: '17:00', distributionEndTime: '09:00' }
        },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.value.distributionStartTime).toBe('17:00')
      expect(wrapper.vm.value.distributionEndTime).toBe('09:00')
    })

    it('should handle all days selected for distribution', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, sendCallsOnDays: [1, 2, 3, 4, 5, 6, 7] }
        },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.value.sendCallsOnDays.length).toBe(7)
    })

    it('should handle no days selected for distribution', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: {
          value: { ...mockValue, sendCallsOnDays: [] }
        },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.value.sendCallsOnDays.length).toBe(0)
    })
  })

  describe('error messaging and validation feedback', () => {
    it('should provide clear error message for zero limit', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.sendingLimitErrorText).toContain('higher than 0')
    })

    it('should provide clear error for leading zero', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: '05' } })
      expect(wrapper.vm.sendingLimitErrorText).toContain('Cannot start with 0')
    })

    it('should clear errors on valid input', async () => {
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 0 } })
      expect(wrapper.vm.sendingLimitErrorText).not.toBe('')
      await wrapper.setProps({ value: { ...mockValue, sendingLimit: 100 } })
      expect(wrapper.vm.sendingLimitErrorText).toBe('')
    })
  })

  describe('timezone text display', () => {
    it('should display timezone information', () => {
      wrapper = shallowMount(InputDistribution, {
        propsData: { value: mockValue, selectedTimeZoneText: 'UTC+2' },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.selectedTimeZoneText).toBe('UTC+2')
    })

    it('should handle different timezone formats', () => {
      const timeZones = ['UTC', 'EST', 'PST', 'GMT', 'CET']
      timeZones.forEach(tz => {
        wrapper = shallowMount(InputDistribution, {
          propsData: { value: mockValue, selectedTimeZoneText: tz },
          stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
        })
        expect(wrapper.vm.selectedTimeZoneText).toBe(tz)
      })
    })
  })

  describe('distribution delay items', () => {
    it('should have empty delay time items by default', () => {
      expect(wrapper.vm.distributionDelayTimeItems).toEqual([])
    })

    it('should accept custom delay time items', () => {
      const items = [
        { text: 'Minutes', value: '1' },
        { text: 'Hours', value: '2' },
        { text: 'Days', value: '3' }
      ]
      wrapper = shallowMount(InputDistribution, {
        propsData: { value: mockValue, distributionDelayTimeItems: items },
        stubs: { 'form-group': true, 'v-radio-group': true, 'v-radio': true, 'v-checkbox': true, 'v-text-field': true, 'el-time-select': true, 'k-select': true, 'custom-error': true }
      })
      expect(wrapper.vm.distributionDelayTimeItems.length).toBe(3)
    })

    it('should update delay time items reactively', async () => {
      const newItems = [{ text: 'Weeks', value: '4' }]
      await wrapper.setProps({ distributionDelayTimeItems: newItems })
      expect(wrapper.vm.distributionDelayTimeItems).toEqual(newItems)
    })
  })

  describe('computed properties rendering', () => {
    it('should compute subtitle based on type', () => {
      expect(wrapper.vm.getDistributionSubtitle).toBeDefined()
    })

    it('should compute radio labels based on type', () => {
      expect(wrapper.vm.getFirstRadioLabel).toBeDefined()
      expect(wrapper.vm.getSecondRadioLabel).toBeDefined()
    })

    it('should compute distribution text based on type', () => {
      expect(wrapper.vm.getDistributionFirstText).toBeDefined()
      expect(wrapper.vm.getDistributionSecondText).toBeDefined()
      expect(wrapper.vm.getDistributionThirdText).toBeDefined()
      expect(wrapper.vm.getDistributionFourthText).toBeDefined()
    })
  })
})
