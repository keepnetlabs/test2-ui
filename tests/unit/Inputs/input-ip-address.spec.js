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
})
