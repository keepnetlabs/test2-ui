import { createLocalVue, mount } from '@vue/test-utils'
import KCheckbox from '@/components/Common/Checkbox/KCheckbox'
import CONSTANTS from '../Datatable/constants'
import { customVuetify as vuetify } from '../utils'
describe('Checkbox Unit cases', () => {
  const localVue = createLocalVue()
  it('Checking is rendering', () => {
    const wrapper = mount(KCheckbox, {
      localVue,
      vuetify
    })
    //checking parent element
    expect(wrapper.find('div').classes('v-input--checkbox')).toBe(true)
    //checking is checkbox unselected
    expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
  })

  it('Checking selection(Tri-state)', () => {
    const wrapper = mount(KCheckbox, {
      localVue,
      vuetify
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
      vuetify,
      propsData: {
        defaultValue: 'indeterminate'
      }
    })
    //checking rendered as a indeterminate
    expect(wrapper.find('input[aria-checked="mixed"]').exists()).toBe(true)
  })

  it('Has V-checkbox component rendered', () => {
    const wrapper = mount(KCheckbox, {
      localVue,
      vuetify
    })
    expect(wrapper.find('.v-input--checkbox').exists()).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('Supports different default values', async () => {
    const wrapperTrue = mount(KCheckbox, {
      localVue,
      vuetify,
      propsData: { defaultValue: true }
    })
    expect(wrapperTrue.find('input[aria-checked="true"]').exists()).toBe(true)

    const wrapperFalse = mount(KCheckbox, {
      localVue,
      vuetify,
      propsData: { defaultValue: false }
    })
    expect(wrapperFalse.find('input[aria-checked="false"]').exists()).toBe(true)
  })

  it('Emits input events with correct values', () => {
    const wrapper = mount(KCheckbox, {
      localVue,
      vuetify
    })
    const slot = wrapper.find('.v-input__control .v-input__slot')

    slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
    const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
    expect(events.length).toBeGreaterThan(0)
    expect([true, false, 'indeterminate']).toContain(events[0][0])
  })
})
