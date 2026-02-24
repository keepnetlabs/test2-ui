import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerPerformanceDetailsTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerPerformanceDetailsTab'
import { getLearningEnrollments } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getLearningEnrollments: jest.fn()
}))

describe('GamificationReportUserDetailsDrawerPerformanceDetailsTab.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(GamificationReportUserDetailsDrawerPerformanceDetailsTab, {
      localVue,
      propsData: {
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123' },
        ...propsData
      },
      stubs: {
        DataTable: true,
        Badge: true,
        VIcon: true,
        VTooltip: true,
        VBtn: true,
        GamificationReportPhishingActivityResults: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': { yourLearningMaxPoints: 'MAX POINTS' }
          }
        }
      },
      ...options
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getLearningEnrollments.mockResolvedValue({ data: { data: { results: [] } } })
  })

  it('maxPointsLabel uses store label and falls back to default', () => {
    const labeled = mountComponent()
    expect(labeled.vm.maxPointsLabel).toBe('MAX POINTS')

    const fallback = mountComponent({}, {
      mocks: { $store: { getters: { 'usersDashboard/getLabels': null } } }
    })
    expect(fallback.vm.maxPointsLabel).toBe('max')
  })

  it('callForData exits early when target user resource id is missing', async () => {
    const wrapper = mountComponent({ selectedRow: { firstName: 'No', lastName: 'Id' } })
    wrapper.vm.tableData = [{ enrollmentId: 'existing' }]

    await wrapper.vm.callForData()

    expect(getLearningEnrollments).not.toHaveBeenCalled()
    expect(wrapper.vm.tableData).toEqual([{ enrollmentId: 'existing' }])
  })

  it('callForData maps response.data when response.data.data is absent', async () => {
    getLearningEnrollments.mockResolvedValue({
      data: { items: [{ enrollmentId: 'item-1', enrollmentName: 'Fallback Data' }] }
    })

    const wrapper = mountComponent()
    await wrapper.vm.$nextTick()
    await wrapper.vm.callForData()

    expect(wrapper.vm.tableData).toEqual([
      { enrollmentId: 'item-1', enrollmentName: 'Fallback Data' }
    ])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('getPointsIcon and getPointsIconColor cover NaN and positive branches', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getPointsIcon('abc', false)).toBe('mdi-check-circle')
    expect(wrapper.vm.getPointsIcon(12, false)).toBe('mdi-check-circle')

    expect(wrapper.vm.getPointsIconColor('abc', false)).toBe('#217124')
    expect(wrapper.vm.getPointsIconColor(12, false)).toBe('#217124')
  })

  it('handleOpenTraining does nothing for nullish rows', () => {
    const wrapper = mountComponent()
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

    wrapper.vm.handleOpenTraining(null)
    wrapper.vm.handleOpenTraining(undefined)
    wrapper.vm.handleOpenTraining({ enrollmentId: '' })

    expect(openSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })
})
