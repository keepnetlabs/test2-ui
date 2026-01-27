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
})
