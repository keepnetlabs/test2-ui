jest.mock('@/api/vishing', () => ({
  getVishingTemplatePreview: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getVishingTemplates: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfPages: 1,
          totalNumberOfRecords: 0
        }
      }
    })
  )
}))

import { shallowMount } from '@vue/test-utils'
import VishingTemplateSelectList from '@/components/VishingCampaignManager/VishingTemplateSelectList.vue'

describe('VishingTemplateSelectList.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(VishingTemplateSelectList, {
      propsData: {
        templateResourceId: '',
        languages: [
          { language: 'en', name: 'Voice1', voiceProviderTypeId: 1, resourceId: 'v1' },
          { language: 'en', name: 'Voice2', voiceProviderTypeId: 2, resourceId: 'v2' }
        ],
        ...propsData
      },
      stubs: {
        ShowMoreTags: true,
        Multipane: true,
        MultipaneResizer: true,
        VishingTemplatePreviewSteps: true
      }
    })

  it('getItemDescription returns nbsp when no description', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({})).toBe('\xa0')
  })

  it('getItemDescription returns nbsp when description is null', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({ description: null })).toBe('\xa0')
  })

  it('getItemDescription returns nbsp when description is "null" string', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({ description: 'null' })).toBe('\xa0')
  })

  it('getItemDescription returns nbsp when description is "undefined" string', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({ description: 'undefined' })).toBe('\xa0')
  })

  it('getItemDescription returns description when valid', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getItemDescription({ description: 'Valid desc' })).toBe('Valid desc')
  })

  it('getLanguageItems maps languages to language array', () => {
    const wrapper = createWrapper({
      languages: [{ language: 'en' }, { language: 'tr' }]
    })
    expect(wrapper.vm.getLanguageItems).toEqual(['en', 'tr'])
  })

  it('getLanguageItems returns empty when languages is undefined', () => {
    const wrapper = createWrapper({ languages: undefined })
    expect(wrapper.vm.getLanguageItems).toEqual([])
  })

  it('getVoiceItems returns voices for selected language', () => {
    const wrapper = createWrapper({
      languages: [
        { language: 'en', name: 'Voice1' },
        { language: 'en', name: 'Voice2' },
        { language: 'tr', name: 'Ses1' }
      ]
    })
    wrapper.vm.bodyData.filter.FilterGroups[0].FilterItems[0].value = 'en'
    expect(wrapper.vm.getVoiceItems).toEqual(['Voice1', 'Voice2'])
  })

  it('getVoiceItems returns empty when no language selected', () => {
    const wrapper = createWrapper()
    wrapper.vm.bodyData.filter.FilterGroups[0].FilterItems[0].value = ''
    expect(wrapper.vm.getVoiceItems).toEqual([])
  })
})
