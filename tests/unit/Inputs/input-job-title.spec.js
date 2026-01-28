import { createLocalVue, mount } from '@vue/test-utils'
import TestInputJobTitleWrapper from '@/components/TestHelpers/TestInputJobTitleWrapper'
import InputHelper from '../Objects/InputHelper'

describe('Input company component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('#test--input-job-title').exists()).toBeTruthy()
  })

  it('Checking props', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    //checking placeholder

    const inputAttr = wrapper.find('input').attributes()
    expect(inputAttr.placeholder).toEqual('Enter a name for the job title')
    //checking is autocomplete off
    expect(inputAttr.autocomplete).toEqual('off')
    //checking is required true
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(true)
  })

  it('Checking validations', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input job title data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title datamy custom input job title data',
      textInput,
      wrapper
    )

    expect(wrapper.find('.v-messages__message').text().includes('Max 64')).toBeTruthy()
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('Accepts valid job titles', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    await inputHelper.addData('Senior Developer', textInput, wrapper)
    expect(wrapper.find('.v-messages__message').text().includes('Cannot start with space')).toBe(false)
  })

  it('Enforces 64 character limit', async () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    const longTitle = 'a'.repeat(65)
    await inputHelper.addData(longTitle, textInput, wrapper)
    expect(wrapper.find('.v-messages__message').text()).toContain('Max 64')
  })

  it('Shows required indicator', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    expect(wrapper.find('.v-messages__wrapper').text()).toContain('*Required')
  })

  it('Has correct placeholder', () => {
    const wrapper = mount(TestInputJobTitleWrapper, {
      localVue
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toEqual('Enter a name for the job title')
  })
})
