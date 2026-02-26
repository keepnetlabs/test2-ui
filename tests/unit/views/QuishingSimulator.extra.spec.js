import QuishingSimulator from '@/views/QuishingSimulator.vue'

describe('QuishingSimulator.vue (extra)', () => {
  it('created keeps default tab when scenarios permission exists', () => {
    const ctx = {
      tab: 'scenarios',
      getPhishingScenariosSearchPermissions: true,
      getEmailTemplatesSearchPermissions: true,
      getLandingPageTemplatesSearchPermissions: true
    }

    QuishingSimulator.created.call(ctx)

    expect(ctx.tab).toBe('scenarios')
  })

  it('created sets landingPage when only landing page permission exists', () => {
    const ctx = {
      tab: 'scenarios',
      getPhishingScenariosSearchPermissions: false,
      getEmailTemplatesSearchPermissions: false,
      getLandingPageTemplatesSearchPermissions: true
    }

    QuishingSimulator.created.call(ctx)

    expect(ctx.tab).toBe('landingPage')
  })

  it('beforeRouteLeave handles fast-launch submitted branch with next()', () => {
    const next = jest.fn()
    const ctx = {
      $refs: {
        refScenarios: {
          isShowFastLaunchDialog: true,
          $refs: { fastLaunch: { isSubmitted: true } }
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('beforeRouteLeave closes scenario modal when new scenario is open', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refScenarios: {
          isShowNewScenarioModal: true,
          checkIfCanCLoseNewScenarioModal: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave closes fast-launch modal when dialog open and not submitted', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refScenarios: {
          isShowFastLaunchDialog: true,
          $refs: { fastLaunch: { isSubmitted: false } },
          checkIfCanCloseFastLaunchModal: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave closes grapes modal for email templates', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refEmailTemplates: {
          $refs: {
            newEmailTemplate: {
              $refs: { refEmailTemplate: { showGrapesModal: true } }
            }
          },
          checkIfCanCloseGrapesJSModal: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave closes new email template modal when modal is open', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refEmailTemplates: {
          isShowNewEmailTemplateModal: true,
          checkIfCanCloseNewEmailTemplate: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave handles new email template modal without close function', () => {
    const next = jest.fn()
    const ctx = {
      $refs: {
        refEmailTemplates: {
          isShowNewEmailTemplateModal: true
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave closes grapes modal for landing page templates', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refLandingPageList: {
          $refs: {
            newLandingPage: {
              $refs: { refEmailTemplate: { showGrapesModal: true } }
            }
          },
          checkIfCanCloseGrapesJSModal: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave handles landing page template modal branch', () => {
    const next = jest.fn()
    const closeFn = jest.fn()
    const ctx = {
      $refs: {
        refLandingPageList: {
          isShowNewLandingPageTemplateModal: true,
          checkIfCanCloseNewLandingPage: closeFn
        }
      }
    }

    QuishingSimulator.beforeRouteLeave.call(ctx, {}, {}, next)

    expect(closeFn).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith(false)
  })

  it('beforeRouteLeave falls through to next when no blockers exist', () => {
    const next = jest.fn()
    QuishingSimulator.beforeRouteLeave.call({ $refs: {} }, {}, {}, next)
    expect(next).toHaveBeenCalledWith()
  })
})
