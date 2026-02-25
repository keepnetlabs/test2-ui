import { shallowMount } from '@vue/test-utils'
import ShowAllJobs from '@/components/TargetUsers/ShowAllJobs.vue'

jest.mock('@/api/targetUsers', () => ({
  getAllJobs: jest.fn().mockResolvedValue({ data: { data: [] } }),
  getJobDetail: jest.fn().mockResolvedValue({ data: { data: {} } })
}))

describe('ShowAllJobs.vue', () => {
  it('renders', () => {
    const wrapper = shallowMount(ShowAllJobs)
    expect(wrapper.exists()).toBe(true)
  })

  it('has name ShowAllJobsInline', () => {
    const wrapper = shallowMount(ShowAllJobs)
    expect(wrapper.vm.$options.name).toBe('ShowAllJobsInline')
  })

  describe('panelDisabled', () => {
    it('returns true when job status is 0', () => {
      const wrapper = shallowMount(ShowAllJobs)
      expect(wrapper.vm.panelDisabled({ status: 0 }, 0)).toBe(true)
    })

    it('returns true when another panel is open (panelIndex differs from index)', () => {
      const wrapper = shallowMount(ShowAllJobs)
      wrapper.vm.panelIndex = 1
      expect(wrapper.vm.panelDisabled({ status: 1 }, 0)).toBe(true)
    })

    it('returns false when same panel is open and job is not waiting', () => {
      const wrapper = shallowMount(ShowAllJobs)
      wrapper.vm.panelIndex = 0
      expect(wrapper.vm.panelDisabled({ status: 1 }, 0)).toBe(false)
    })
  })

  describe('processType', () => {
    it('returns warning when process has error and is finished', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = {
        targetCount: 10,
        currentCount: 10,
        isFinished: true,
        existsError: true
      }
      expect(wrapper.vm.processType(process)).toBe('warning')
    })

    it('returns success when process is finished without error (targetCount === currentCount)', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = {
        targetCount: 10,
        currentCount: 10,
        isFinished: true,
        existsError: false
      }
      expect(wrapper.vm.processType(process)).toBe('success')
    })

    it('returns success when targetCount and currentCount are both 0', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = {
        targetCount: 0,
        currentCount: 0,
        isFinished: false,
        existsError: false
      }
      expect(wrapper.vm.processType(process)).toBe('success')
    })

    it('returns info when process is in progress', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = {
        targetCount: 10,
        currentCount: 5,
        isFinished: false,
        existsError: false
      }
      expect(wrapper.vm.processType(process)).toBe('info')
    })
  })

  describe('getProcessColor', () => {
    it('returns red when process has existError', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = { isFinished: false, existError: true }
      expect(wrapper.vm.getProcessColor(process)).toBe('red')
    })

    it('returns success lighten-1 when process is finished', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = { isFinished: true, existError: false }
      expect(wrapper.vm.getProcessColor(process)).toBe('success lighten-1')
    })

    it('returns primary for in-progress process', () => {
      const wrapper = shallowMount(ShowAllJobs)
      const process = { isFinished: false, existError: false }
      expect(wrapper.vm.getProcessColor(process)).toBe('primary')
    })
  })
})
