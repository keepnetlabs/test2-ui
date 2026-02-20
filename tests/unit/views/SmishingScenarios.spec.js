import SmishingScenarios from '@/views/SmishingScenarios.vue'

describe('SmishingScenarios.vue', () => {
  it('created sets tab based on permissions', () => {
    const templatesCtx = {
      tab: 'scenarios',
      getSmishingScenariosSearchPermissions: false,
      getSmishingTextMessageTemplatesSearchPermissions: true,
      getSmishingLandingPageTemplatesSearchPermissions: false
    }
    SmishingScenarios.created.call(templatesCtx)
    expect(templatesCtx.tab).toBe('templates')

    const landingCtx = {
      tab: 'scenarios',
      getSmishingScenariosSearchPermissions: false,
      getSmishingTextMessageTemplatesSearchPermissions: false,
      getSmishingLandingPageTemplatesSearchPermissions: true
    }
    SmishingScenarios.created.call(landingCtx)
    expect(landingCtx.tab).toBe('landingPage')
  })

  it('changeTabStatus and no-template handlers switch tabs and trigger modal openers', () => {
    const ctx = {
      tab: 'scenarios',
      $refs: {
        refTemplates: { changeNewEmailTemplateModalStatus: jest.fn() },
        refLandingPageList: { changeNewEmailTemplateModalStatus: jest.fn() }
      },
      $nextTick: (cb) => cb()
    }

    SmishingScenarios.methods.changeTabStatus.call(ctx, 'templates')
    expect(ctx.tab).toBe('templates')

    SmishingScenarios.methods.handleNoMessageTemplate.call(ctx)
    expect(ctx.tab).toBe('templates')
    expect(ctx.$refs.refTemplates.changeNewEmailTemplateModalStatus).toHaveBeenCalledWith(true, false)

    SmishingScenarios.methods.handleNoLandingPageTemplate.call(ctx)
    expect(ctx.tab).toBe('landingPage')
    expect(ctx.$refs.refLandingPageList.changeNewEmailTemplateModalStatus).toHaveBeenCalledWith(true, false)
  })

  it('beforeRouteLeave covers modal/fast-launch/grapes/landing branches and allow branch', () => {
    const next = jest.fn()

    const scenarioModalCtx = {
      $refs: { refScenarios: { modalStatus: true, checkIfCanCLoseNewScenarioModal: jest.fn() } }
    }
    SmishingScenarios.beforeRouteLeave.call(scenarioModalCtx, {}, {}, next)
    expect(scenarioModalCtx.$refs.refScenarios.checkIfCanCLoseNewScenarioModal).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const fastLaunchSubmittedCtx = {
      $refs: {
        refScenarios: {
          isShowFastLaunch: true,
          $refs: { fastLaunch: { isSubmitted: true } },
          checkIfCanCloseFastLaunchModal: jest.fn()
        }
      }
    }
    SmishingScenarios.beforeRouteLeave.call(fastLaunchSubmittedCtx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()

    next.mockClear()
    const landingModalCtx = {
      $refs: {
        refLandingPageList: {
          modalStatus: true,
          checkIfCanCloseNewLandingPage: jest.fn()
        }
      }
    }
    SmishingScenarios.beforeRouteLeave.call(landingModalCtx, {}, {}, next)
    expect(landingModalCtx.$refs.refLandingPageList.checkIfCanCloseNewLandingPage).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(false)

    next.mockClear()
    const allowCtx = { $refs: {} }
    SmishingScenarios.beforeRouteLeave.call(allowCtx, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
