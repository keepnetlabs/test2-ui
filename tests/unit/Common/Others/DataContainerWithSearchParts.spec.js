import { shallowMount } from '@vue/test-utils'
import DataContainerWithSearchInput from '@/components/Common/Others/DataContainerWithSearchInput.vue'
import DataContainerWithSearchItem from '@/components/Common/Others/DataContainerWithSearchItem.vue'
import MailConfigurationSelectItem from '@/components/Common/Others/MailConfigurationSelectItem.vue'

describe('DataContainerWithSearchInput.vue', () => {
  it('computes disabled state and emits on-add-click when valid', async () => {
    const wrapper = shallowMount(DataContainerWithSearchInput, {
      propsData: {
        inputValue: 'example.com'
      },
      stubs: {
        FormGroup: true,
        'v-form': true,
        'v-text-field': true,
        'v-btn': true,
        'v-icon': true
      }
    })

    expect(wrapper.vm.$options.name).toBe('DataContainerWithSearchInput')
    expect(wrapper.vm.isButtonDisabled).toBe(false)

    wrapper.vm.$refs.refForm = {
      validate: jest.fn(() => true),
      resetValidation: jest.fn()
    }

    wrapper.vm.handleAddClick()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('on-add-click')).toBeTruthy()
    expect(wrapper.vm.$refs.refForm.resetValidation).toHaveBeenCalled()
  })
})

describe('DataContainerWithSearchItem.vue', () => {
  it('validates, styles and emits input on save', () => {
    const wrapper = shallowMount(DataContainerWithSearchItem, {
      propsData: {
        value: 'example.com',
        textFieldRules: [(v) => !!v || 'Required']
      },
      stubs: {
        'v-form': true,
        'v-text-field': true,
        'v-tooltip': true,
        'v-icon': true,
        'v-btn': true
      }
    })

    expect(wrapper.vm.$options.name).toBe('DataContainerWithSearchItem')
    expect(wrapper.vm.isValid).toBe(true)
    expect(wrapper.vm.getStyle.height).toBe('48px')

    wrapper.vm.$refs.refForm = { validate: jest.fn(() => true) }
    wrapper.vm.textFieldValue = 'changed.com'
    wrapper.vm.handleActionButtonClick()

    expect(wrapper.emitted('input')).toEqual([['changed.com', 'example.com', undefined]])
  })

  it('marks invalid style and returns first validation error', () => {
    const wrapper = shallowMount(DataContainerWithSearchItem, {
      propsData: {
        value: '',
        textFieldRules: [(v) => !!v || 'Required']
      },
      stubs: {
        'v-form': true,
        'v-text-field': true,
        'v-tooltip': true,
        'v-icon': true,
        'v-btn': true
      }
    })

    expect(wrapper.vm.isValid).toBeFalsy()
    expect(wrapper.vm.getStyle.backgroundColor).toBe('#FEF7F7')
    expect(wrapper.vm.getValidationErrorMessage('')).toBe('Required')
  })
})

describe('MailConfigurationSelectItem.vue', () => {
  it('renders with props and exposes defaults', () => {
    const wrapper = shallowMount(MailConfigurationSelectItem, {
      propsData: {
        item: {
          mailConfigurationName: 'All'
        },
        isWithTooltip: false
      },
      stubs: {
        Badge: true,
        'v-tooltip': true,
        'v-checkbox': true,
        'v-btn': true
      }
    })

    expect(wrapper.vm.$options.name).toBe('MailConfigurationSelectItem')
    expect(wrapper.vm.badgeColor).toBe('#217124')
    expect(wrapper.vm.badgeText).toBe('Running')
    expect(wrapper.text()).toContain('All Configurations')
  })
})
