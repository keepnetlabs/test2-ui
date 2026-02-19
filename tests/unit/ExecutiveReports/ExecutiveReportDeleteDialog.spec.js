import { shallowMount } from '@vue/test-utils'
import ExecutiveReportDeleteDialog from '@/components/ExecutiveReports/ExecutiveReportDeleteDialog.vue'
import { deleteExecutiveReport } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  deleteExecutiveReport: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ExecutiveReportDeleteDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(ExecutiveReportDeleteDialog, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'rep-1' },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits on-close with forceUpdate flag', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted('on-close')[0]).toEqual([null, true])
  })

  it('handleConfirm calls api, closes dialog with force update, and resets loading flag', async () => {
    const wrapper = createWrapper()
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(deleteExecutiveReport).toHaveBeenCalledWith('rep-1')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleConfirm reads resource id from selectedRow payload', async () => {
    const wrapper = createWrapper({ selectedRow: { resourceId: 'rep-9' } })

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(deleteExecutiveReport).toHaveBeenCalledWith('rep-9')
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
