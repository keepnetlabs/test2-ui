import { createLocalVue, mount } from '@vue/test-utils'
import TestInputCompanyWrapper from '@/components/TestHelpers/TestInputCompanyWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-company').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    //checking placeholder
    const inputAttr = wrapper.find('input[placeholder]').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a name for the company')
    //checking is autocomplete disabled
    expect(inputAttr.autocomplete).toEqual('disabled')
    //checking is required
    expect(wrapper.find('.v-messages__message').text().includes('*Required')).toBeTruthy()
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    const textInput = wrapper.find('input')
    const inputHelper = new InputHelper()

    //checking cannot start empty space
    await inputHelper.addData(' my custom input company data', textInput, wrapper)
    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()
    //checking length
    await inputHelper.addData(
      'my custom input company datamy custom input company data my custom input company data my custom input company data my custom input company data my custom input company data my custom input company data ',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('Accepts valid company names', async () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    const textInput = wrapper.find('input')
    const inputHelper = new InputHelper()

    await inputHelper.addData('Google Inc', textInput, wrapper)
    expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
  })

  it('Has correct input attributes', () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toEqual('Enter a name for the company')
    expect(input.attributes('autocomplete')).toEqual('disabled')
  })

  it('Shows required indicator', () => {
    const wrapper = mount(TestInputCompanyWrapper, {
      localVue
    })
    expect(wrapper.find('.v-messages__message').text()).toContain('*Required')
  })
})
