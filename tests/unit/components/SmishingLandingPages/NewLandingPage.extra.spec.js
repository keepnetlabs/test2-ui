jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  isDifferent: jest.fn(() => true),
  scrollToComponent: jest.fn()
}))

jest.mock('@/api/smishing', () => ({
  getLandingPageTemplate: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  createLandingPageTemplate: jest.fn(() => Promise.resolve()),
  updateLandingPageTemplate: jest.fn(() => Promise.resolve()),
  searchLandingPageTemplates: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } }))
}))

import NewLandingPage from '@/components/SmishingLandingPages/NewLandingPage.vue'
import { isDifferent, scrollToComponent } from '@/utils/functions'
import SmishingService from '@/api/smishing'

describe('SmishingLandingPages NewLandingPage.vue (extra branches)', () => {
  const { methods } = NewLandingPage

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('changeNewEmailTemplateModalStatus opens leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formValues: { name: 'new' },
      initialFormValues: { name: 'old' },
      $emit: emit,
      $store: { dispatch }
    }

    methods.changeNewEmailTemplateModalStatus.call(ctx)

    expect(isDifferent).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false)
  })

  it('nextStep scrolls to validation error when form is invalid', () => {
    const ctx = {
      step: 1,
      availableForRequests: [],
      $refs: {
        refFormStep1: {
          validate: jest.fn(() => false),
          $el: {
            querySelector: jest.fn(() => '#error')
          }
        }
      }
    }

    methods.nextStep.call(ctx)

    expect(ctx.step).toBe(1)
    expect(scrollToComponent).toHaveBeenCalledWith('#error')
  })

  it('submit uses create API when not edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      emailTemplateId: 'id-1',
      isSubmitDisabled: false,
      availableForRequests: [{ id: 1 }],
      formValues: {
        name: 'x',
        phishingLink: { subDomain: 'a' }
      },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => ['mapped'])
        }
      },
      $emit: emit
    }

    methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(SmishingService.createLandingPageTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ availableForRequests: ['mapped'] })
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit uses update API when edit mode and not duplicate', async () => {
    const emit = jest.fn()
    const ctx = {
      isEdit: true,
      isDuplicate: false,
      emailTemplateId: 'id-2',
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: {
        name: 'x',
        phishingLink: { subDomain: 'a' }
      },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => true) },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true,
          getAvailableForValues: jest.fn(() => [])
        }
      },
      $emit: emit
    }

    methods.submit.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(SmishingService.updateLandingPageTemplate).toHaveBeenCalledWith(
      'id-2',
      expect.any(Object)
    )
    expect(emit).toHaveBeenCalledWith('changeNewEmailTemplateModalStatus', false, true)
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit resets disable flag on invalid form and scrolls error', () => {
    const ctx = {
      isEdit: false,
      isDuplicate: false,
      isSubmitDisabled: false,
      availableForRequests: [],
      formValues: { phishingLink: {} },
      $refs: {
        refEmailTemplateContent: { validate: jest.fn(() => false) },
        refFormStep1: {
          $el: { querySelector: jest.fn(() => '#err') }
        },
        refMakeAvailableFor: {
          validateAvailableFor: jest.fn(),
          isAvailableForValid: true
        }
      }
    }

    methods.submit.call(ctx)

    expect(scrollToComponent).toHaveBeenCalledWith('#err')
    expect(ctx.isSubmitDisabled).toBe(false)
  })
})
