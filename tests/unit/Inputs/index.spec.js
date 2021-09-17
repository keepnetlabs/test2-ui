import { createLocalVue, mount } from '@vue/test-utils'
import TestInputCompanyWrapper from '@/components/TestHelpers/TestInputCompanyWrapper'

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

    const addData = async (value) => {
      textInput.element.value = value
      wrapper.vm.value = textInput.element.value
      await textInput.trigger('click')
      await wrapper.vm.$nextTick()
    }
    //checking cannot start empty space
    await addData(' custom data')
    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()
    //checking length
    await addData(
      'custom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom datacustom data'
    )
    expect(wrapper.find('.v-messages__message').text().includes('cannot exceed')).toBeTruthy()
    //checking required
    await addData('')

    await expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })
})
