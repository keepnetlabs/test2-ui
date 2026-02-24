jest.mock('@/api/targetUsers', () => ({
  getJobDetail: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import JobLogDetailsTable from '@/components/JobLog/JobLogDetailsTable.vue'
import { getJobDetail } from '@/api/targetUsers'

describe('JobLogDetailsTable.vue', () => {
  const mountComponent = (props = {}) =>
    shallowMount(JobLogDetailsTable, {
      propsData: {
        status: true,
        selectedRow: { resourceId: 'job-1', name: 'Import Users' },
        ...props
      },
      stubs: {
        AppDialog: true,
        DataTable: true,
        Badge: true,
        'v-progress-linear': true,
        'v-tooltip': true,
        'v-btn': true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getJobDetail.mockResolvedValue({
      data: { data: { progress: 0, processResults: [] } }
    })
  })

  describe('methods', () => {
    it('getStatusName maps numeric status to label', () => {
      const { methods } = JobLogDetailsTable
      expect(methods.getStatusName(0)).toBe('Error')
      expect(methods.getStatusName(1)).toBe('Exists')
      expect(methods.getStatusName(2)).toBe('New')
      expect(methods.getStatusName(3)).toBe('Delete')
      expect(methods.getStatusName(99)).toBe('')
    })

    it('getPriorityName maps numeric priority to label', () => {
      const { methods } = JobLogDetailsTable
      expect(methods.getPriorityName(1)).toBe('Very Low')
      expect(methods.getPriorityName(2)).toBe('Low')
      expect(methods.getPriorityName(3)).toBe('Medium')
      expect(methods.getPriorityName(4)).toBe('High')
      expect(methods.getPriorityName(5)).toBe('Very High')
      expect(methods.getPriorityName(0)).toBe('')
    })

    it('getTooltipDisabilityStatus returns true when not Error or no message', () => {
      const { methods } = JobLogDetailsTable
      expect(methods.getTooltipDisabilityStatus({ Status: 'New' })).toBe(true)
      expect(methods.getTooltipDisabilityStatus({ Status: 'Error' })).toBe(true)
      expect(
        methods.getTooltipDisabilityStatus({
          Status: 'Error',
          ValidationDetail: JSON.stringify([{ Message: 'Invalid email' }])
        })
      ).toBe(false)
    })

    it('getErrorMessage returns message for Error status', () => {
      const { methods } = JobLogDetailsTable
      expect(methods.getErrorMessage({ Status: 'New' })).toBe('')
      expect(
        methods.getErrorMessage({
          Status: 'Error',
          ValidationDetail: JSON.stringify([{ Message: 'Invalid format' }])
        })
      ).toBe('Invalid format')
      expect(methods.getErrorMessage({ Status: 'Error' })).toBe('')
    })

    it('handleClose emits onClose', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleClose()
      expect(wrapper.emitted('onClose')).toBeTruthy()
    })
  })

  describe('callForData', () => {
    it('fetches job detail and maps process errors', async () => {
      getJobDetail.mockResolvedValue({
        data: {
          data: {
            progress: 75,
            processResults: [
              {
                type: 11,
                processErrors: [
                  {
                    inputData: JSON.stringify({
                      FirstName: 'John',
                      Status: 0,
                      Priority: 3
                    })
                  }
                ]
              }
            ]
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))

      expect(getJobDetail).toHaveBeenCalledWith('job-1')
      expect(wrapper.vm.tableData).toHaveLength(1)
      expect(wrapper.vm.tableData[0].Status).toBe('Error')
      expect(wrapper.vm.tableData[0].Priority).toBe('Medium')
      expect(wrapper.vm.progress).toBe(75)
    })

    it('handles empty processErrors', async () => {
      getJobDetail.mockResolvedValue({
        data: {
          data: {
            progress: 100,
            processResults: []
          }
        }
      })

      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      await new Promise((r) => setTimeout(r, 0))

      expect(wrapper.vm.tableData).toEqual([])
      expect(wrapper.vm.progress).toBe(100)
    })
  })
})
