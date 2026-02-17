import { shallowMount } from '@vue/test-utils'
import AppModalFooter from '@/components/AppModalFooter.vue'

describe('AppModalFooter.vue', () => {
  const mountComponent = (propsData = {}) => shallowMount(AppModalFooter, {
    propsData,
    stubs: {
      CancelButton: {
        name: 'CancelButton',
        props: ['id'],
        template: '<button class="cancel-btn" :id="id" @click="$emit(\'click\')">Cancel</button>'
      },
      SaveButton: {
        name: 'SaveButton',
        props: ['id', 'disabled', 'label'],
        template: '<button class="save-btn" :id="id" :disabled="disabled" @click="$emit(\'click\')">{{ label }}</button>'
      }
    }
  })

  it('passes ids and disabled state to buttons', () => {
    const wrapper = mountComponent({
      ids: { cancelButton: 'btn-cancel', saveButton: 'btn-save' },
      actionButtonDisabled: true,
      label: 'Save now'
    })

    expect(wrapper.find('#btn-cancel').exists()).toBe(true)
    expect(wrapper.find('#btn-save').exists()).toBe(true)
    expect(wrapper.find('#btn-save').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('.save-btn').text()).toBe('Save now')
  })

  it('emits on-cancel and on-save', async () => {
    const wrapper = mountComponent()

    await wrapper.find('.cancel-btn').trigger('click')
    await wrapper.find('.save-btn').trigger('click')

    expect(wrapper.emitted('on-cancel')).toBeTruthy()
    expect(wrapper.emitted('on-save')).toBeTruthy()
  })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('AppModalFooter')
  })
})
