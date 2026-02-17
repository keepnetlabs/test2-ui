import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import AIAllyMini from '@/components/Common/Inputs/AIAllyMini'
import {
  generateAILandingPageTemplate,
  getGeneratedAILandingPageTemplate
} from '@/api/phishingsimulator'

jest.mock('@/api/phishingsimulator', () => ({
  generateAILandingPageTemplate: jest.fn(),
  getGeneratedAILandingPageTemplate: jest.fn()
}))

describe('AIAllyMini.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const factory = (propsData = {}) => {
    const actions = {
      'dashboard/changeFeedbackPopup': jest.fn()
    }
    const store = new Vuex.Store({ actions })

    return shallowMount(AIAllyMini, {
      localVue,
      store,
      propsData: {
        methodTypeId: 5,
        name: 'Landing Page',
        languageTypeResourceId: 10,
        ...propsData
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes selected format text and placeholder', () => {
    const wrapper = factory()
    expect(wrapper.vm.getSelectedFormatText).toBe('HTML')
    expect(wrapper.vm.getAITemplateTextAreaPlaceholder).toContain('AI Ally')
  })

  it('sets suggestion content on suggestion click', () => {
    const wrapper = factory()
    wrapper.setData({ suggestionsMenuOpen: true, aiTemplateText: '' })

    wrapper.vm.handleSuggestionClick(0)

    expect(wrapper.vm.aiTemplateText.length).toBeGreaterThan(0)
    expect(wrapper.vm.suggestionsMenuOpen).toBe(false)
  })

  it('computes generate button style for enabled/disabled states', () => {
    const wrapper = factory()
    wrapper.setData({ aiTemplateText: 'hello', isEmailGenerating: false })
    expect(wrapper.vm.getGenerateEmailButtonStyle).toEqual({ opacity: 1, pointerEvents: '' })

    wrapper.setData({ aiTemplateText: '', isEmailGenerating: false })
    expect(wrapper.vm.getGenerateEmailButtonStyle).toEqual({ opacity: 0.5, pointerEvents: 'none' })
  })

  it('generates template and emits updates on success', async () => {
    generateAILandingPageTemplate.mockResolvedValue({
      data: { data: { isSuccess: true } }
    })
    getGeneratedAILandingPageTemplate.mockResolvedValue({
      data: { data: '<html>ok</html>' }
    })

    const wrapper = factory({ aiAssistantRemainingRight: 3 })
    wrapper.setData({ aiTemplateText: 'prompt text', formatType: 'plain' })

    wrapper.vm.handleGenerateEmail()
    await Promise.resolve()
    await Promise.resolve()

    expect(generateAILandingPageTemplate).toHaveBeenCalled()
    expect(getGeneratedAILandingPageTemplate).toHaveBeenCalled()
    expect(wrapper.emitted('on-assisted-by-ai-template')).toBeTruthy()
    expect(wrapper.emitted('update:template')).toBeTruthy()
    expect(wrapper.emitted('update:aiAssistantRemainingRight')[0]).toEqual([2])
  })

  it('sets generating false when generate api fails', async () => {
    generateAILandingPageTemplate.mockRejectedValue(new Error('fail'))
    const wrapper = factory()
    wrapper.setData({ aiTemplateText: 'prompt text' })

    wrapper.vm.handleGenerateEmail()
    await Promise.resolve()

    expect(wrapper.vm.isEmailGenerating).toBe(false)
    expect(wrapper.emitted('update:isEmailGenerating')).toBeTruthy()
  })

  it('setActiveGeneratedTemplate updates fields and emits', () => {
    const wrapper = factory()
    wrapper.setData({
      generatedTemplates: [
        { text: 't1', content: '<div>a</div>', languageTypeResourceId: 44 },
        { text: 't2', content: '<div>b</div>', languageTypeResourceId: 55 }
      ]
    })

    wrapper.vm.setActiveGeneratedTemplate(1)

    expect(wrapper.vm.activeGeneratedTemplateIndex).toBe(1)
    expect(wrapper.vm.aiTemplateText).toBe('t2')
    expect(wrapper.emitted('update:languageTypeResourceId')[0]).toEqual([55])
    expect(wrapper.emitted('update:template')[0]).toEqual(['<div>b</div>'])
  })
})

