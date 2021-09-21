import { createLocalVue, mount } from '@vue/test-utils'
import TestInputURLWrapper from '@/components/TestHelpers/TestInputURLWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input URL component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputURLWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-url').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputURLWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a URL')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputURLWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input url data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking is url
    await inputHelper.addData('askaksaksaalsal', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Invalid URL')).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'mycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurlmycustominputurl.com',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    await expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })
})
