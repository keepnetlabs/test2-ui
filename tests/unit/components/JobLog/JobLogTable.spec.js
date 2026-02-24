jest.mock('@/api/targetUsers', () => ({
  getAllJobs: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import JobLogTable from '@/components/JobLog/JobLogTable.vue'
import { getAllJobs } from '@/api/targetUsers'

describe('JobLogTable.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(JobLogTable, {
      propsData: {
        justShowReportAction: false,
        ...props
      },
      stubs: {
        DataTable: true,
        DefaultButtonRowAction: true,
        Badge: true,
        'v-tooltip': true,
        'v-btn': true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getAllJobs.mockResolvedValue({ data: { data: [] } })
  })

  describe('methods', () => {
    it('getStatusName maps numeric status to label', () => {
      const { methods } = JobLogTable
      expect(methods.getStatusName(0)).toBe('Waiting')
      expect(methods.getStatusName(1)).toBe('Started')
      expect(methods.getStatusName(2)).toBe('Running')
      expect(methods.getStatusName(3)).toBe('Completed')
      expect(methods.getStatusName(4)).toBe('Failed')
      expect(methods.getStatusName(99)).toBe('Waiting')
    })

    it('getErrorMessage returns errorMessage for Failed status', () => {
      const { methods } = JobLogTable
      expect(methods.getErrorMessage({ status: 'Running' })).toBe('')
      expect(methods.getErrorMessage({ status: 'Failed', errorMessage: 'Connection timeout' })).toBe(
        'Connection timeout'
      )
      expect(methods.getErrorMessage({ status: 'Failed' })).toBe('')
    })

    it('getTooltipDisabilityStatus returns true when not Failed or no error', () => {
      const { methods } = JobLogTable
      expect(methods.getTooltipDisabilityStatus({ status: 'Completed' })).toBe(true)
      expect(methods.getTooltipDisabilityStatus({ status: 'Failed' })).toBe(true)
      expect(
        methods.getTooltipDisabilityStatus({ status: 'Failed', errorMessage: 'Error' })
      ).toBe(false)
    })

    it('handleDetailsClick emits onDetails with row', () => {
      const wrapper = mountComponent()
      const row = { resourceId: 'job-1', name: 'Import' }
      wrapper.vm.handleDetailsClick(row)
      expect(wrapper.emitted('onDetails')).toEqual([[row]])
    })

    it('getStatusBadgeProps returns correct props for status', () => {
      const { methods } = JobLogTable
      expect(methods.getStatusBadgeProps('Completed')).toEqual({
        color: '#217124',
        text: 'Completed'
      })
      expect(methods.getStatusBadgeProps('Failed')).toEqual({
        color: '#B83A3A',
        text: 'Failed'
      })
    })
  })

  describe('callForData', () => {
    it('fetches jobs and maps status', async () => {
      getAllJobs.mockResolvedValue({
        data: {
          data: [
            { resourceId: 'j1', name: 'Job 1', status: 3 },
            { resourceId: 'j2', name: 'Job 2', status: 2 }
          ]
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))

      expect(getAllJobs).toHaveBeenCalled()
      expect(wrapper.vm.tableData).toHaveLength(2)
      expect(wrapper.vm.tableData[0].status).toBe('Completed')
      expect(wrapper.vm.tableData[1].status).toBe('Running')
    })
  })
})
