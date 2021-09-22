import { createLocalVue, mount } from '@vue/test-utils'
import TestInputEmailWrapper from '@/components/TestHelpers/TestInputEmailWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-last-name').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter an email address')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputEmailWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom email data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking is email
    await inputHelper.addData('askkas.ko', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Invalid email address')
    ).toBeTruthy()

    //checking is left right part of email
    await inputHelper.addData(
      'askkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkasaskkas@gmail.com',
      textInput,
      wrapper
    )

    expect(
      wrapper.find('.v-messages__message').text().includes('Invalid email address')
    ).toBeTruthy()

    //checking required
    await inputHelper.addData('', textInput, wrapper)

    await expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })
})
