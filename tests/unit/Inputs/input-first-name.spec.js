import { createLocalVue, mount } from '@vue/test-utils'
import TestInputFirstNameWrapper from '@/components/TestHelpers/TestInputFirstNameWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-first-name').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter first name')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input first name data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input first name data my custom input first name data my custom input first name datamy custom input first name data  vmy custom input first name datamy custom input first name datamy custom input first name data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('accepts valid first name input', async () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('John', textInput, wrapper)
    expect(wrapper.find('input').element.value).toContain('John')
  })

  it('rejects input starting with space', async () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('  InvalidName', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Cannot start with space')).toBeTruthy()
  })

  it('displays required message when empty', async () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('', textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('Required')).toBeTruthy()
  })

  it('enforces maximum character length', async () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const longName = 'a'.repeat(256)
    await inputHelper.addData(longName, textInput, wrapper)
    const errorMsg = wrapper.find('.v-messages__message').text()
    expect(errorMsg.includes('cannot exceed')).toBeTruthy()
  })

  it('renders input with correct attributes', () => {
    const wrapper = mount(TestInputFirstNameWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toEqual('Enter first name')
    expect(input.attributes('autocomplete')).toEqual('off')
  })
})
