import { createLocalVue, mount } from '@vue/test-utils'
import InputDate from '@/components/Common/Inputs/InputDate'
describe('Input date component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(InputDate, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.find('.el-date-editor').exists()).toBeTruthy()
  })

  it('Checking props', async () => {
    const wrapper = mount(InputDate, {
      localVue
    })
    const input = wrapper.find('input')
    //checking input type
    const attributes = input.attributes()
    expect(attributes.type.includes('text')).toBeTruthy()
    //checking placeholder
    expect(attributes.placeholder.includes('Select a date')).toBeTruthy()
  })
  it('Changing type', async () => {
    const wrapper = mount(InputDate, {
      localVue,
      propsData: {
        type: 'datetime'
      }
    })
    //checking is datetime
    expect(wrapper.find('.el-date-editor--datetime').exists()).toBeTruthy()
  })
})
