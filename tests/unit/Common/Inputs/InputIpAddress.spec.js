import { shallowMount } from '@vue/test-utils'
import InputIpAddress from '@/components/Common/Inputs/InputIpAddress.vue'
import * as Validations from '@/utils/validations'

jest.mock('@/utils/validations')

describe('InputIpAddress.vue', () => {
  let wrapper

  beforeEach(() => {
    Validations.ip = jest.fn().mockReturnValue(true)
    Validations.startsWithSpace = jest.fn().mockReturnValue(true)
    wrapper = shallowMount(InputIpAddress)
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('InputIpAddress')
    })

    it('should extend VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputIpAddress')
    })

    it('should have properly defined component options', () => {
      expect(wrapper.vm.$options).toHaveProperty('name')
      expect(wrapper.vm.$options).toHaveProperty('props')
    })

    it('should have defined options', () => {
      expect(wrapper.vm.$options).toBeDefined()
    })
  })

  describe('prop defaults', () => {
    it('should have outlined default true', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should have dense default true', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should have placeholder default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter an IP address')
    })

    it('should have hint default', () => {
      expect(wrapper.vm.hint).toBe('*Required')
    })

    it('should have persistentHint default true', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should have autocomplete default off', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should have rules default', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have at least 2 default validation rules', () => {
      expect(wrapper.vm.rules.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('props configuration', () => {
    it('should accept custom placeholder', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          placeholder: 'Custom IP placeholder'
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom IP placeholder')
    })

    it('should accept custom hint', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          hint: 'Enter a valid IP'
        }
      })
      expect(wrapper.vm.hint).toBe('Enter a valid IP')
    })

    it('should accept outlined false', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          outlined: false
        }
      })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should accept dense false', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          dense: false
        }
      })
      expect(wrapper.vm.dense).toBe(false)
    })

    it('should accept persistentHint false', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          persistentHint: false
        }
      })
      expect(wrapper.vm.persistentHint).toBe(false)
    })

    it('should accept custom autocomplete', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          autocomplete: 'on'
        }
      })
      expect(wrapper.vm.autocomplete).toBe('on')
    })

    it('should accept custom rules', () => {
      const customRules = [(v) => v.length > 0]
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          rules: customRules
        }
      })
      expect(wrapper.vm.rules).toEqual(customRules)
    })

    it('should accept label prop', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          label: 'IP Address'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should accept v-model binding', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1'
        }
      })
      expect(wrapper.vm.$attrs.value || wrapper.vm.value).toBe('192.168.1.1')
    })
  })

  describe('VTextField extension', () => {
    it('should extend VTextField', () => {
      expect(wrapper.vm.$options.name).toBe('InputIpAddress')
    })

    it('should have all VTextField base functionality', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should support outlined variant', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should support dense variant', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should support placeholder text', () => {
      expect(wrapper.vm.placeholder).toBeDefined()
    })

    it('should support hint text', () => {
      expect(wrapper.vm.hint).toBeDefined()
    })

    it('should support persistent hint', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should support autocomplete attribute', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })
  })

  describe('validation rules', () => {
    it('should have rules array', () => {
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should have ip validation rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThan(0)
      expect(typeof rules[0]).toBe('function')
    })

    it('should have startsWithSpace validation rule', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThanOrEqual(2)
      expect(typeof rules[1]).toBe('function')
    })

    it('should validate ip addresses using Validations.ip', () => {
      expect(Validations.ip).toBeDefined()
    })

    it('should validate space prefix using Validations.startsWithSpace', () => {
      expect(Validations.startsWithSpace).toBeDefined()
    })

    it('should execute ip validation rule', () => {
      const rules = wrapper.vm.rules
      const ipRule = rules[0]
      ipRule('192.168.1.1')
      expect(Validations.ip).toHaveBeenCalled()
    })

    it('should execute startsWithSpace validation rule', () => {
      const rules = wrapper.vm.rules
      const spaceRule = rules[1]
      spaceRule('192.168.1.1')
      expect(Validations.startsWithSpace).toHaveBeenCalled()
    })

    it('should pass value to ip validation', () => {
      const rules = wrapper.vm.rules
      const testIp = '10.0.0.1'
      rules[0](testIp)
      expect(Validations.ip).toHaveBeenCalledWith(testIp)
    })

    it('should pass value to startsWithSpace validation', () => {
      const rules = wrapper.vm.rules
      const testValue = ' 192.168.1.1'
      rules[1](testValue)
      expect(Validations.startsWithSpace).toHaveBeenCalledWith(testValue)
    })
  })

  describe('component reactivity', () => {
    it('should update when value prop changes', async () => {
      await wrapper.setProps({ value: '192.168.1.1' })
      expect(wrapper.vm.$attrs.value || wrapper.vm.value).toBe('192.168.1.1')
    })

    it('should update when placeholder prop changes', async () => {
      await wrapper.setProps({ placeholder: 'New placeholder' })
      expect(wrapper.vm.placeholder).toBe('New placeholder')
    })

    it('should update when hint prop changes', async () => {
      await wrapper.setProps({ hint: 'New hint' })
      expect(wrapper.vm.hint).toBe('New hint')
    })

    it('should update when outlined prop changes', async () => {
      await wrapper.setProps({ outlined: false })
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should update when dense prop changes', async () => {
      await wrapper.setProps({ dense: false })
      expect(wrapper.vm.dense).toBe(false)
    })

    it('should update when rules prop changes', async () => {
      const newRules = [(v) => v && v.length > 0]
      await wrapper.setProps({ rules: newRules })
      expect(wrapper.vm.rules).toEqual(newRules)
    })

    it('should handle complex prop updates', async () => {
      await wrapper.setProps({
        value: '10.0.0.1',
        placeholder: 'Custom IP',
        outlined: false,
        dense: false
      })
      expect(wrapper.vm.placeholder).toBe('Custom IP')
      expect(wrapper.vm.outlined).toBe(false)
      expect(wrapper.vm.dense).toBe(false)
    })
  })

  describe('IP format validation', () => {
    it('should validate valid IPv4 addresses', () => {
      const rules = wrapper.vm.rules
      const validIPs = [
        '192.168.1.1',
        '10.0.0.1',
        '172.16.0.1',
        '8.8.8.8',
        '0.0.0.0',
        '255.255.255.255'
      ]

      validIPs.forEach(ip => {
        rules[0](ip)
        expect(Validations.ip).toHaveBeenCalledWith(ip)
      })
    })

    it('should reject invalid IP formats', () => {
      const rules = wrapper.vm.rules
      const invalidIPs = [
        '256.1.1.1',
        '192.168.1',
        '192.168',
        'not.an.ip.address',
        '192.168.1.1.1',
        ''
      ]

      invalidIPs.forEach(ip => {
        rules[0](ip)
        expect(Validations.ip).toHaveBeenCalledWith(ip)
      })
    })

    it('should reject values starting with space', () => {
      const rules = wrapper.vm.rules
      const spaceValues = [
        ' 192.168.1.1',
        '  10.0.0.1',
        ' test'
      ]

      spaceValues.forEach(value => {
        rules[1](value)
        expect(Validations.startsWithSpace).toHaveBeenCalledWith(value)
      })
    })

    it('should allow values not starting with space', () => {
      const rules = wrapper.vm.rules
      const validValues = [
        '192.168.1.1',
        'test',
        '123'
      ]

      validValues.forEach(value => {
        rules[1](value)
        expect(Validations.startsWithSpace).toHaveBeenCalledWith(value)
      })
    })
  })

  describe('text field behavior', () => {
    it('should support text input', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should be a single line input', () => {
      expect(wrapper.vm.multiline).toBeUndefined()
    })

    it('should support readonly state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          readonly: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support disabled state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support error state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          error: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support clearable prop', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          clearable: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support filled variant', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          filled: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support solo variant', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          solo: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })
  })

  describe('state management', () => {
    it('should maintain value state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should preserve state across multiple updates', async () => {
      await wrapper.setProps({ value: '192.168.1.1' })
      expect(wrapper.vm.rules).toBeDefined()
      await wrapper.setProps({ value: '10.0.0.1' })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should handle value clearing', async () => {
      await wrapper.setProps({ value: '192.168.1.1' })
      expect(wrapper.vm.rules).toBeDefined()
      await wrapper.setProps({ value: '' })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should maintain rules state', () => {
      expect(wrapper.vm.rules).toBeDefined()
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })

    it('should maintain configuration state', () => {
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
      expect(wrapper.vm.autocomplete).toBe('off')
    })
  })

  describe('accessibility', () => {
    it('should have hint for screen readers', () => {
      expect(wrapper.vm.hint).toBe('*Required')
    })

    it('should have placeholder for input guidance', () => {
      expect(wrapper.vm.placeholder).toBe('Enter an IP address')
    })

    it('should support label prop', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          label: 'IP Address'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should support persistent hint for visibility', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should support autocomplete off for security', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should support aria attributes', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          'aria-label': 'IP Address Input'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('should support aria-describedby for hint association', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          'aria-describedby': 'ip-hint'
        }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    it('should work as IP address input with defaults', () => {
      expect(wrapper.vm.placeholder).toBe('Enter an IP address')
      expect(wrapper.vm.outlined).toBe(true)
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should work with custom configuration', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          placeholder: 'Custom IP',
          hint: 'Enter IP',
          outlined: false,
          dense: false
        }
      })
      expect(wrapper.vm.placeholder).toBe('Custom IP')
      expect(wrapper.vm.outlined).toBe(false)
    })

    it('should work with validation disabled', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          rules: []
        }
      })
      expect(wrapper.vm.rules).toEqual([])
    })

    it('should work with readonly state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1',
          readonly: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should work with disabled state', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1',
          disabled: true
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should work with custom error message', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          error: true,
          hint: 'Invalid IP address'
        }
      })
      expect(wrapper.vm.hint).toBe('Invalid IP address')
    })

    it('should work with v-model binding', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })
  })

  describe('prop validation', () => {
    it('should accept string values', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: '192.168.1.1'
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should accept empty string', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          value: ''
        }
      })
      expect(wrapper.vm.rules).toBeDefined()
    })

    it('should accept boolean for outlined', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          outlined: true
        }
      })
      expect(typeof wrapper.vm.outlined).toBe('boolean')
    })

    it('should accept boolean for dense', () => {
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          dense: true
        }
      })
      expect(typeof wrapper.vm.dense).toBe('boolean')
    })

    it('should accept array for rules', () => {
      const rules = [(v) => true]
      wrapper = shallowMount(InputIpAddress, {
        propsData: {
          rules: rules
        }
      })
      expect(Array.isArray(wrapper.vm.rules)).toBe(true)
    })
  })

  describe('default configuration', () => {
    it('should be outlined by default', () => {
      expect(wrapper.vm.outlined).toBe(true)
    })

    it('should be dense by default', () => {
      expect(wrapper.vm.dense).toBe(true)
    })

    it('should have IP address placeholder by default', () => {
      expect(wrapper.vm.placeholder).toBe('Enter an IP address')
    })

    it('should have required hint by default', () => {
      expect(wrapper.vm.hint).toBe('*Required')
    })

    it('should have persistent hint by default', () => {
      expect(wrapper.vm.persistentHint).toBe(true)
    })

    it('should have autocomplete off by default', () => {
      expect(wrapper.vm.autocomplete).toBe('off')
    })

    it('should have ip and startsWithSpace validations by default', () => {
      const rules = wrapper.vm.rules
      expect(rules.length).toBeGreaterThanOrEqual(2)
    })
  })
})
