import { shallowMount, createLocalVue } from '@vue/test-utils'
import SelectClickOnlyPageModal from '@/components/LandingPage/SelectClickOnlyPageModal.vue'

const localVue = createLocalVue()

describe('SelectClickOnlyPageModal.spec.js', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  const createWrapper = (propsData = {}) => {
    return shallowMount(SelectClickOnlyPageModal, {
      localVue,
      propsData: {
        status: false,
        ...propsData
      },
      stubs: {
        VNavigationDrawer: { template: '<div><slot /></div>' },
        VIcon: true,
        VBtn: true,
        LandingPageTemplateListPreview: true,
        ConfigureCompanyStepHeader: true
      },
      directives: {
        'click-outside': jest.fn()
      }
    })
  }

  it('renders nothing when status is false', () => {
    const wrapper = createWrapper({ status: false })
    expect(wrapper.vm.isVisible).toBe(false)
  })

  it('sets isVisible to true when status becomes true', async () => {
    const wrapper = createWrapper({ status: false })
    await wrapper.setProps({ status: true })
    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.vm.isJustOpened).toBe(true)
  })

  it('emits add event when handleAddTemplate is called with selectedResourceId', () => {
    const wrapper = createWrapper({ status: true })
    wrapper.setData({ isVisible: true, selectedResourceId: 'res-1' })
    
    // Mock getSelectedPageIndex
    wrapper.vm.getSelectedPageIndex = jest.fn(() => 0)
    
    wrapper.vm.handleAddTemplate()
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['res-1', 0])
  })

  it('calls closeDrawer when handleClose is called', () => {
    const wrapper = createWrapper()
    const spy = jest.spyOn(wrapper.vm, 'closeDrawer')
    wrapper.vm.handleClose()
    expect(spy).toHaveBeenCalled()
  })
})
