import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportFeedbackDetailsDialog from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportFeedbackDetailsDialog.vue'

describe('CampaignManagerReportFeedbackDetailsDialog.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportFeedbackDetailsDialog, {
      propsData: {
        status: true,
        selectedRow: {
          firstName: 'Bruce',
          lastName: 'Wayne',
          feedbackSource: 'Just-in-Time Landing Page',
          phishingScenarioName: 'Alert Message',
          feedbackText: 'The email looked real and I almost trusted it.',
          ...propsData.selectedRow
        },
        ...propsData
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['status', 'title', 'subtitle', 'icon'],
          template:
            '<div class="app-dialog-stub"><h2>{{ title }}</h2><p>{{ subtitle }}</p><i>{{ icon }}</i><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooterWithClose: {
          name: 'AppDialogFooterWithClose',
          template: '<button class="close-button" @click="$emit(\'on-close\')">CLOSE</button>'
        }
      }
    })

  it('renders feedback details with title, subtitle and content', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Feedback Details')
    expect(wrapper.text()).toContain('Bruce Wayne')
    expect(wrapper.text()).toContain('Just-in-Time Landing Page')
    expect(wrapper.text()).toContain('Alert Message')
    expect(wrapper.text()).toContain('The email looked real and I almost trusted it.')
    expect(wrapper.findComponent({ name: 'AppDialog' }).props('icon')).toBe('mdi-message-text')
  })

  it('falls back when optional fields are missing', () => {
    const wrapper = mountComponent({
      selectedRow: {
        firstName: '',
        lastName: '',
        feedbackSource: '',
        feedbackSourceName: '',
        source: '',
        sourceName: '',
        phishingScenarioName: '',
        scenarioName: '',
        feedbackText: ''
      }
    })

    expect(wrapper.vm.getSubtitle).toBe('')
    expect(wrapper.vm.getFeedbackSource).toBe('Just-in-Time Landing Page')
    expect(wrapper.vm.getScenarioName).toBe('-')
    expect(wrapper.text()).toContain('User Feedback:')
  })

  it('emits on-close from footer and closed dialog status changes', async () => {
    const wrapper = mountComponent()

    await wrapper.find('.close-button').trigger('click')
    expect(wrapper.emitted('on-close')).toBeTruthy()

    wrapper.vm.handleStatusChange(false)
    expect(wrapper.emitted('on-close')).toHaveLength(2)
  })
})
