import { createLocalVue, shallowMount } from '@vue/test-utils'
import AdvancedReportsList from '@/components/AdvancedReports/AdvancedReportsList'

describe('AdvancedReportsList.vue', () => {
  const localVue = createLocalVue()

  const reports = [
    { name: 'R1', description: 'D1', resourceId: 'id-1' },
    { name: 'R2', description: 'D2', resourceId: 'id-2' }
  ]

  it('shows loading component when loading', () => {
    const wrapper = shallowMount(AdvancedReportsList, {
      localVue,
      propsData: {
        isLoading: true,
        reports: []
      }
    })

    expect(wrapper.find('datatableloading-stub').exists()).toBe(true)
  })

  it('returns spacing class only for non-last item when multiple reports', () => {
    const wrapper = shallowMount(AdvancedReportsList, {
      localVue,
      propsData: {
        isLoading: false,
        reports
      }
    })

    expect(wrapper.vm.getReportClass(0)).toBe('mb-4')
    expect(wrapper.vm.getReportClass(1)).toBe('')
  })

  it('navigates to report detail on action click', () => {
    const push = jest.fn()
    const wrapper = shallowMount(AdvancedReportsList, {
      localVue,
      mocks: {
        $router: { push }
      },
      propsData: {
        isLoading: false,
        reports
      }
    })

    wrapper.vm.handleActionButtonClick('id-99')

    expect(push).toHaveBeenCalledWith('/reports/advanced-reports/advanced-report/id-99')
  })
})

