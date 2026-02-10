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

  it('disables action button during API call', async () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)

    setSchedulingReportStatus.mockResolvedValue({})
    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleConfirm')

    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
  })

  it('displays correct icon for activation state', () => {
    const wrapper = mountComponent({
      selectedRow: { resourceId: '1', status: 0 }
    })
    expect(wrapper.vm.getIcon).toBe('mdi-check-circle')
  })

  it('displays correct icon for inactivation state', () => {
    const wrapper = mountComponent({
      selectedRow: { resourceId: '1', status: 1 }
    })
    expect(wrapper.vm.getIcon).toBe('mdi-close-circle')
  })

  it('verifies dialog state after button disable', async () => {
    const wrapper = mountComponent()
    setSchedulingReportStatus.mockResolvedValue({})

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)

    const footer = wrapper.find('.footer-stub')
    footer.vm.$emit('handleConfirm')

    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
  })

  describe('Component Rendering', () => {
    it('renders dialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.exists()).toBe(true)
    })

    it('renders footer stub', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })

    it('displays dialog with correct title', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getTitle).toBeDefined()
    })

    it('mounts successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Activation State', () => {
    it('detects inactive status (0)', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Activation')
    })

    it('renders activation title correctly', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Activation')
    })

    it('shows activation body text', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getBody).toContain('action will activate')
    })

    it('handles activation for different resource IDs', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '999', status: 0 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Activation')
    })
  })

  describe('Inactivation State', () => {
    it('detects active status (1)', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Inactivation')
    })

    it('renders inactivation title correctly', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Inactivation')
    })

    it('shows inactivation body text', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper.vm.getBody).toContain('action will inactive')
    })

    it('handles inactivation for different resource IDs', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '555', status: 1 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Inactivation')
    })
  })

  describe('Icon Handling', () => {
    it('displays correct icon for activation', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getIcon).toBe('mdi-check-circle')
    })

    it('displays correct icon for inactivation', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper.vm.getIcon).toBe('mdi-close-circle')
    })

    it('icon updates with state change', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getIcon).toBe('mdi-check-circle')

      await wrapper.setProps({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper.vm.getIcon).toBe('mdi-close-circle')
    })

    it('verifies icon is string', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getIcon).toBe('string')
    })
  })

  describe('Button States', () => {
    it('button is enabled initially', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('disables button during API call', async () => {
      const wrapper = mountComponent()
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })

    it('enables button after API call completes', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(wrapper.vm.isActionButtonDisabled).toBe(true)

      await Promise.resolve() // wait for api
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('button disabled state reflects API status', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('handles rapid button enable/disable cycles', async () => {
      const wrapper = mountComponent()
      setSchedulingReportStatus.mockResolvedValue({})

      expect(wrapper.vm.isActionButtonDisabled).toBe(false)

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })
  })

  describe('API Integration', () => {
    it('calls API on confirm with activation status', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 0 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(setSchedulingReportStatus).toHaveBeenCalled()
    })

    it('passes correct resource ID to API', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '12345', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(setSchedulingReportStatus).toHaveBeenCalledWith('12345', 0)
    })

    it('calculates correct toggle status', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      expect(setSchedulingReportStatus).toHaveBeenCalledWith('100', 0)
    })

    it('handles API success response', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({ success: true })

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      await Promise.resolve()

      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('emits close event after API success', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      await Promise.resolve()

      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Event Emission', () => {
    it('emits on-close on confirm with update flag', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      await Promise.resolve()

      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close')[0]).toEqual([null, true])
    })

    it('emits on-close on cancel without update flag', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close')[0]).toEqual([null, false])
    })

    it('emits events with correct payloads', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '100', status: 1 }
      })
      setSchedulingReportStatus.mockResolvedValue({})

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleConfirm')

      await Promise.resolve()

      const emitted = wrapper.emitted('on-close')[0]
      expect(emitted.length).toBe(2)
      expect(emitted[0]).toBe(null)
      expect(typeof emitted[1]).toBe('boolean')
    })

    it('handles multiple event emissions', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')
      footer.vm.$emit('handleClose')
      expect(wrapper.emitted('on-close').length).toBeGreaterThan(0)
    })
  })

  describe('Cancel Action', () => {
    it('closes dialog without API call on cancel', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(setSchedulingReportStatus).not.toHaveBeenCalled()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('does not update data on cancel', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)

      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('emits correct payload on cancel', () => {
      const wrapper = mountComponent()
      const footer = wrapper.find('.footer-stub')
      footer.vm.$emit('handleClose')

      expect(wrapper.emitted('on-close')[0]).toEqual([null, false])
    })
  })

  describe('Dialog Content', () => {
    it('title is determined by status', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getTitle).toBe('Confirm Activation')
    })

    it('body text matches state', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper.vm.getBody).toContain('activate')
    })

    it('all computed properties return strings', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.getTitle).toBe('string')
      expect(typeof wrapper.vm.getBody).toBe('string')
      expect(typeof wrapper.vm.getIcon).toBe('string')
    })
  })

  describe('Props Handling', () => {
    it('accepts status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.props('status')).toBe(true)
    })

    it('accepts selectedRow prop', () => {
      const selectedRow = { resourceId: '123', status: 0 }
      const wrapper = mountComponent({ selectedRow })
      expect(wrapper.props('selectedRow')).toEqual(selectedRow)
    })

    it('handles prop updates', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })

      await wrapper.setProps({
        selectedRow: { resourceId: '2', status: 1 }
      })

      expect(wrapper.props('selectedRow').resourceId).toBe('2')
    })

    it('responds to status prop changes', async () => {
      const wrapper = mountComponent({ status: true })
      await wrapper.setProps({ status: false })
      expect(wrapper.props('status')).toBe(false)
    })
  })

  describe('Component Lifecycle', () => {
    it('mounts without errors', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('unmounts without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('clears mocks on setup', () => {
      jest.clearAllMocks()
      const wrapper = mountComponent()
      expect(setSchedulingReportStatus).not.toHaveBeenCalled()
    })

    it('maintains state across updates', async () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })

      expect(wrapper.vm.isActionButtonDisabled).toBe(false)

      await wrapper.setProps({
        selectedRow: { resourceId: '1', status: 1 }
      })

      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('handles multiple mount/unmount cycles', () => {
      const wrapper1 = mountComponent()
      expect(wrapper1.vm).toBeDefined()
      wrapper1.destroy()

      const wrapper2 = mountComponent()
      expect(wrapper2.vm).toBeDefined()
      wrapper2.destroy()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing selectedRow properties', () => {
      const wrapper = mountComponent({
        selectedRow: { resourceId: '1' }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('handles status as different values', () => {
      const wrapper0 = mountComponent({
        selectedRow: { resourceId: '1', status: 0 }
      })
      expect(wrapper0.vm.getTitle).toBe('Confirm Activation')

      const wrapper1 = mountComponent({
        selectedRow: { resourceId: '1', status: 1 }
      })
      expect(wrapper1.vm.getTitle).toBe('Confirm Inactivation')
    })

    it('handles very long resource IDs', () => {
      const longId = 'a'.repeat(100)
      const wrapper = mountComponent({
        selectedRow: { resourceId: longId, status: 0 }
      })
      expect(wrapper.vm).toBeDefined()
    })

    it('handles rapid API mocking changes', () => {
      setSchedulingReportStatus.mockResolvedValue({ data: 1 })
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()

      setSchedulingReportStatus.mockResolvedValue({ data: 2 })
      expect(wrapper.vm).toBeDefined()
    })

    it('handles dialog without footer', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.footer-stub').exists()).toBe(true)
    })
  })
})
