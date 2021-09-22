import { createLocalVue, mount } from '@vue/test-utils'
import TestInputLastNameWrapper from '@/components/TestHelpers/TestInputLastNameWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter last name')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputLastNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input last name data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name datamy custom input last name data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    await expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })
})
