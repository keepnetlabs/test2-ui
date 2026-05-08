import { shallowMount } from '@vue/test-utils'
import VishingReportTemplate from '@/components/VishingReport/VishingReportTemplate'

describe('VishingReportTemplate.vue', () => {
  it('has correct component name', () => {
    expect(VishingReportTemplate.name).toBe('VishingReportTemplate')
  })

  it('renders summary template child with formData', () => {
    const formData = { name: 'Template 1' }
    const wrapper = shallowMount(VishingReportTemplate, {
      propsData: {
        formData
      }
    })

    expect(wrapper.find('vishingcampaignmodalsummaryvishingtemplate-stub').exists()).toBe(true)
    expect(wrapper.props('formData')).toEqual(formData)
  })

  it('computes isFormData length', () => {
    const wrapper = shallowMount(VishingReportTemplate, {
      propsData: {
        formData: { id: 1, title: 'x' }
      }
    })

    expect(wrapper.vm.isFormData).toBe(2)
  })

  it('returns 0 for isFormData when formData is empty object', () => {
    const wrapper = shallowMount(VishingReportTemplate, {
      propsData: {
        formData: {}
      }
    })

    expect(wrapper.vm.isFormData).toBe(0)
  })

  it('isFormData counts keys for single-field formData', () => {
    const wrapper = shallowMount(VishingReportTemplate, {
      propsData: { formData: { name: 'Only' } }
    })
    expect(wrapper.vm.isFormData).toBe(1)
  })

  it('passes formData to child as form-values prop', () => {
    const formData = { campaignName: 'Vishing Camp' }
    const wrapper = shallowMount(VishingReportTemplate, {
      propsData: {
        formData
      },
      stubs: {
        VishingCampaignModalSummaryVishingTemplate: {
          props: ['formValues'],
          template: '<div class="summary-stub">{{ formValues.campaignName }}</div>'
        }
      }
    })

    const child = wrapper.find('.summary-stub')
    expect(child.exists()).toBe(true)
    expect(child.text()).toContain('Vishing Camp')
  })
})
