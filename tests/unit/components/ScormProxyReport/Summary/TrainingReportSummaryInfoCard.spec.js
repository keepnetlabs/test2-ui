import { shallowMount } from '@vue/test-utils'
import ScormSummaryInfoCard from '@/components/ScormProxyReport/Summary/TrainingReportSummaryInfoCard.vue'

describe('Scorm TrainingReportSummaryInfoCard.vue', () => {
  it('renders title/count/percent and loading class transitions', async () => {
    const wrapper = shallowMount(ScormSummaryInfoCard, {
      propsData: {
        isLoading: true,
        title: 'In Progress',
        userCount: 5,
        userPercent: '25',
        backgroundColor: '#1173C1',
        iconSrc: '/icon.png'
      },
      stubs: {
        CardLoading: {
          name: 'CardLoading',
          props: ['loading'],
          template: '<div><slot name="skeleton-content" /></div>'
        }
      }
    })

    expect(wrapper.text()).toContain('In Progress')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('25%')
    expect(wrapper.classes()).toContain('training-report-summary-info-card--loading')

    await wrapper.setProps({ isLoading: false })
    expect(wrapper.classes()).not.toContain('training-report-summary-info-card--loading')
  })
})
