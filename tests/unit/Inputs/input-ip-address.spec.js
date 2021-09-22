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
    expect(inputAttr.placeholder).toEqual('Enter an ip adress')
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

    await expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })
})
