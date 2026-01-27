import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox.vue'
import Vuetify from 'vuetify'

describe('AlertBox.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}, slots = {}) => {
    return shallowMount(AlertBox, {
      localVue,
      vuetify,
      propsData: {
        ...propsData
      },
      slots: {
        ...slots
      }
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = mountComponent()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.alert-box').exists()).toBe(true)
    expect(wrapper.find('.alert-box__default-content').exists()).toBe(true)
    
    // Check v-icon-stub
    const icon = wrapper.find('v-icon-stub')
    expect(icon.exists()).toBe(true)
    // text() of stub should contain slot content (iconName)
    expect(icon.text()).toBe('mdi-alert-circle')
  })

  it('renders provided text', () => {
    const text = 'This is an alert'
    const wrapper = mountComponent({ text })
    expect(wrapper.text()).toContain(text)
  })

  it('applies custom icon and color', () => {
    const props = {
      iconName: 'mdi-check',
      iconColor: 'green'
    }
    const wrapper = mountComponent(props)
    const icon = wrapper.find('v-icon-stub')
    expect(icon.text()).toBe('mdi-check')
    expect(icon.attributes('color')).toBe('green')
  })

  it('renders default slot content', () => {
    const wrapper = mountComponent({}, { default: '<div class="custom-content">My Content</div>' })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('My Content')
  })

  it('renders text slot content override', () => {
    const wrapper = mountComponent({}, { text: '<span>Custom Text Slot</span>' })
    expect(wrapper.html()).toContain('Custom Text Slot')
  })

  it('renders actions when enabled via slots prop', () => {
    const props = {
      slots: {
        primaryAction: true,
        secondaryAction: true
      }
    }
    const slots = {
      primaryAction: '<button class="btn-primary">Ok</button>',
      secondaryAction: '<button class="btn-secondary">Cancel</button>'
    }
    const wrapper = mountComponent(props, slots)
    
    expect(wrapper.find('.alert-box__actions').exists()).toBe(true)
    expect(wrapper.find('.btn-primary').exists()).toBe(true)
    expect(wrapper.find('.btn-secondary').exists()).toBe(true)
  })

  it('does not render actions wrapper if no actions enabled', () => {
    const props = {
      slots: {
        primaryAction: false,
        secondaryAction: false
      }
    }
    const wrapper = mountComponent(props)
    expect(wrapper.find('.alert-box__actions').exists()).toBe(false)
  })

  it('computes hasAction correctly', async () => {
     const wrapper = mountComponent()
     expect(wrapper.vm.hasAction).toBe(false)

     await wrapper.setProps({
       slots: { primaryAction: true }
     })
     expect(wrapper.vm.hasAction).toBe(true)
  })
})
