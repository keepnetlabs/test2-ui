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

  it('supports month type for date selection', () => {
    const wrapper = mount(InputDate, {
      localVue,
      propsData: {
        type: 'month'
      }
    })
    expect(wrapper.find('.el-date-editor--month').exists()).toBeTruthy()
  })

  it('supports datetimerange type', () => {
    const wrapper = mount(InputDate, {
      localVue,
      propsData: {
        type: 'datetimerange'
      }
    })
    expect(wrapper.find('.el-date-editor--datetimerange').exists()).toBeTruthy()
  })

  it('supports daterange type', () => {
    const wrapper = mount(InputDate, {
      localVue,
      propsData: {
        type: 'daterange'
      }
    })
    expect(wrapper.find('.el-date-editor--daterange').exists()).toBeTruthy()
  })

  it('applies disabled state when prop is true', () => {
    const wrapper = mount(InputDate, {
      localVue,
      propsData: {
        disabled: true
      }
    })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('renders with default type as date', () => {
    const wrapper = mount(InputDate, {
      localVue
    })
    expect(wrapper.find('.el-date-editor--date').exists()).toBeTruthy()
  })
})
