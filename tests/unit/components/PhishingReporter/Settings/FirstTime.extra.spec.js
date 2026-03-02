import { shallowMount } from '@vue/test-utils'
import FirstTime from '@/components/PhishingReporter/Settings/FirstTime.vue'

describe('FirstTime.vue (extra coverage)', () => {
  const createWrapper = () =>
    shallowMount(FirstTime, {
      stubs: { AddInConfiguration: true, Logos: true }
    })

  describe('changeAddInConfigurationStatus', () => {
    it('sets showAddInConfiguration to false when flag is false', () => {
      const wrapper = createWrapper()
      wrapper.vm.changeAddInConfigurationStatus(false)
      expect(wrapper.vm.showAddInConfiguration).toBe(false)
    })

    it('sets showAddInConfiguration to true when flag is true', () => {
      const wrapper = createWrapper()
      wrapper.vm.changeAddInConfigurationStatus(true)
      expect(wrapper.vm.showAddInConfiguration).toBe(true)
    })

    it('defaults to true when no argument', () => {
      const ctx = { showAddInConfiguration: false }
      FirstTime.methods.changeAddInConfigurationStatus.call(ctx)
      expect(ctx.showAddInConfiguration).toBe(true)
    })
  })

  describe('checkIfCanCloseOverlay', () => {
    it('calls closeOverlay when addInConfiguration ref exists', () => {
      const closeOverlay = jest.fn()
      const ctx = {
        $refs: { addInConfiguration: { closeOverlay } }
      }
      FirstTime.methods.checkIfCanCloseOverlay.call(ctx)
      expect(closeOverlay).toHaveBeenCalled()
    })

    it('does not throw when addInConfiguration ref is missing', () => {
      const ctx = { $refs: {} }
      expect(() => {
        FirstTime.methods.checkIfCanCloseOverlay.call(ctx)
      }).not.toThrow()
    })
  })

  describe('submit', () => {
    it('is a no-op', () => {
      const ctx = {}
      expect(() => FirstTime.methods.submit.call(ctx)).not.toThrow()
    })
  })
})
