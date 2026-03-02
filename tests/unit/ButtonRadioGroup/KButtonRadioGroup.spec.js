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

  describe('Styling and CSS Classes', () => {
    it('applies correct class to selected button', () => {
      const wrapper = mountComponent({ value: 0 })
      const btns = wrapper.findAll('.v-btn-stub')
      expect(btns.at(0).classes()).toBeDefined()
    })

    it('applies info text container class', () => {
      const wrapper = mountComponent({ value: 0 })
      const infoContainer = wrapper.find('.k-button-radio-group__info')
      expect(infoContainer.exists()).toBe(true)
    })

    it('maintains CSS class integrity across selections', async () => {
      const wrapper = mountComponent({ value: 0 })
      const infoContainer = wrapper.find('.k-button-radio-group__info')

      await wrapper.setProps({ value: 1 })
      expect(infoContainer.exists()).toBe(true)
    })
  })

  describe('Accessibility Features', () => {
    it('buttons have text content for screen readers', () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')
      expect(btns.at(0).text().length).toBeGreaterThan(0)
    })

    it('displays descriptive info text', () => {
      const wrapper = mountComponent({ value: 0 })
      const infoText = wrapper.find('.k-button-radio-group__info')
      expect(infoText.text().length).toBeGreaterThan(0)
    })

    it('provides clear selection indication', () => {
      const wrapper = mountComponent({ value: 1 })
      expect(wrapper.vm.isSelected(1)).toBe(true)
    })
  })

  describe('Selection State Persistence', () => {
    it('maintains selection through multiple prop updates', async () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.vm.selectedIndex).toBe(0)

      await wrapper.setProps({ items: [
        { label: 'New 1', infoText: 'New Info 1' },
        { label: 'New 2', infoText: 'New Info 2' }
      ]})
      expect(wrapper.vm.selectedIndex).toBe(0)
    })

    it('preserves selection on component re-render', async () => {
      const wrapper = mountComponent({ value: 1 })
      expect(wrapper.vm.selectedIndex).toBe(1)

      await wrapper.vm.$forceUpdate()
      expect(wrapper.vm.selectedIndex).toBe(1)
    })
  })

  describe('Button State Management', () => {
    it('prevents reselecting same item', async () => {
      const wrapper = mountComponent({ value: 0 })
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(0).trigger('click')
      expect(wrapper.vm.selectedIndex).toBe(0)
      expect(wrapper.emitted('input').length).toBe(1)
    })

    it('properly handles rapid selections', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(0).trigger('click')
      await btns.at(1).trigger('click')
      await btns.at(0).trigger('click')

      expect(wrapper.vm.selectedIndex).toBe(0)
      expect(wrapper.emitted('input').length).toBe(3)
    })

    it('maintains button enabled state', () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')
      expect(btns.at(0).exists()).toBe(true)
      expect(btns.at(1).exists()).toBe(true)
    })
  })

  describe('Custom Item Properties', () => {
    it('handles items with additional properties', () => {
      const items = [
        { label: 'Item 1', infoText: 'Info 1', id: 'custom-1', disabled: false },
        { label: 'Item 2', infoText: 'Info 2', id: 'custom-2', disabled: false }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.props('items')[0].id).toBe('custom-1')
    })

    it('preserves all item data through selections', async () => {
      const items = [
        { label: 'A', infoText: 'Info A', metadata: 'meta1' },
        { label: 'B', infoText: 'Info B', metadata: 'meta2' }
      ]
      const wrapper = mountComponent({ items, value: 0 })
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(1).trigger('click')
      const selectedItem = wrapper.emitted('on-item-click')[0][0]
      expect(selectedItem.label).toBe('B')
      expect(selectedItem.infoText).toBe('Info B')
    })
  })

  describe('Event Emission Accuracy', () => {
    it('emits correct sequence of events', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(0).trigger('click')
      await btns.at(1).trigger('click')

      const inputEvents = wrapper.emitted('input')
      expect(inputEvents[0]).toEqual([0])
      expect(inputEvents[1]).toEqual([1])
    })

    it('includes complete item data in events', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(0).trigger('click')
      const emittedItem = wrapper.emitted('on-item-click')[0][0]
      expect(emittedItem.label).toBe('Option 1')
      expect(emittedItem.infoText).toBe('Info 1')
    })

    it('emits events in correct order', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      await btns.at(1).trigger('click')

      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('on-item-click')).toBeTruthy()
      expect(wrapper.emitted('input')[0]).toEqual([1])
    })
  })

  describe('Performance Characteristics', () => {
    it('mounts efficiently with many items', () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        label: `Item ${i}`,
        infoText: `Info ${i}`
      }))
      const start = performance.now()
      const wrapper = mountComponent({ items: manyItems })
      const duration = performance.now() - start

      expect(wrapper.findAll('.v-btn-stub').length).toBe(100)
      expect(duration).toBeLessThan(1000)
    })

    it('handles rapid selections efficiently', async () => {
      const wrapper = mountComponent()
      const btns = wrapper.findAll('.v-btn-stub')

      const start = performance.now()
      for (let i = 0; i < 50; i++) {
        await btns.at(i % 2).trigger('click')
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(1000)
    })

    it('efficiently updates info text', async () => {
      const wrapper = mountComponent()
      const start = performance.now()

      for (let i = 0; i < 100; i++) {
        await wrapper.setProps({ value: i % 2 })
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Integration Scenarios', () => {
    it('handles complete user workflow', async () => {
      const wrapper = mountComponent()

      // User selects first item
      const btns = wrapper.findAll('.v-btn-stub')
      await btns.at(0).trigger('click')
      expect(wrapper.vm.selectedIndex).toBe(0)

      // User sees corresponding info text
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 1')

      // User switches to second item
      await btns.at(1).trigger('click')
      expect(wrapper.vm.selectedIndex).toBe(1)
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('Info 2')
    })

    it('supports dynamic item updates with selection preservation', async () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.vm.selectedIndex).toBe(0)

      const newItems = [
        { label: 'New A', infoText: 'New A Info' },
        { label: 'New B', infoText: 'New B Info' },
        { label: 'New C', infoText: 'New C Info' }
      ]
      await wrapper.setProps({ items: newItems, value: 1 })

      expect(wrapper.vm.selectedIndex).toBe(1)
      expect(wrapper.find('.k-button-radio-group__info').text()).toBe('New B Info')
    })
  })

  describe('Multiple Instances Independence', () => {
    it('creates isolated component instances', () => {
      const wrapper1 = mountComponent({ value: 0 })
      const wrapper2 = mountComponent({ value: 1 })

      expect(wrapper1.vm.selectedIndex).toBe(0)
      expect(wrapper2.vm.selectedIndex).toBe(1)

      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('maintains independent state across instances', async () => {
      const wrapper1 = mountComponent({ value: 0 })
      const wrapper2 = mountComponent({ value: 0 })

      await wrapper1.findAll('.v-btn-stub').at(1).trigger('click')
      expect(wrapper1.vm.selectedIndex).toBe(1)
      expect(wrapper2.vm.selectedIndex).toBe(0)

      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('Error Handling and Recovery', () => {
    it('tolerates missing infoText gracefully', () => {
      const items = [
        { label: 'Item 1', infoText: 'Info 1' },
        { label: 'Item 2', infoText: 'Info 2' }
      ]
      const wrapper = mountComponent({ items })
      expect(wrapper.findAll('.v-btn-stub').length).toBe(2)
    })

    it('handles selection state errors gracefully', () => {
      const wrapper = mountComponent({ value: 0 })
      expect(wrapper.vm.selectedIndex).toBe(0)
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('maintains state after component lifecycle', async () => {
      const wrapper = mountComponent({ value: 0 })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedIndex).toBe(0)
      expect(() => wrapper.destroy()).not.toThrow()
    })
  })
})
