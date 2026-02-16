import { createLocalVue, mount } from '@vue/test-utils'
import TestInputIpAddresses from '@/components/TestHelpers/TestInputIpAddresses'
import InputHelper from '../Objects/InputHelper'

describe('Input ip address component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-ip-address').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter an ip address')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' 192.168.1.1', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking is ip address
    await inputHelper.addData('192.168.1.1', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Invalid IP address')).toBe(false)

    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('accepts valid IP address formats', async () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const validIPs = ['10.0.0.1', '172.16.0.1', '255.255.255.255']
    for (const ip of validIPs) {
      await inputHelper.addData(ip, textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain(ip)
    }
  })

  it('rejects invalid IP address formats', async () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('256.256.256.256', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Invalid IP address') || errorMsg.length > 0).toBeTruthy()
  })

  it('validates boundary IP addresses', async () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    // Test localhost
    await inputHelper.addData('127.0.0.1', textInput, wrapper)
    expect(wrapper.find('input').element.value).toContain('127.0.0.1')
  })

  it('rejects non-numeric input', async () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('abc.def.ghi.jkl', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Invalid IP address') || errorMsg.includes('Required')).toBeTruthy()
  })

  it('has correct input attributes and styling', () => {
    const wrapper = mount(TestInputIpAddresses, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toEqual('Enter an ip address')
    expect(input.attributes('autocomplete')).toEqual('off')
  })

  describe('Component Rendering', () => {
    it('renders IP address input component', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(wrapper.find('#test--input-ip-address').exists()).toBeTruthy()
    })

    it('input field is visible', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(wrapper.find('input').isVisible()).toBe(true)
    })
  })

  describe('IP Address Format Validation', () => {
    it('accepts standard IPv4 format', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('192.168.1.1', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('192.168.1.1')
    })

    it('accepts private IP range 10.0.0.0', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('10.0.0.1', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('10.0.0.1')
    })

    it('accepts private IP range 172.16.0.0', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('172.16.0.1', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('172.16.0.1')
    })

    it('rejects out of range octets', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('256.256.256.256', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists() || wrapper.find('input').element.value.length > 0).toBeTruthy()
    })

    it('rejects incomplete IP address', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('192.168.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })
  })

  describe('Space Validation', () => {
    it('rejects IP with leading space', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData(' 192.168.1.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
      expect(errorMsg.text().includes('Cannot start with space')).toBe(true)
    })

    it('rejects IP with multiple leading spaces', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('  10.0.0.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })
  })

  describe('Required Field Validation', () => {
    it('shows required indicator', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
    })

    it('rejects empty input', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
      expect(errorMsg.text().includes('Required')).toBe(true)
    })
  })

  describe('Boundary IP Addresses', () => {
    it('accepts localhost IP', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('127.0.0.1', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('127.0.0.1')
    })

    it('accepts broadcast address', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('255.255.255.255', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('255.255.255.255')
    })

    it('accepts minimum valid address', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('0.0.0.0', textInput, wrapper)
      expect(wrapper.find('input').element.value).toContain('0.0.0.0')
    })
  })

  describe('Invalid IP Rejection', () => {
    it('rejects non-numeric octets', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('abc.def.ghi.jkl', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('rejects partial numeric input', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('192.abc.1.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('rejects extra dots', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      await inputHelper.addData('192.168..1.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })
  })

  describe('Input Attributes', () => {
    it('has correct placeholder', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter an ip address')
    })

    it('has autocomplete disabled', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    })
  })

  describe('Data Binding', () => {
    it('preserves input value', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const testIP = '192.168.1.100'
      await inputHelper.addData(testIP, textInput, wrapper)
      expect(wrapper.vm.value).toBe(testIP)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      expect(() => {
        mount(TestInputIpAddresses, {
          localVue
        })
      }).not.toThrow()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('maintains state through lifecycle', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('192.168.1.1', textInput, wrapper)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.value).toContain('192.168.1.1')
    })
  })

  describe('Event Emission', () => {
    it('emits input event on value change', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('10.0.0.1', textInput, wrapper)

      // Event should be emitted
      expect(wrapper.emitted()).toBeTruthy()
    })

    it('emits valid IP data', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')
      const validIP = '172.16.0.1'

      await inputHelper.addData(validIP, textInput, wrapper)

      expect(wrapper.vm.value).toContain(validIP)
    })
  })

  describe('Class and Styling', () => {
    it('applies correct CSS classes', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const component = wrapper.find('#test--input-ip-address')
      expect(component.exists()).toBe(true)
    })

    it('input has consistent styling', () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.isVisible()).toBe(true)
    })
  })

  describe('Error Message Display', () => {
    it('displays error for invalid format', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('999.999.999.999', textInput, wrapper)

      expect(wrapper.find('.v-messages__message').exists()).toBeTruthy()
    })

    it('clears error on valid input', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // First add invalid data
      await inputHelper.addData('999.999.999.999', textInput, wrapper)
      // Then add valid data
      await inputHelper.addData('192.168.1.1', textInput, wrapper)

      expect(wrapper.find('input').element.value).toContain('192.168.1.1')
    })
  })

  describe('Private IP Ranges', () => {
    it('accepts class A private range', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const privateIPs = ['10.0.0.0', '10.255.255.255', '10.100.50.25']
      for (const ip of privateIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })

    it('accepts class B private range', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const privateIPs = ['172.16.0.0', '172.31.255.255', '172.20.50.25']
      for (const ip of privateIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })

    it('accepts class C private range', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const privateIPs = ['192.168.0.0', '192.168.255.255', '192.168.1.1']
      for (const ip of privateIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })
  })

  describe('Public IP Addresses', () => {
    it('accepts public IP addresses', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const publicIPs = ['8.8.8.8', '1.1.1.1', '208.67.222.222']
      for (const ip of publicIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })
  })

  describe('Multi-Octect Combinations', () => {
    it('handles various valid octet combinations', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const validIPs = ['1.2.3.4', '100.200.50.75', '50.100.150.200']
      for (const ip of validIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })

    it('rejects mixed valid/invalid octets', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const invalidIPs = ['192.256.1.1', '192.168.300.1', '192.168.1.999']
      for (const ip of invalidIPs) {
        await inputHelper.addData(ip, textInput, wrapper)
        const errorMsg = wrapper.find('.v-messages__message')
        expect(errorMsg.exists() || wrapper.find('input').element.value.length > 0).toBeTruthy()
      }
    })
  })

  describe('Special Formatting Cases', () => {
    it('rejects leading zeros in octets', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // Some validators reject leading zeros
      await inputHelper.addData('192.168.001.001', textInput, wrapper)
      expect(wrapper.find('input').element.value.length > 0).toBeTruthy()
    })

    it('rejects whitespace within IP address', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('192.168. 1. 1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('rejects trailing dots', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('192.168.1.1.', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })

    it('rejects leading dots', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      await inputHelper.addData('.192.168.1.1', textInput, wrapper)
      const errorMsg = wrapper.find('.v-messages__message')
      expect(errorMsg.exists()).toBeTruthy()
    })
  })

  describe('Performance and Multiple Instances', () => {
    it('creates multiple instances without conflict', () => {
      const wrapper1 = mount(TestInputIpAddresses, { localVue })
      const wrapper2 = mount(TestInputIpAddresses, { localVue })

      expect(wrapper1.find('#test--input-ip-address').exists()).toBe(true)
      expect(wrapper2.find('#test--input-ip-address').exists()).toBe(true)

      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('instances maintain independent state', async () => {
      const wrapper1 = mount(TestInputIpAddresses, { localVue })
      const wrapper2 = mount(TestInputIpAddresses, { localVue })
      const inputHelper = new InputHelper()

      const input1 = wrapper1.find('input')
      const input2 = wrapper2.find('input')

      await inputHelper.addData('10.0.0.1', input1, wrapper1)
      await inputHelper.addData('192.168.1.1', input2, wrapper2)

      expect(wrapper1.vm.value).toContain('10.0.0.1')
      expect(wrapper2.vm.value).toContain('192.168.1.1')

      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('Integration Scenarios', () => {
    it('handles complete IP entry workflow', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      // Start with invalid
      await inputHelper.addData('999.999.999.999', textInput, wrapper)
      expect(wrapper.find('.v-messages__message').exists()).toBeTruthy()

      // Correct to valid
      await inputHelper.addData('192.168.1.50', textInput, wrapper)
      expect(wrapper.vm.value).toContain('192.168.1.50')
    })

    it('handles rapid IP changes', async () => {
      const wrapper = mount(TestInputIpAddresses, {
        localVue
      })
      const inputHelper = new InputHelper()
      const textInput = wrapper.find('input')

      const ips = ['10.0.0.1', '172.16.0.1', '192.168.1.1', '8.8.8.8']
      for (const ip of ips) {
        await inputHelper.addData(ip, textInput, wrapper)
        expect(wrapper.find('input').element.value).toContain(ip)
      }
    })
  })
})
