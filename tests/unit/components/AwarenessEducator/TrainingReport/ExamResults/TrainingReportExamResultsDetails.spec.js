jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportExamResultsDetails: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingReportExamResultsDetails from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResultsDetails.vue'

describe('TrainingReportExamResultsDetails.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
      data: { data: [] }
    })
  })

  describe('getSubtitle computed - branch coverage', () => {
    it('returns empty spaces when item is undefined', () => {
      const getSubtitle = TrainingReportExamResultsDetails.computed.getSubtitle
      expect(getSubtitle.call({ item: undefined })).toBe(' ')
    })

    it('returns empty spaces when item is null', () => {
      const getSubtitle = TrainingReportExamResultsDetails.computed.getSubtitle
      expect(getSubtitle.call({ item: null })).toBe(' ')
    })

    it('getSubtitle updates when item changes to null via setProps', async () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { firstName: 'John', enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getSubtitle).toBe('John ')
      wrapper.setProps({ item: null })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.getSubtitle).toBe(' ')
    })

    it('returns empty spaces when item is empty object', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: { status: true, item: {} }
      })
      expect(wrapper.vm.getSubtitle).toBe(' ')
    })

    it('returns firstName and space when only firstName present', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { firstName: 'John', enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      expect(wrapper.vm.getSubtitle).toBe('John ')
    })

    it('returns space and lastName when only lastName present', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { lastName: 'Doe', enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      expect(wrapper.vm.getSubtitle).toBe(' Doe')
    })

    it('returns full name when both firstName and lastName present', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: {
            firstName: 'John',
            lastName: 'Doe',
            enrollmentId: 'e1',
            targetUserResourceId: 'u1'
          }
        }
      })
      expect(wrapper.vm.getSubtitle).toBe('John Doe')
    })

    it('uses empty string for falsy firstName (0)', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { firstName: 0, lastName: 'Doe', enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      expect(wrapper.vm.getSubtitle).toBe(' Doe')
    })

    it('uses empty string for falsy lastName (empty string)', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { firstName: 'John', lastName: '', enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      expect(wrapper.vm.getSubtitle).toBe('John ')
    })
  })

  describe('callForData', () => {
    it('maps response data with trackingInfo', async () => {
      AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
        data: {
          data: [
            {
              sessionRank: 1,
              examStatus: 'Passed',
              trackingInfo: { userAgent: 'Chrome', browserName: 'Chrome' }
            }
          ]
        }
      })

      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })

      await wrapper.vm.$nextTick()
      await new Promise((r) => setImmediate(r))

      expect(wrapper.vm.tableData).toEqual([
        {
          sessionRank: 1,
          examStatus: 'Passed',
          trackingInfo: { userAgent: 'Chrome', browserName: 'Chrome' },
          userAgent: 'Chrome',
          browserName: 'Chrome'
        }
      ])
    })

    it('handles response with null or undefined data', async () => {
      AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
        data: { data: null }
      })

      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })

      await wrapper.vm.$nextTick()
      await new Promise((r) => setImmediate(r))

      expect(wrapper.vm.tableData).toEqual([])
    })

    it('handles response with undefined data.data', async () => {
      AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
        data: {}
      })

      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })

      await wrapper.vm.$nextTick()
      await new Promise((r) => setImmediate(r))

      expect(wrapper.vm.tableData).toEqual([])
    })

    it('handles response as null (optional chaining short-circuit)', async () => {
      AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue(null)

      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })

      await wrapper.vm.$nextTick()
      await new Promise((r) => setImmediate(r))

      expect(wrapper.vm.tableData).toEqual([])
    })

    it('handles item without trackingInfo', async () => {
      AwarenessEducatorService.getTrainingReportExamResultsDetails.mockResolvedValue({
        data: {
          data: [{ sessionRank: 1, examStatus: 'Passed' }]
        }
      })

      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })

      await wrapper.vm.$nextTick()
      await new Promise((r) => setImmediate(r))

      expect(wrapper.vm.tableData).toEqual([{ sessionRank: 1, examStatus: 'Passed' }])
    })

  })

  describe('handleClose', () => {
    it('emits on-close', () => {
      const wrapper = shallowMount(TrainingReportExamResultsDetails, {
        propsData: {
          status: true,
          item: { enrollmentId: 'e1', targetUserResourceId: 'u1' }
        }
      })
      wrapper.vm.handleClose()
      expect(wrapper.emitted('on-close')).toBeTruthy()
      expect(wrapper.emitted('on-close').length).toBe(1)
    })
  })

})
