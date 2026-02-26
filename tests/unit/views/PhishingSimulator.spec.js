jest.mock('@/api/company', () => ({
  getAIAllySettings: jest.fn()
}))

import PhishingSimulator from '@/views/PhishingSimulator.vue'
import { getAIAllySettings } from '@/api/company'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PhishingSimulator.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name and default tab', () => {
    expect(PhishingSimulator.name).toBe('PhishingSimulator')
    expect(PhishingSimulator.data().tab).toBe('scenarios')
  })

  it('changeTabStatus updates active tab', () => {
    const ctx = { tab: 'scenarios' }
    PhishingSimulator.methods.changeTabStatus.call(ctx, 'landingPage')
    expect(ctx.tab).toBe('landingPage')
  })

  it('getAIAllySettings sets default flags when api has no data', async () => {
    getAIAllySettings.mockResolvedValueOnce({ data: {} })
    const ctx = {
      aiAllySettings: { psEmailTemplateGenerationAssistant: true, landingPageTemplateGenerationAssistant: true }
    }

    PhishingSimulator.methods.getAIAllySettings.call(ctx)
    await flushPromises()

    expect(ctx.aiAllySettings).toEqual({
      psEmailTemplateGenerationAssistant: false,
      landingPageTemplateGenerationAssistant: false
    })
  })

  it('getAIAllySettings uses payload when api returns data', async () => {
    getAIAllySettings.mockResolvedValueOnce({
      data: {
        data: {
          psEmailTemplateGenerationAssistant: true,
          landingPageTemplateGenerationAssistant: true
        }
      }
    })
    const ctx = {
      aiAllySettings: { psEmailTemplateGenerationAssistant: false, landingPageTemplateGenerationAssistant: false }
    }

    PhishingSimulator.methods.getAIAllySettings.call(ctx)
    await flushPromises()

    expect(ctx.aiAllySettings).toEqual({
      psEmailTemplateGenerationAssistant: true,
      landingPageTemplateGenerationAssistant: true
    })
  })

  it('created calls initial loaders and sets tab to emailTemplates when scenarios permission is missing', () => {
    const ctx = {
      tab: 'scenarios',
      getAIAllySettings: jest.fn(),
      callForScenarioDetails: jest.fn(),
      getPhishingScenariosSearchPermissions: false,
      getEmailTemplatesSearchPermissions: true,
      getLandingPageTemplatesSearchPermissions: false
    }

    PhishingSimulator.created.call(ctx)

    expect(ctx.getAIAllySettings).toHaveBeenCalledTimes(1)
    expect(ctx.callForScenarioDetails).toHaveBeenCalledTimes(1)
    expect(ctx.tab).toBe('emailTemplates')
  })

  it('created sets tab to landingPage when only landing page permission exists', () => {
    const ctx = {
      tab: 'scenarios',
      getAIAllySettings: jest.fn(),
      callForScenarioDetails: jest.fn(),
      getPhishingScenariosSearchPermissions: false,
      getEmailTemplatesSearchPermissions: false,
      getLandingPageTemplatesSearchPermissions: true
    }

    PhishingSimulator.created.call(ctx)
    expect(ctx.tab).toBe('landingPage')
  })

  it('created keeps default scenarios tab when scenarios permission exists', () => {
    const ctx = {
      tab: 'scenarios',
      getAIAllySettings: jest.fn(),
      callForScenarioDetails: jest.fn(),
      getPhishingScenariosSearchPermissions: true,
      getEmailTemplatesSearchPermissions: false,
      getLandingPageTemplatesSearchPermissions: false
    }

    PhishingSimulator.created.call(ctx)
    expect(ctx.tab).toBe('scenarios')
  })

  it('beforeRouteLeave handles blocker branches and allows when clear', () => {
    const next = jest.fn()
    const ctxScenario = {
      $refs: {
        refScenarios: { modalStatus: true, checkIfCanCLoseNewScenarioModal: jest.fn() }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(ctxScenario, {}, {}, next)
    expect(ctxScenario.$refs.refScenarios.checkIfCanCLoseNewScenarioModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const ctxFastLaunch = {
      $refs: {
        refScenarios: {
          modalStatus: false,
          isShowFastLaunch: true,
          $refs: { fastLaunch: { isSubmitted: false } },
          checkIfCanCloseFastLaunchModal: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(ctxFastLaunch, {}, {}, next)
    expect(ctxFastLaunch.$refs.refScenarios.checkIfCanCloseFastLaunchModal).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const ctxFastLaunchSubmitted = {
      $refs: {
        refScenarios: {
          isShowFastLaunch: true,
          $refs: { fastLaunch: { isSubmitted: true } },
          checkIfCanCloseFastLaunchModal: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(ctxFastLaunchSubmitted, {}, {}, next)
    expect(next).toHaveBeenCalledWith()

    next.mockClear()
    const clearCtx = { $refs: {} }
    PhishingSimulator.beforeRouteLeave.call(clearCtx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave blocks email template and landing page modal branches', () => {
    const next = jest.fn()

    const emailGrapesCtx = {
      $refs: {
        refEmailTemplates: {
          $refs: { newEmailTemplate: { $refs: { refEmailTemplate: { showGrapesModal: true } } } },
          checkIfCanCloseGrapesJSModal: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(emailGrapesCtx, {}, {}, next)
    expect(emailGrapesCtx.$refs.refEmailTemplates.checkIfCanCloseGrapesJSModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const emailModalCtx = {
      $refs: {
        refEmailTemplates: {
          modalStatus: true,
          checkIfCanCloseNewEmailTemplate: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(emailModalCtx, {}, {}, next)
    expect(emailModalCtx.$refs.refEmailTemplates.checkIfCanCloseNewEmailTemplate).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const landingGrapesCtx = {
      $refs: {
        refLandingPageList: {
          $refs: { newLandingPage: { $refs: { refEmailTemplate: { showGrapesModal: true } } } },
          checkIfCanCloseGrapesJSModal: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(landingGrapesCtx, {}, {}, next)
    expect(landingGrapesCtx.$refs.refLandingPageList.checkIfCanCloseGrapesJSModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const landingModalCtx = {
      $refs: {
        refLandingPageList: {
          modalStatus: true,
          checkIfCanCloseNewLandingPage: jest.fn()
        }
      }
    }
    PhishingSimulator.beforeRouteLeave.call(landingModalCtx, {}, {}, next)
    expect(landingModalCtx.$refs.refLandingPageList.checkIfCanCloseNewLandingPage).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)
  })
})
