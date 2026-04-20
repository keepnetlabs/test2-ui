import { shallowMount } from '@vue/test-utils'
import CampaignInfoLanguages from '@/components/Common/Report/CampaignInfoLanguages.vue'

describe('CampaignInfoLanguages.vue', () => {
  it('shows first two languages by default and computes overflow from the rest', () => {
    const ctx = {
      languages: ['English', 'Turkish', 'German', 'French', 'Spanish'],
      visibleCount: 2,
      normalizedVisibleCount: 2
    }

    expect(CampaignInfoLanguages.computed.normalizedVisibleCount.call(ctx)).toBe(2)
    expect(CampaignInfoLanguages.computed.visibleLanguages.call(ctx)).toEqual([
      'English',
      'Turkish'
    ])
    expect(CampaignInfoLanguages.computed.visibleLanguagesText.call({
      visibleLanguages: ['English', 'Turkish']
    })).toBe('English, Turkish')
    expect(CampaignInfoLanguages.computed.overflowCount.call({
      languages: ctx.languages,
      visibleLanguages: ['English', 'Turkish']
    })).toBe(3)
  })

  it('renders overflow label when value contains more than visible count', () => {
    const wrapper = shallowMount(CampaignInfoLanguages, {
      propsData: {
        value: ['English', 'Turkish', 'German', 'French', 'Spanish']
      },
      stubs: {
        VMenu: {
          name: 'VMenu',
          props: ['value'],
          template: '<div><slot name="activator" :on="{}" :attrs="{}" /><slot /></div>'
        },
        LanguagesPopover: true
      }
    })

    expect(wrapper.find('.languages-column__first').text()).toBe('English, Turkish')
    expect(wrapper.find('.languages-column__overflow').text()).toContain('+3 languages')
  })
})
