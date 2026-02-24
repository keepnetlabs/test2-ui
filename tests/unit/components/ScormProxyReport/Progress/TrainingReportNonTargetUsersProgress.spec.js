import { shallowMount } from '@vue/test-utils'
import TrainingReportNonTargetUsersProgress from '@/components/ScormProxyReport/Progress/TrainingReportNonTargetUsersProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  progressNonTargetUsersTrainingReportEmails: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ targetUserResourceId: 'u1', status: 'Completed' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  )
}))

describe('TrainingReportNonTargetUsersProgress.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(TrainingReportNonTargetUsersProgress, {
      propsData: { id: 't1', formDetails: {}, isSurvey: false, ...propsData },
      stubs: {
        TrainingReportNonTargetUsersProgressDetailDialog: true,
        DataTable: true,
        Badge: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component structure', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.CONSTANTS).toBeDefined()
    expect(wrapper.vm.tableOptions).toBeDefined()
    expect(wrapper.vm.tableOptions.rowActions).toHaveLength(1)
  })

  it('callForData fetches progress data and updates table', async () => {
    const wrapper = mountComponent()
    wrapper.vm.callForData()
    await new Promise((r) => setTimeout(r, 0))
    expect(AwarenessEducatorService.progressNonTargetUsersTrainingReportEmails).toHaveBeenCalledWith(
      expect.any(Object),
      't1'
    )
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('handleInteractions sets selectedRow and toggles modal', () => {
    const wrapper = mountComponent()
    const row = { targetUserResourceId: 'u1', enrollmentId: 'e1' }
    wrapper.vm.handleInteractions(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
  })

  it('toggleIsShowInteractionsModal toggles isShowInteractionsModal', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.isShowInteractionsModal).toBe(false)
    wrapper.vm.toggleIsShowInteractionsModal()
    expect(wrapper.vm.isShowInteractionsModal).toBe(true)
    wrapper.vm.toggleIsShowInteractionsModal()
    expect(wrapper.vm.isShowInteractionsModal).toBe(false)
  })

  it('getStatusBadgeProps delegates to utils', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getStatusBadgeProps('Completed')
    expect(result).toBeDefined()
  })
})
