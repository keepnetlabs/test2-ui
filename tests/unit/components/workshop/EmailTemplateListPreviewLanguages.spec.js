import { shallowMount } from '@vue/test-utils'
import EmailTemplateListPreviewLanguages from '@/components/workshop/EmailTemplateListPreviewLanguages.vue'

describe('EmailTemplateListPreviewLanguages.vue', () => {
  it('has correct component name', () => {
    expect(EmailTemplateListPreviewLanguages.name).toBe('EmailTemplateListPreviewLanguages')
  })

  it('languageShortCode prop is required', () => {
    expect(EmailTemplateListPreviewLanguages.props.languageShortCode.required).toBe(true)
  })

  it('renders language codes', () => {
    const wrapper = shallowMount(EmailTemplateListPreviewLanguages, {
      propsData: {
        languageShortCode: ['en', 'tr']
      }
    })
    expect(wrapper.text()).toContain('en')
    expect(wrapper.text()).toContain('tr')
  })

  it('renders with 4 languages', () => {
    const wrapper = shallowMount(EmailTemplateListPreviewLanguages, {
      propsData: {
        languageShortCode: ['en', 'tr', 'de', 'fr']
      }
    })
    expect(wrapper.vm.languageShortCode).toHaveLength(4)
    expect(wrapper.text()).toMatch(/en|tr|de|fr/)
  })
})
