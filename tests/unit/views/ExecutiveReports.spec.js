import { shallowMount } from '@vue/test-utils'
import ExecutiveReports from '@/views/ExecutiveReports.vue'

jest.mock('@/api/reports', () => ({
  __esModule: true,
  default: {
    getExecutiveReports: jest.fn().mockResolvedValue({ data: { data: [] } })
  }
}))

describe('ExecutiveReports.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(ExecutiveReports)
    expect(wrapper.exists()).toBe(true)
  })

  it('has name ExecutiveReports', () => {
    const wrapper = shallowMount(ExecutiveReports)
    expect(wrapper.vm.$options.name).toBe('ExecutiveReports')
  })

  describe('toggleShowScheduleReportDialog', () => {
    it('toggles dialog and sets selectedRow', () => {
      const wrapper = shallowMount(ExecutiveReports)
      const row = { resourceId: '1' }
      wrapper.vm.toggleShowScheduleReportDialog(row)
      expect(wrapper.vm.isShowScheduleReportDialog).toBe(true)
      expect(wrapper.vm.selectedRow).toEqual(row)
    })

    it('sets isSupportManager from row when provided', () => {
      const wrapper = shallowMount(ExecutiveReports)
      wrapper.vm.toggleShowScheduleReportDialog({ isSupportManager: true })
      expect(wrapper.vm.isSupportManager).toBe(true)
    })

    it('sets isSupportManager to false when row has no isSupportManager', () => {
      const wrapper = shallowMount(ExecutiveReports)
      wrapper.vm.toggleShowScheduleReportDialog({})
      expect(wrapper.vm.isSupportManager).toBe(false)
    })
  })

  describe('toggleShowDeleteDialog', () => {
    it('toggles dialog and sets selectedRow', () => {
      const wrapper = shallowMount(ExecutiveReports)
      const row = { resourceId: '1' }
      wrapper.vm.toggleShowDeleteDialog(row)
      expect(wrapper.vm.isShowDeleteDialog).toBe(true)
      expect(wrapper.vm.selectedRow).toEqual(row)
    })

    it('calls callForData when forceUpdate is true', async () => {
      const wrapper = shallowMount(ExecutiveReports)
      const callForDataSpy = jest.spyOn(wrapper.vm, 'callForData')
      wrapper.vm.toggleShowDeleteDialog({}, true)
      await wrapper.vm.$nextTick()
      expect(callForDataSpy).toHaveBeenCalled()
    })
  })

  it('handleDebouncedSearch sets hasSearch to false when value is empty after debounce', () => {
    jest.useFakeTimers()
    const wrapper = shallowMount(ExecutiveReports)
    wrapper.vm.handleDebouncedSearch('')
    expect(wrapper.vm.search).toBe('')
    expect(wrapper.vm.hasSearch).toBe(true)
    jest.advanceTimersByTime(750)
    expect(wrapper.vm.hasSearch).toBe(false)
    jest.useRealTimers()
  })

  it('routeToNewExecutiveReport pushes to router', () => {
    const push = jest.fn()
    const wrapper = shallowMount(ExecutiveReports, {
      mocks: { $router: { push } }
    })
    wrapper.vm.routeToNewExecutiveReport()
    expect(push).toHaveBeenCalledWith({ name: 'New Executive Report' })
  })
})
