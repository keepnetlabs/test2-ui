import { createLocalVue, mount } from '@vue/test-utils'
import TestInputDepartmentWrapper from '@/components/TestHelpers/TestInputDepartmentWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-department').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a name for the department')
    //checking is autocomplete disabled
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required false
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input department data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data my custom input department data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
  })

  it('Accepts valid department names', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('IT Department', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message')
    expect(!errorMsg.exists() || !errorMsg.text().includes('Cannot start with space')).toBe(true)
  })

  it('Department is not required', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('Has correct input attributes', () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toEqual('Enter a name for the department')
    expect(input.attributes('autocomplete')).toEqual('off')
  })

  it('Allows empty input', async () => {
    const wrapper = mount(TestInputDepartmentWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('', textInput, wrapper)
    // Should not show required error
    const errorMsg = wrapper.find('.v-messages__message')
    expect(!errorMsg.exists() || !errorMsg.text().includes('Required')).toBe(true)
  })
})
