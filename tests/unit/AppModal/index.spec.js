import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppModal from '@/components/AppModal.vue'
import Vuetify from 'vuetify'

describe('AppModal.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    // Reset document body/html styles if needed
    document.querySelector('html').style.overflowY = ''
  })

  const mountComponent = (propsData = {}, slots = {}) => {
    return shallowMount(AppModal, {
      localVue,
      vuetify,
      propsData: {
        status: true, // Default to open for most tests
        ...propsData
      },
      slots: {
        ...slots
      }
    })
  }

  it('renders when status is true', () => {
    const wrapper = mountComponent({ status: true })
    expect(wrapper.find('v-overlay-stub').exists()).toBe(true)
  })

  it('does not render when status is false', () => {
    const wrapper = mountComponent({ status: false })
    // When root element is v-if=false, wrapper exists but contains comment node
    expect(wrapper.isEmpty()).toBe(true)
  })

  it('renders title and icon correctly', () => {
    const wrapper = mountComponent({ 
      title: 'Modal Title',
      iconName: 'mdi-test',
      titleId: 'title-id'
    })
    
    // Use stub selectors
    expect(wrapper.text()).toContain('Modal Title')
    const titleStub = wrapper.find('v-list-item-title-stub')
    // Attributes passed to component should be on stub
    expect(titleStub.attributes('id')).toBe('title-id')
    
    const icon = wrapper.find('v-icon-stub')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('mdi-test')
  })

  it('emits closeOverlay event when cancel button clicked', async () => {
    const wrapper = mountComponent()
    // Find all btn stubs and assume first/specific one based on class
    const cancelBtn = wrapper.findAll('v-btn-stub').filter(w => w.classes('k-overlay__btn-cancel')).at(0)
    expect(cancelBtn.exists()).toBe(true)
    
    // Trigger click on the stub component
    cancelBtn.vm.$emit('click')
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })

  it('emits submit event when confirm button clicked', async () => {
    const wrapper = mountComponent()
    const saveBtn = wrapper.findAll('v-btn-stub').filter(w => w.classes('k-overlay__btn-save')).at(0)
    expect(saveBtn.exists()).toBe(true)
    
    saveBtn.vm.$emit('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('disabled submit button when saveDisable is true', () => {
    const wrapper = mountComponent({ saveDisable: true })
    const saveBtn = wrapper.findAll('v-btn-stub').filter(w => w.classes('k-overlay__btn-save')).at(0)
    // Check prop because it is passed to v-btn component
    expect(saveBtn.props('disabled')).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mountComponent({}, {
      'overlay-body': '<div class="body-content">Body</div>',
      'overlay-footer': '<div class="footer-content">Footer</div>'
    })
    
    expect(wrapper.find('.body-content').exists()).toBe(true)
    expect(wrapper.find('.footer-content').exists()).toBe(true)
    // Buttons should be gone
    const cancelBtn = wrapper.findAll('v-btn-stub').filter(w => w.classes('k-overlay__btn-cancel'))
    expect(cancelBtn.length).toBe(0)
  })

  it('applies custom footer class', () => {
    const wrapper = mountComponent({ footerClass: 'my-custom-class' })
    const footerDiv = wrapper.find('.k-overlay__footer')
    expect(footerDiv.classes()).toContain('my-custom-class')
  })

  it('hides header when showHeader is false', () => {
    const wrapper = mountComponent({ showHeader: false })
    expect(wrapper.find('.k-overlay__header').exists()).toBe(false)
  })

  it('hides footer when showFooter is false', () => {
    const wrapper = mountComponent({ showFooter: false })
    expect(wrapper.find('.k-overlay__footer').exists()).toBe(false)
  })
})
