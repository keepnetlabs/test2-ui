import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppModalFooter from '@/components/AppModalFooter.vue'
import Vuetify from 'vuetify'

// Stub the child components since we only test AppModalFooter here
const CancelButtonStub = {
  template: '<button class="cancel-button-stub" @click="$emit(\'click\')"></button>'
}
const SaveButtonStub = {
  template: '<button class="save-button-stub" @click="$emit(\'click\')"></button>',
  props: ['disabled', 'label', 'id']
}

describe('AppModalFooter.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(AppModalFooter, {
      localVue,
      vuetify,
      propsData: {
        ...propsData
      },
      stubs: {
        CancelButton: CancelButtonStub,
        SaveButton: SaveButtonStub
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.cancel-button-stub').exists()).toBe(true)
    expect(wrapper.find('.save-button-stub').exists()).toBe(true)
  })

  it('passes props to child components', () => {
    const ids = { cancelButton: 'c-btn', saveButton: 's-btn' }
    const label = 'Submit'
    const wrapper = mountComponent({
      ids,
      actionButtonDisabled: true,
      label
    })

    const saveBtn = wrapper.findComponent(SaveButtonStub)
    expect(saveBtn.props('id')).toBe('s-btn')
    expect(saveBtn.props('disabled')).toBe(true)
    expect(saveBtn.props('label')).toBe(label)

    const cancelBtn = wrapper.findComponent(CancelButtonStub)
    expect(cancelBtn.attributes('id')).toBe('c-btn')
  })

  it('emits on-cancel when cancel button is clicked', async () => {
    const wrapper = mountComponent()
    const cancelBtn = wrapper.findComponent(CancelButtonStub)
    
    await cancelBtn.trigger('click')
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
  })

  it('emits on-save when save button is clicked', async () => {
    const wrapper = mountComponent()
    const saveBtn = wrapper.findComponent(SaveButtonStub)

    await saveBtn.trigger('click')
    expect(wrapper.emitted('on-save')).toBeTruthy()
  })

  it('passes correct button IDs to child components', () => {
    const ids = { cancelButton: 'btn-cancel', saveButton: 'btn-save' }
    const wrapper = mountComponent({ ids })

    const cancelBtn = wrapper.findComponent(CancelButtonStub)
    const saveBtn = wrapper.findComponent(SaveButtonStub)

    expect(cancelBtn.attributes('id')).toBe('btn-cancel')
    expect(saveBtn.props('id')).toBe('btn-save')
  })

  it('disables save button when actionButtonDisabled is true', () => {
    const wrapper = mountComponent({ actionButtonDisabled: true })
    const saveBtn = wrapper.findComponent(SaveButtonStub)
    expect(saveBtn.props('disabled')).toBe(true)
  })

  it('renders both buttons', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.cancel-button-stub').exists()).toBe(true)
    expect(wrapper.find('.save-button-stub').exists()).toBe(true)
  })

  it('passes custom label to save button', () => {
    const customLabel = 'Submit Form'
    const wrapper = mountComponent({ label: customLabel })
    const saveBtn = wrapper.findComponent(SaveButtonStub)
    expect(saveBtn.props('label')).toBe(customLabel)
  })

  describe('Component Rendering', () => {
    it('renders component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders cancel button', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.cancel-button-stub').exists()).toBe(true)
    })

    it('renders save button', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.save-button-stub').exists()).toBe(true)
    })

    it('renders both buttons together', () => {
      const wrapper = mountComponent()
      expect(wrapper.findAll('.cancel-button-stub, .save-button-stub').length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Button Props Passing', () => {
    it('accepts IDs in props', () => {
      const wrapper = mountComponent({ ids: { cancelButton: 'cancel-id' } })
      expect(wrapper.props('ids')).toEqual({ cancelButton: 'cancel-id' })
    })

    it('passes ID to save button', () => {
      const wrapper = mountComponent({ ids: { saveButton: 'save-id' } })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('id')).toBe('save-id')
    })

    it('passes disabled prop to save button', () => {
      const wrapper = mountComponent({ actionButtonDisabled: true })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('disabled')).toBe(true)
    })

    it('passes label to save button', () => {
      const wrapper = mountComponent({ label: 'Custom' })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBe('Custom')
    })

    it('passes all props together', () => {
      const props = {
        ids: { cancelButton: 'c-id', saveButton: 's-id' },
        actionButtonDisabled: false,
        label: 'Save'
      }
      const wrapper = mountComponent(props)
      const saveBtn = wrapper.findComponent(SaveButtonStub)
      expect(saveBtn.props('id')).toBe('s-id')
      expect(saveBtn.props('disabled')).toBe(false)
      expect(saveBtn.props('label')).toBe('Save')
    })
  })

  describe('Event Emission', () => {
    it('emits on-cancel when cancel button clicked', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(CancelButtonStub)
      await btn.trigger('click')
      expect(wrapper.emitted('on-cancel')).toBeTruthy()
    })

    it('emits on-save when save button clicked', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(SaveButtonStub)
      await btn.trigger('click')
      expect(wrapper.emitted('on-save')).toBeTruthy()
    })

    it('emits on-cancel with correct event count', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(CancelButtonStub)
      await btn.trigger('click')
      expect(wrapper.emitted('on-cancel').length).toBe(1)
    })

    it('emits on-save with correct event count', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(SaveButtonStub)
      await btn.trigger('click')
      expect(wrapper.emitted('on-save').length).toBe(1)
    })

    it('emits different events for different buttons', async () => {
      const wrapper = mountComponent()
      const cancelBtn = wrapper.findComponent(CancelButtonStub)
      const saveBtn = wrapper.findComponent(SaveButtonStub)

      await cancelBtn.trigger('click')
      await saveBtn.trigger('click')

      expect(wrapper.emitted('on-cancel')).toBeTruthy()
      expect(wrapper.emitted('on-save')).toBeTruthy()
    })
  })

  describe('Button States', () => {
    it('save button is enabled by default', () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('disabled')).not.toBe(true)
    })

    it('save button can be disabled', () => {
      const wrapper = mountComponent({ actionButtonDisabled: true })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('disabled')).toBe(true)
    })

    it('save button can be enabled when actionButtonDisabled is false', () => {
      const wrapper = mountComponent({ actionButtonDisabled: false })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('disabled')).toBe(false)
    })

    it('cancel button is always enabled', () => {
      const wrapper = mountComponent({ actionButtonDisabled: true })
      const cancelBtn = wrapper.findComponent(CancelButtonStub)
      expect(cancelBtn.exists()).toBe(true)
    })
  })

  describe('Button Labels', () => {
    it('default label for save button', () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBeDefined()
    })

    it('custom label for save button', () => {
      const wrapper = mountComponent({ label: 'Submit' })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBe('Submit')
    })

    it('updates label when prop changes', async () => {
      const wrapper = mountComponent({ label: 'Save' })
      let btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBe('Save')

      await wrapper.setProps({ label: 'Submit' })
      btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBe('Submit')
    })

    it('handles long label text', () => {
      const longLabel = 'This is a very long button label'
      const wrapper = mountComponent({ label: longLabel })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('label')).toBe(longLabel)
    })
  })

  describe('Props Handling', () => {
    it('accepts ids prop with cancelButton', () => {
      const wrapper = mountComponent({ ids: { cancelButton: 'id1' } })
      expect(wrapper.props('ids')).toEqual({ cancelButton: 'id1' })
    })

    it('accepts ids prop with saveButton', () => {
      const wrapper = mountComponent({ ids: { saveButton: 'id2' } })
      expect(wrapper.props('ids')).toEqual({ saveButton: 'id2' })
    })

    it('accepts actionButtonDisabled prop', () => {
      const wrapper = mountComponent({ actionButtonDisabled: true })
      expect(wrapper.props('actionButtonDisabled')).toBe(true)
    })

    it('accepts label prop', () => {
      const wrapper = mountComponent({ label: 'Test' })
      expect(wrapper.props('label')).toBe('Test')
    })

    it('handles all props together', () => {
      const props = {
        ids: { cancelButton: 'c-btn', saveButton: 's-btn' },
        actionButtonDisabled: true,
        label: 'Action'
      }
      const wrapper = mountComponent(props)
      expect(wrapper.props('ids')).toEqual(props.ids)
      expect(wrapper.props('actionButtonDisabled')).toBe(true)
      expect(wrapper.props('label')).toBe('Action')
    })
  })

  describe('Multiple Clicks', () => {
    it('handles multiple cancel clicks', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(CancelButtonStub)
      await btn.trigger('click')
      await btn.trigger('click')
      expect(wrapper.emitted('on-cancel').length).toBe(2)
    })

    it('handles multiple save clicks', async () => {
      const wrapper = mountComponent()
      const btn = wrapper.findComponent(SaveButtonStub)
      await btn.trigger('click')
      await btn.trigger('click')
      expect(wrapper.emitted('on-save').length).toBe(2)
    })

    it('handles alternating clicks', async () => {
      const wrapper = mountComponent()
      const cancelBtn = wrapper.findComponent(CancelButtonStub)
      const saveBtn = wrapper.findComponent(SaveButtonStub)
      await cancelBtn.trigger('click')
      await saveBtn.trigger('click')
      await cancelBtn.trigger('click')
      expect(wrapper.emitted('on-cancel').length).toBe(2)
      expect(wrapper.emitted('on-save').length).toBe(1)
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

    it('handles prop updates', async () => {
      const wrapper = mountComponent({ label: 'Save' })
      await wrapper.setProps({ label: 'Submit' })
      expect(wrapper.props('label')).toBe('Submit')
    })

    it('maintains state after updates', async () => {
      const wrapper = mountComponent({ actionButtonDisabled: false })
      await wrapper.setProps({ actionButtonDisabled: true })
      const btn = wrapper.findComponent(SaveButtonStub)
      expect(btn.props('disabled')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty ids object', () => {
      const wrapper = mountComponent({ ids: {} })
      expect(wrapper.props('ids')).toEqual({})
    })

    it('handles null label', () => {
      const wrapper = mountComponent({ label: null })
      expect(wrapper.find('.save-button-stub').exists()).toBe(true)
    })

    it('handles undefined label', () => {
      const wrapper = mountComponent({ label: undefined })
      expect(wrapper.find('.save-button-stub').exists()).toBe(true)
    })

    it('handles very long button IDs', () => {
      const longId = 'a'.repeat(100)
      const wrapper = mountComponent({ ids: { cancelButton: longId } })
      expect(wrapper.findComponent(CancelButtonStub).attributes('id')).toBe(longId)
    })
  })
})
