jest.mock('@/api/reports', () => ({
  setSchedulingReportStatus: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import ScheduledReportsActivationDialog from '@/components/ScheduledReportsActivationDialog.vue'
import { setSchedulingReportStatus } from '@/api/reports'

describe('ScheduledReportsActivationDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ScheduledReportsActivationDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'r1', status: false },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTitle returns Confirm Activation when status is false', () => {
    const wrapper = createWrapper({ selectedRow: { status: false } })
    expect(wrapper.vm.getTitle).toBe('Confirm Activation')
  })

  it('getTitle returns Confirm Inactivation when status is true', () => {
    const wrapper = createWrapper({ selectedRow: { status: true } })
    expect(wrapper.vm.getTitle).toBe('Confirm Inactivation')
  })

  it('getIcon returns mdi-check-circle for activation', () => {
    const wrapper = createWrapper({ selectedRow: { status: false } })
    expect(wrapper.vm.getIcon).toBe('mdi-check-circle')
  })

  it('getIcon returns mdi-close-circle for inactivation', () => {
    const wrapper = createWrapper({ selectedRow: { status: true } })
    expect(wrapper.vm.getIcon).toBe('mdi-close-circle')
  })

  it('getBody returns activation text when status is false', () => {
    const wrapper = createWrapper({ selectedRow: { status: false } })
    expect(wrapper.vm.getBody).toContain('activate')
  })

  it('getBody returns inactivation text when status is true', () => {
    const wrapper = createWrapper({ selectedRow: { status: true } })
    expect(wrapper.vm.getBody).toContain('inactive')
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('handleConfirm calls setSchedulingReportStatus and emits', async () => {
    const flushPromises = () => new Promise((r) => setTimeout(r, 0))
    const wrapper = createWrapper({
      selectedRow: { resourceId: 'r1', status: false }
    })
    wrapper.vm.handleConfirm()
    await flushPromises()
    await flushPromises()

    expect(setSchedulingReportStatus).toHaveBeenCalledWith('r1', 1)
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
