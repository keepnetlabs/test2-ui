import { shallowMount } from '@vue/test-utils'
import AIAllySettings from '@/components/Company Settings/AiAllySettings.vue'
import { getAIAllySettings, saveAIAllySettings } from '@/api/company'

jest.mock('@/api/company', () => ({
  getAIAllySettings: jest.fn(),
  saveAIAllySettings: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AIAllySettings.vue', () => {
  const createWrapper = () =>
    shallowMount(AIAllySettings, {
      stubs: {
        Fragment: { template: '<div><slot /></div>' },
        DatatableLoading: true,
        VSwitch: true,
        VBtn: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads settings in created and enables main toggle when one setting is true', async () => {
    getAIAllySettings.mockResolvedValueOnce({
      data: {
        data: {
          psEmailTemplateGenerationAssistant: true,
          landingPageTemplateGenerationAssistant: false
        }
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    expect(getAIAllySettings).toHaveBeenCalled()
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.isAIAllySettingsEnabled).toBe(true)
    expect(wrapper.vm.initialAiAllySettings).toEqual(wrapper.vm.aiAllySettings)
  })

  it('falls back to disabled defaults when api returns no data', async () => {
    getAIAllySettings.mockResolvedValueOnce({ data: { data: null } })

    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.aiAllySettings).toEqual({
      psEmailTemplateGenerationAssistant: false,
      landingPageTemplateGenerationAssistant: false
    })
    expect(wrapper.vm.isAIAllySettingsEnabled).toBe(false)
  })

  it('handleAIAllySettingsChange toggles both assistant flags', () => {
    getAIAllySettings.mockResolvedValueOnce({ data: { data: null } })
    const wrapper = createWrapper()

    wrapper.vm.handleAIAllySettingsChange(true)
    expect(wrapper.vm.aiAllySettings.psEmailTemplateGenerationAssistant).toBe(true)
    expect(wrapper.vm.aiAllySettings.landingPageTemplateGenerationAssistant).toBe(true)

    wrapper.vm.handleAIAllySettingsChange(false)
    expect(wrapper.vm.aiAllySettings.psEmailTemplateGenerationAssistant).toBe(false)
    expect(wrapper.vm.aiAllySettings.landingPageTemplateGenerationAssistant).toBe(false)
  })

  it('deep watcher disables main toggle when both nested settings are false', async () => {
    getAIAllySettings.mockResolvedValueOnce({
      data: {
        data: {
          psEmailTemplateGenerationAssistant: true,
          landingPageTemplateGenerationAssistant: true
        }
      }
    })

    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.setData({
      isAIAllySettingsEnabled: true,
      aiAllySettings: {
        psEmailTemplateGenerationAssistant: false,
        landingPageTemplateGenerationAssistant: false
      }
    })

    expect(wrapper.vm.isAIAllySettingsEnabled).toBe(false)
  })

  it('getSaveButtonStyle disables save when settings unchanged or save in progress', async () => {
    getAIAllySettings.mockResolvedValueOnce({
      data: {
        data: {
          psEmailTemplateGenerationAssistant: false,
          landingPageTemplateGenerationAssistant: false
        }
      }
    })
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 0.5,
      cursor: 'auto',
      pointerEvents: 'none'
    })

    await wrapper.setData({
      aiAllySettings: {
        psEmailTemplateGenerationAssistant: true,
        landingPageTemplateGenerationAssistant: false
      }
    })
    expect(wrapper.vm.getSaveButtonStyle).toEqual({})

    await wrapper.setData({ isSaveDisabled: true })
    expect(wrapper.vm.getSaveButtonStyle).toEqual({
      opacity: 0.5,
      cursor: 'auto',
      pointerEvents: 'none'
    })
  })

  it('handleSubmit saves and refreshes initial settings snapshot', async () => {
    getAIAllySettings.mockResolvedValueOnce({
      data: {
        data: {
          psEmailTemplateGenerationAssistant: false,
          landingPageTemplateGenerationAssistant: false
        }
      }
    })
    saveAIAllySettings.mockResolvedValueOnce({})

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.setData({
      aiAllySettings: {
        psEmailTemplateGenerationAssistant: true,
        landingPageTemplateGenerationAssistant: true
      }
    })

    wrapper.vm.handleSubmit()
    expect(wrapper.vm.isSaveDisabled).toBe(true)
    await flushPromises()

    expect(saveAIAllySettings).toHaveBeenCalledWith({
      psEmailTemplateGenerationAssistant: true,
      landingPageTemplateGenerationAssistant: true
    })
    expect(wrapper.vm.isSaveDisabled).toBe(false)
    expect(wrapper.vm.initialAiAllySettings).toEqual(wrapper.vm.aiAllySettings)
  })
})
