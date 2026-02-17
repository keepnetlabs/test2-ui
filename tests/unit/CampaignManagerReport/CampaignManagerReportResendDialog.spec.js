import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'

describe('CampaignManagerReportResendDialog.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    status: true,
    isActionButtonDisabled: false,
    payload: { items: ['user1', 'user2'] },
    resendItemCount: 0
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(CampaignManagerReportResendDialog, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
      stubs: { AppDialog: true, AppDialogFooter: true, useResend: true },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CampaignManagerReportResendDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should accept isActionButtonDisabled prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('should accept payload prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.payload).toBeDefined()
    })

    it('should accept resendItemCount prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.resendItemCount).toBe(0)
    })
  })

  describe('Constants', () => {
    it('should have icon constant', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-alert-circle')
    })

    it('should have title constant', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.title).toBe('Resend the campaign?')
    })

    it('should have dialog id', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.CONSTANTS.id).toBe('campaign-manager-report-resend-dialog')
    })
  })

  describe('Resend Text Display', () => {
    it('should display text for single user using resendItemCount', () => {
      const wrapper = mountComponent({ resendItemCount: 1 })
      expect(wrapper.vm.getResendText).toContain('1 user')
    })

    it('should display plural text for multiple users using resendItemCount', () => {
      const wrapper = mountComponent({ resendItemCount: 5 })
      expect(wrapper.vm.getResendText).toContain('5 users')
    })

    it('should use payload items length when resendItemCount is 0', () => {
      const wrapper = mountComponent({
        resendItemCount: 0,
        payload: { items: ['user1', 'user2', 'user3'] }
      })
      expect(wrapper.vm.getResendText).toContain('3 users')
    })

    it('should use payload for single item from payload', () => {
      const wrapper = mountComponent({
        resendItemCount: 0,
        payload: { items: ['user1'] }
      })
      expect(wrapper.vm.getResendText).toContain('1 user')
    })

    it('should show default text when no items specified', () => {
      const wrapper = mountComponent({
        resendItemCount: 0,
        payload: { items: [] }
      })
      expect(wrapper.vm.getResendText).toContain('users you selected')
    })

    it('should ask for confirmation', () => {
      const wrapper = mountComponent({ resendItemCount: 5 })
      expect(wrapper.vm.getResendText).toContain('Are you sure?')
    })
  })

  describe('Methods', () => {
    it('should have handleClose method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleClose).toBe('function')
    })

    it('should have handleConfirm method', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.handleConfirm).toBe('function')
    })
  })

  describe('Event Emissions', () => {
    it('should emit on-close event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })

    it('should emit on-confirm event', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.handleConfirm()
      expect(wrapper.emitted('on-confirm')).toBeTruthy()
    })
  })

  describe('Dialog Status', () => {
    it('should handle open status', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('should handle closed status', () => {
      const wrapper = mountComponent({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })
  })

  describe('Button States', () => {
    it('confirm button should be enabled by default', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    })

    it('confirm button should be disabled when specified', () => {
      const wrapper = mountComponent({ isActionButtonDisabled: true })
      expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    })
  })

  describe('Different Item Counts', () => {
    it('should handle 1 item', () => {
      const wrapper = mountComponent({ resendItemCount: 1 })
      expect(wrapper.vm.getResendText).toContain('1 user')
    })

    it('should handle 10 items', () => {
      const wrapper = mountComponent({ resendItemCount: 10 })
      expect(wrapper.vm.getResendText).toContain('10 users')
    })

    it('should handle 100 items', () => {
      const wrapper = mountComponent({ resendItemCount: 100 })
      expect(wrapper.vm.getResendText).toContain('100 users')
    })

    it('should handle 0 items', () => {
      const wrapper = mountComponent({
        resendItemCount: 0,
        payload: { items: [] }
      })
      expect(wrapper.vm.getResendText).toContain('users you selected')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent dialog instances', () => {
      const wrapper1 = mountComponent({ resendItemCount: 5 })
      const wrapper2 = mountComponent({ resendItemCount: 10 })

      expect(wrapper1.vm.getResendText).toContain('5 users')
      expect(wrapper2.vm.getResendText).toContain('10 users')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty payload', () => {
      const wrapper = mountComponent({ payload: { items: [] } })
      expect(wrapper.vm.payload.items.length).toBe(0)
    })

    it('should handle large number of items', () => {
      const largePayload = { items: Array(1000).fill('user') }
      const wrapper = mountComponent({ payload: largePayload })
      expect(wrapper.vm.getResendText).toContain('1000 users')
    })

    it('should prioritize resendItemCount over payload', () => {
      const wrapper = mountComponent({
        resendItemCount: 5,
        payload: { items: ['user1', 'user2'] }
      })
      expect(wrapper.vm.getResendText).toContain('5 users')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: render and confirm resend', async () => {
      const wrapper = mountComponent({
        status: true,
        resendItemCount: 3,
        isActionButtonDisabled: false
      })

      expect(wrapper.vm.getResendText).toContain('3 users')
      await wrapper.vm.handleConfirm()
      expect(wrapper.emitted('on-confirm')).toBeTruthy()
    })

    it('complete workflow: render and close dialog', async () => {
      const wrapper = mountComponent({ status: true })
      await wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(150)
    })
  })
})
