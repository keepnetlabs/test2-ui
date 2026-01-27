import { createLocalVue, shallowMount } from '@vue/test-utils'
import ScheduledReportsActivationDialog from '@/components/ScheduledReportsActivationDialog.vue'
import { setSchedulingReportStatus } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  setSchedulingReportStatus: jest.fn()
}))

// Mock mixin if necessary, or let it load if simply providing methods
// useResend probably provides resend logic, but likely not blocking.

describe('ScheduledReportsActivationDialog.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(ScheduledReportsActivationDialog, {
      localVue,
      propsData: {
        status: true,
        selectedRow: {
            resourceId: '123',
            status: 0 // Inactive
        },
        ...propsData
      },
      stubs: {
        AppDialog: {
            template: '<div><slot name="app-dialog-body"/><slot name="app-dialog-footer"/></div>',
            props: ['title', 'icon']
        },
        AppDialogFooter: {
            template: '<div class="footer-stub" @handleConfirm="$emit(\'handleConfirm\')" @handleClose="$emit(\'handleClose\')"></div>',
            props: ['confirmButtonDisabled']
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders confirm activation state correctly', () => {
    const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 } // 0 = Inactive? Code says "if (selectedRow.status) return 'Confirm Inactivation'"
                                                    // Boolean check: 0 is false.
    })
    
    // status false -> "Confirm Activation", "mdi-check-circle"
    const dialog = wrapper.findComponent({ name: 'AppDialogStub' }) // or use normal find
    // Stub props need to be checked if passed?
    // checking computed props directly on vm
    expect(wrapper.vm.getTitle).toBe('Confirm Activation')
    expect(wrapper.vm.getIcon).toBe('mdi-check-circle')
    expect(wrapper.vm.getBody).toContain('action will activate')
  })

  it('renders confirm inactivation state correctly', () => {
    const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 1 } // 1 = Active
    })
    
    expect(wrapper.vm.getTitle).toBe('Confirm Inactivation')
    expect(wrapper.vm.getIcon).toBe('mdi-close-circle')
    expect(wrapper.vm.getBody).toContain('action will inactive')
  })

  it('calls API and closes on confirm', async () => {
    const wrapper = mountComponent({
         selectedRow: { resourceId: '100', status: 1 }
    })
    setSchedulingReportStatus.mockResolvedValue({})
    
    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleConfirm')
    
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    expect(setSchedulingReportStatus).toHaveBeenCalledWith('100', 0) // !1 -> false -> Number(false) -> 0
    
    await wrapper.vm.$nextTick()
    await Promise.resolve() // wait for api
    
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-close')[0]).toEqual([null, true]) // handleClose(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('emits on-close without update on cancel', () => {
    const wrapper = mountComponent()
    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleClose')
    
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-close')[0]).toEqual([null, false]) // handleClose() default false
  })
})
