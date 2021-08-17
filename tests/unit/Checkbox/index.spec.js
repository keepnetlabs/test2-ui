import { createLocalVue } from '@vue/test-utils'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox'
import { mount } from '@vue/test-utils'
import CONSTANTS from '../Datatable/constants'
describe('Checkbox Unit cases', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(KCheckbox, {
      localVue
    })
    //checking parent element
    expect(wrapper.find('div').classes('v-input--checkbox')).toBe(true)
    //checking is checkbox unselected
    expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
  })

  it('Checking selection(Tri-state)', () => {
    const wrapper = mount(KCheckbox, {
      localVue
    })
    const clickCheckbox = () => {
      wrapper.find('.v-input__control .v-input__slot').trigger(CONSTANTS.EVENT_TYPES.CLICK)
    }
    //clicking checkbox
    clickCheckbox()
    //checking is event throwed
    const emittedEvent = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
    expect(emittedEvent).toBeTruthy()
    //checking event value is indeterminate
    expect(emittedEvent[0][0]).toBe('indeterminate')
    //clicking checkbox again
    clickCheckbox()
    //expecting event value is true
    expect(emittedEvent[1][0]).toBe(true)
    //clicking checkbox again
    clickCheckbox()
    expect(emittedEvent[2][0]).toBe(false)
  })

  it('Giving default indeterminate value', async () => {
    const wrapper = mount(KCheckbox, {
      localVue,
      propsData: {
        defaultValue: 'indeterminate'
      }
    })
    //checking rendered as a indeterminate
    expect(wrapper.find('input[aria-checked="mixed"]').exists()).toBe(true)
  })
})
