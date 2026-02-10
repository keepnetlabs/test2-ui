import { createLocalVue, shallowMount } from '@vue/test-utils'
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup.vue'
import Vuetify from 'vuetify'

describe('KButtonRadioGroup.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(KButtonRadioGroup, {
      localVue,
      vuetify,
      propsData: {
        items: [
            { label: 'Option 1', infoText: 'Info 1' },
            { label: 'Option 2', infoText: 'Info 2' }
        ],
        ...propsData
      },
      stubs: {
        'v-btn': {
            template: '<button class="v-btn-stub" @click="$emit(\'click\')"><slot/></button>'
        },
        'v-icon': {
            template: '<span class="v-icon-stub"><slot/></span>'
        }
      }
    })
  }

  it('renders items correctly', () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAll('.v-btn-stub')
    expect(btns.length).toBe(2)
    expect(btns.at(0).text()).toContain('Option 1')
  })

  it('selects item on click', () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAll('.v-btn-stub')
    
    // Click second item
    btns.at(1).trigger('click')
    
    expect(wrapper.vm.selectedIndex).toBe(1)
    expect(wrapper.emitted('input')[0]).toEqual([1])
    expect(wrapper.emitted('on-item-click')[0]).toEqual([{ label: 'Option 2', infoText: 'Info 2' }])
  })

  it('updates selection when prop changes', async () => {
    const wrapper = mountComponent({ value: 0 })
    expect(wrapper.vm.selectedIndex).toBe(0)
    
    await wrapper.setProps({ value: 1 })
    expect(wrapper.vm.selectedIndex).toBe(1)
  })

  it('shows info text for selected item', async () => {
    const wrapper = mountComponent({ value: 0 })
    expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 1')
    
    await wrapper.setProps({ value: 1 })
    expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
  })

  it('sets isSelected correctly', () => {
    const wrapper = mountComponent({ value: 1 })
    expect(wrapper.vm.isSelected(1)).toBe(true)
    expect(wrapper.vm.isSelected(0)).toBe(false)
  })

  it('emits input event with correct index', () => {
    const wrapper = mountComponent()
    const btns = wrapper.findAll('.v-btn-stub')

    btns.at(0).trigger('click')
    expect(wrapper.emitted('input')[0]).toEqual([0])
  })

  it('handles multiple items correctly', () => {
    const items = Array.from({ length: 4 }, (_, i) => ({ label: `Item ${i + 1}`, infoText: `Info ${i + 1}` }))
    const wrapper = mountComponent({ items })

    expect(wrapper.findAll('.v-btn-stub').length).toBe(4)
  })

  it('renders info text correctly', () => {
    const wrapper = mountComponent({ value: 0 })
    const infoText = wrapper.find('.k-button-radio-group__info')

    expect(infoText.text()).toBe('Info 1')
  })

  it('handles selection state updates', async () => {
    const wrapper = mountComponent({ value: 0 })
    expect(wrapper.vm.selectedIndex).toBe(0)

    await wrapper.setProps({ value: 1 })
    expect(wrapper.vm.selectedIndex).toBe(1)
    expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
  })

  describe('Component Rendering', () => {
    it('renders radio button group', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders all items as buttons', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.v-btn-stub').length).toBe(2)
    })

    it('displays correct item labels', () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')
      expect(btns.at(0).text()).toContain('Option 1')
      expect(btns.at(1).text()).toContain('Option 2')
    })
  })

  describe('Item Selection', () => {
    it('selects first item by default', () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.vm.selectedIndex).toBe(0)
    })

    it('selects item on click', async () => {
      const wrapper = mountComponent()
      await wrapper.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper.vm.selectedIndex).toBe(1)
    })

    it('identifies selected item correctly', () => {
      const wrapper = mountComponent({ value: 1 })
      expect(wrapper.vm.isSelected(1)).toBe(true)
      expect(wrapper.vm.isSelected(0)).toBe(false)
    })

    it('updates selected index on prop change', async () => {
      const wrapper = mountComponent({ value: 0 })
      await wrapper.setProps({ value: 1 })
      expect(wrapper.vm.selectedIndex).toBe(1)
    })
  })

  describe('Event Emission', () => {
    it('emits input event on selection', async () => {
      const wrapper = mountComponent()
      await wrapper.findAll('.v-btn-stub').at(0).trigger('click')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('emits input with correct index', async () => {
      const wrapper = mountComponent()
      await wrapper.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper.emitted('input')[0]).toEqual([1])
    })

    it('emits on-item-click event', async () => {
      const wrapper = mountComponent()
      await wrapper.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper.emitted('on-item-click')).toBeTruthy()
    })

    it('emits on-item-click with correct item', async () => {
      const wrapper = mountComponent()
      await wrapper.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper.emitted('on-item-click')[0]).toEqual([{ label: 'Option 2', infoText: 'Info 2' }])
    })
  })

  describe('Info Text Display', () => {
    it('shows info text for first item', () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 1')
    })

    it('shows info text for selected item', async () => {
      const wrapper = mountComponent({ value: 0 })
      await wrapper.setProps({ value: 1 })
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
    })

    it('updates info text on selection change', async () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 1')

      await wrapper.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
    })
  })

  describe('Multiple Items', () => {
    it('renders multiple items correctly', () => {
      const items = [
        { label: 'Item 1', infoText: 'Info 1' },
        { label: 'Item 2', infoText: 'Info 2' },
        { label: 'Item 3', infoText: 'Info 3' },
        { label: 'Item 4', infoText: 'Info 4' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.findAll('.v-btn-stub').length).toBe(4)
    })

    it('selects from multiple items', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        label: `Item ${i + 1}`,
        infoText: `Info ${i + 1}`
      }))
      const wrapper = mountComponent({ items })
      expect(wrapper.findAll('.v-btn-stub').length).toBe(5)
    })

    it('handles item with many options', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        label: `Option ${i + 1}`,
        infoText: `Description ${i + 1}`
      }))
      const wrapper = mountComponent({ items, value: 5 })
      expect(wrapper.vm.selectedIndex).toBe(5)
    })
  })

  describe('Props Handling', () => {
    it('accepts items prop', () => {
      const items = [{ label: 'A', infoText: 'A info' }]
      const wrapper = mountComponent({ items })
      expect(wrapper.props('items')).toEqual(items)
    })

    it('accepts value prop', () => {
      const wrapper = mountComponent({ value: 1 })
      expect(wrapper.props('value')).toBe(1)
    })

    it('handles prop updates', async () => {
      const wrapper = mountComponent({ value: 0 })
      await wrapper.setProps({ value: 1 })
      expect(wrapper.props('value')).toBe(1)
    })
  })

  describe('Item Structure', () => {
    it('expects items with label', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('items')[0].label).toBe('Option 1')
    })

    it('expects items with infoText', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('items')[0].infoText).toBe('Info 1')
    })

    it('handles item properties correctly', () => {
      const items = [
        { label: 'Test', infoText: 'Test info' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.props('items')[0].label).toBe('Test')
      expect(wrapper.props('items')[0].infoText).toBe('Test info')
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('handles multiple click events', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(0).trigger('click')
      await btns.at(1).trigger('click')

      const events = wrapper.emitted('input')
      expect(events.length).toBe(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles single item', () => {
      const wrapper = mountComponent({
        items: [{ label: 'Only', infoText: 'Only info' }]
      })
      expect(wrapper.findAll('.v-btn-stub').length).toBe(1)
    })

    it('handles empty info text', () => {
      const wrapper = mountComponent({
        items: [{ label: 'Item', infoText: '' }]
      })
      expect(wrapper.props('items')[0].infoText).toBe('')
    })

    it('handles long label text', () => {
      const longLabel = 'This is a very long label text'
      const wrapper = mountComponent({
        items: [{ label: longLabel, infoText: 'Info' }]
      })
      expect(wrapper.find('.v-btn-stub').text()).toContain(longLabel)
    })
  })
})
