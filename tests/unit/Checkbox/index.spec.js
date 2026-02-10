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

  describe('Component Rendering', () => {
    it('renders checkbox component', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('div').classes('v-input--checkbox')).toBe(true)
    })

    it('renders with v-input class', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('.v-input--checkbox').exists()).toBe(true)
    })

    it('renders input element', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('renders without errors', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Checkbox States', () => {
    it('initial state is unchecked', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
    })

    it('renders checked state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      expect(wrapper.find('input[aria-checked="true"]').exists()).toBe(true)
    })

    it('renders unchecked state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: false }
      })
      expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
    })

    it('renders indeterminate state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: 'indeterminate' }
      })
      expect(wrapper.find('input[aria-checked="mixed"]').exists()).toBe(true)
    })
  })

  describe('Default Values', () => {
    it('accepts true as default value', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      expect(wrapper.props('defaultValue')).toBe(true)
    })

    it('accepts false as default value', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: false }
      })
      expect(wrapper.props('defaultValue')).toBe(false)
    })

    it('accepts indeterminate as default value', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: 'indeterminate' }
      })
      expect(wrapper.props('defaultValue')).toBe('indeterminate')
    })

    it('default unchecked without props', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
    })
  })

  describe('Tri-state Behavior', () => {
    it('cycles through states on click', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const clickCheckbox = () => {
        wrapper.find('.v-input__control .v-input__slot').trigger(CONSTANTS.EVENT_TYPES.CLICK)
      }

      clickCheckbox()
      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events[0][0]).toBe('indeterminate')

      clickCheckbox()
      expect(events[1][0]).toBe(true)

      clickCheckbox()
      expect(events[2][0]).toBe(false)
    })

    it('starts with false state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
    })

    it('transitions from false to indeterminate', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: false }
      })
      const clickCheckbox = () => {
        wrapper.find('.v-input__control .v-input__slot').trigger(CONSTANTS.EVENT_TYPES.CLICK)
      }

      clickCheckbox()
      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events[0][0]).toBe('indeterminate')
    })

    it('emits event from indeterminate state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: 'indeterminate' }
      })
      const clickCheckbox = () => {
        wrapper.find('.v-input__control .v-input__slot').trigger(CONSTANTS.EVENT_TYPES.CLICK)
      }

      clickCheckbox()
      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBeGreaterThan(0)
      expect([true, false, 'indeterminate']).toContain(events[0][0])
    })

    it('emits event from true state', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      const clickCheckbox = () => {
        wrapper.find('.v-input__control .v-input__slot').trigger(CONSTANTS.EVENT_TYPES.CLICK)
      }

      clickCheckbox()
      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBeGreaterThan(0)
      expect([true, false, 'indeterminate']).toContain(events[0][0])
    })
  })

  describe('Event Emission', () => {
    it('emits input event on click', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events).toBeTruthy()
      expect(events.length).toBeGreaterThan(0)
    })

    it('emits valid checkbox value', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect([true, false, 'indeterminate']).toContain(events[0][0])
    })

    it('emits multiple events on multiple clicks', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')

      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBe(3)
    })

    it('emits correct sequence of values', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')

      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events[0][0]).toBe('indeterminate')
      expect(events[1][0]).toBe(true)
      expect(events[2][0]).toBe(false)
    })
  })

  describe('User Interaction', () => {
    it('responds to click events', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')

      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBeGreaterThan(0)
    })

    it('handles rapid clicks', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')

      for (let i = 0; i < 5; i++) {
        slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      }

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBe(5)
    })

    it('maintains state consistency', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      expect(wrapper.find('input[aria-checked="true"]').exists()).toBe(true)
    })
  })

  describe('Props Handling', () => {
    it('accepts defaultValue prop', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: 'indeterminate' }
      })
      expect(wrapper.props('defaultValue')).toBe('indeterminate')
    })

    it('has defaultValue prop defined', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: false }
      })
      expect(wrapper.props('defaultValue')).toBeDefined()
    })

    it('accepts multiple defaultValue types', () => {
      const wrapperTrue = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      expect(wrapperTrue.props('defaultValue')).toBe(true)

      const wrapperIndeterminate = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: 'indeterminate' }
      })
      expect(wrapperIndeterminate.props('defaultValue')).toBe('indeterminate')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined defaultValue', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: {}
      })
      expect(wrapper.find('input[aria-checked="false"]').exists()).toBe(true)
    })

    it('handles null defaultValue', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: null }
      })
      expect(wrapper.find('.v-input--checkbox').exists()).toBe(true)
    })

    it('handles rapid state changes', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      const slot = wrapper.find('.v-input__control .v-input__slot')

      // Rapid clicks
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)
      slot.trigger(CONSTANTS.EVENT_TYPES.CLICK)

      const events = wrapper.emitted()[CONSTANTS.CUSTOM_EVENTS.INPUT]
      expect(events.length).toBe(4)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify
      })
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('preserves state during lifecycle', async () => {
      const wrapper = mount(KCheckbox, {
        localVue,
        vuetify,
        propsData: { defaultValue: true }
      })
      const initialState = wrapper.find('input[aria-checked="true"]').exists()

      await wrapper.vm.$nextTick()
      const afterTickState = wrapper.find('input[aria-checked="true"]').exists()

      expect(initialState).toBe(afterTickState)
    })
  })
})
