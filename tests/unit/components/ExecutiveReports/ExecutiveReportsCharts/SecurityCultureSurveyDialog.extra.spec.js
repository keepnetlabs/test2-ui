import { shallowMount } from '@vue/test-utils'
import SecurityCultureSurveyDialog from '@/components/ExecutiveReports/ExecutiveReportsCharts/SecurityCultureSurveyDialog.vue'

describe('SecurityCultureSurveyDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SecurityCultureSurveyDialog, {
      propsData: {
        status: true,
        enrollments: [],
        overallScore: 0,
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true }
    })

  it('enrollmentsWithOverallScore maps enrollments with avgScore', () => {
    const wrapper = createWrapper({
      enrollments: [
        { enrollmentId: 'e1', enrollmentName: 'A', overallScore: 85 },
        { enrollmentId: 'e2', enrollmentName: 'B', overallScore: 70 }
      ]
    })
    expect(wrapper.vm.enrollmentsWithOverallScore).toEqual([
      { enrollmentId: 'e1', enrollmentName: 'A', overallScore: 85, avgScore: 85 },
      { enrollmentId: 'e2', enrollmentName: 'B', overallScore: 70, avgScore: 70 }
    ])
  })

  it('handleClose emits update:status with false', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('update:status')).toEqual([[false]])
  })

  it('handleStatusChange emits update:status with newStatus', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleStatusChange(false)
    expect(wrapper.emitted('update:status')).toEqual([[false]])
  })
})
