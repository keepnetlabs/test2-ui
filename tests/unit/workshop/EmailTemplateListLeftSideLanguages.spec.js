import { shallowMount } from '@vue/test-utils'
import EmailTemplateListLeftSideLanguages from '@/components/workshop/EmailTemplateListLeftSideLanguages'

describe('EmailTemplateListLeftSideLanguages.vue', () => {
  it('returns first language when exists', () => {
    const wrapper = shallowMount(EmailTemplateListLeftSideLanguages, {
      propsData: {
        item: {
          languageTypeName: ['English', 'Turkish']
        }
      }
    })

    expect(wrapper.vm.firstLanguage).toBe('English')
    expect(wrapper.text()).toContain('English')
    expect(wrapper.text()).toContain('Turkish')
  })

  it('returns empty string when no language exists', () => {
    const wrapper = shallowMount(EmailTemplateListLeftSideLanguages, {
      propsData: {
        item: {
          languageTypeName: []
        }
      }
    })

    expect(wrapper.vm.firstLanguage).toBe('')
  })

  it('does not render extra-language tooltip when only one language exists', () => {
    const wrapper = shallowMount(EmailTemplateListLeftSideLanguages, {
      propsData: {
        item: {
          languageTypeName: ['English']
        }
      }
    })

    expect(wrapper.text()).toContain('English')
    expect(wrapper.text()).not.toContain('+')
    expect(wrapper.find('vtooltip-stub').exists()).toBe(false)
  })

  it('renders tooltip text for additional languages', () => {
    const wrapper = shallowMount(EmailTemplateListLeftSideLanguages, {
      propsData: {
        item: {
          languageTypeName: ['English', 'Turkish', 'German']
        }
      }
    })

    expect(wrapper.find('vtooltip-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('Turkish, German')
  })
})
