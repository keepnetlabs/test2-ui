import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal.vue'

describe('TargetUserLDAPImportModal.vue (render branches)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetUserLDAPImportModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppModal: {
          template: '<div><slot name="overlay-body" /><slot name="overlay-footer" /></div>'
        },
        ConfigureCompanyStepHeader: true,
        TargetUserLDAPImportModalStep1: {
          name: 'TargetUserLDAPImportModalStep1',
          template: '<div class="step1-stub" />'
        },
        TargetUserLDAPImportModalStep2: {
          name: 'TargetUserLDAPImportModalStep2',
          template: '<div class="step2-stub" />'
        },
        TargetUserLDAPModalStepperFooter: {
          name: 'TargetUserLDAPModalStepperFooter',
          template: '<div class="footer-stub" />'
        },
        VStepper: { template: '<div><slot /></div>' },
        VStepperHeader: { template: '<div><slot /></div>' },
        VStepperStep: { template: '<div><slot /></div>' },
        VDivider: true,
        VStepperItems: { template: '<div><slot /></div>' },
        VStepperContent: { template: '<div><slot /></div>' }
      }
    })

  it('renders step1 first and only mounts step2 content when step becomes 2', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.step1-stub').exists()).toBe(true)
    expect(wrapper.find('.step2-stub').exists()).toBe(false)

    await wrapper.setData({ step: 2 })

    expect(wrapper.find('.step2-stub').exists()).toBe(true)
  })

  it('decrements step when step2 emits on-error', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ step: 2 })

    wrapper.findComponent({ name: 'TargetUserLDAPImportModalStep2' }).vm.$emit('on-error')

    expect(wrapper.vm.step).toBe(1)
  })
})
