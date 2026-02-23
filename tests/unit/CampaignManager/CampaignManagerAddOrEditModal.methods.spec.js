jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn(() =>
      Promise.resolve([
        {
          name: 'English',
          isoFriendlyName: 'EN',
          description: 'English Language',
          resourceId: 'lang-en'
        }
      ])
    )
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    isDifferent: jest.fn(() => false)
  }
})

import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerAddOrEditModal.methods', () => {
  it('toggleShowMissingLanguageSupportDialog toggles boolean state', () => {
    const ctx = { isShowMissingLanguageSupportDialog: false }

    CampaignManagerAddOrEditModal.methods.toggleShowMissingLanguageSupportDialog.call(ctx)
    expect(ctx.isShowMissingLanguageSupportDialog).toBe(true)

    CampaignManagerAddOrEditModal.methods.toggleShowMissingLanguageSupportDialog.call(ctx)
    expect(ctx.isShowMissingLanguageSupportDialog).toBe(false)
  })

  it('onConfirmLanguageSupportDialog moves to step 2 and closes dialog', () => {
    const ctx = { step: 4, isShowMissingLanguageSupportDialog: true }

    CampaignManagerAddOrEditModal.methods.onConfirmLanguageSupportDialog.call(ctx)

    expect(ctx.step).toBe(2)
    expect(ctx.isShowMissingLanguageSupportDialog).toBe(false)
  })

  it('changeStep updates step and resets second-next flag when step becomes 2', () => {
    const ctx = { step: 1, isSecondNextClicked: true }

    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    expect(ctx.isSecondNextClicked).toBe(false)

    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(3)
  })

  it('setActionButtonDisability sets explicit and default values', () => {
    const ctx = { isActionButtonDisabled: false }

    CampaignManagerAddOrEditModal.methods.setActionButtonDisability.call(ctx, true)
    expect(ctx.isActionButtonDisabled).toBe(true)

    CampaignManagerAddOrEditModal.methods.setActionButtonDisability.call(ctx)
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleClickOutsidePhishingDrawer ignores click when leaving dialog is open', () => {
    const closeSpy = jest.fn()
    const ctx = {
      $store: { state: { common: { isShowLeavingDialog: true } } },
      handleCloseSimulatorDrawer: closeSpy
    }

    CampaignManagerAddOrEditModal.methods.handleClickOutsidePhishingDrawer.call(ctx, {
      target: { closest: jest.fn(() => null) }
    })

    expect(closeSpy).not.toHaveBeenCalled()
  })

  it('handleClickOutsidePhishingDrawer ignores snackbar and leaving-popup clicks', () => {
    const closeSpy = jest.fn()
    const closest = jest
      .fn()
      .mockReturnValueOnce({}) // snackbar selector
      .mockReturnValueOnce(null)
    const ctx = {
      $store: { state: { common: { isShowLeavingDialog: false } } },
      handleCloseSimulatorDrawer: closeSpy
    }

    CampaignManagerAddOrEditModal.methods.handleClickOutsidePhishingDrawer.call(ctx, {
      target: { closest }
    })
    expect(closeSpy).not.toHaveBeenCalled()

    const closestLeave = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({}) // leaving dialog selector
    CampaignManagerAddOrEditModal.methods.handleClickOutsidePhishingDrawer.call(ctx, {
      target: { closest: closestLeave }
    })
    expect(closeSpy).not.toHaveBeenCalled()
  })

  it('handleClickOutsidePhishingDrawer closes drawer for normal outside click', () => {
    const closeSpy = jest.fn()
    const ctx = {
      $store: { state: { common: { isShowLeavingDialog: false } } },
      handleCloseSimulatorDrawer: closeSpy
    }

    CampaignManagerAddOrEditModal.methods.handleClickOutsidePhishingDrawer.call(ctx, {
      target: { closest: jest.fn(() => null) }
    })

    expect(closeSpy).toHaveBeenCalled()
  })

  it('handleCreatePhishingScenario and handleCloseSimulatorDrawer toggle drawer state', () => {
    const ctx = { isOpenPhishingDrawer: false }

    CampaignManagerAddOrEditModal.methods.handleCreatePhishingScenario.call(ctx)
    expect(ctx.isOpenPhishingDrawer).toBe(true)

    CampaignManagerAddOrEditModal.methods.handleCloseSimulatorDrawer.call(ctx)
    expect(ctx.isOpenPhishingDrawer).toBe(false)
  })

  it('handleNewScenarioCreated reloads list and selects created scenario', async () => {
    const createdItem = { resourceId: 'r-2' }
    const callForPhishingScenarios = jest.fn(() =>
      Promise.resolve([{ resourceId: 'r-1' }, createdItem])
    )
    const callForSelectedPhishingScenario = jest.fn()
    const ctx = {
      $refs: {
        refCampaignManagerPhishingScenarios: {
          callForPhishingScenarios,
          callForSelectedPhishingScenario
        }
      }
    }

    CampaignManagerAddOrEditModal.methods.handleNewScenarioCreated.call(ctx, 'r-2')
    await flushPromises()

    expect(callForPhishingScenarios).toHaveBeenCalledWith(false)
    expect(callForSelectedPhishingScenario).toHaveBeenCalledWith('r-2', createdItem)
  })

  it('callForLanguages maps lookup response to languageOptions', async () => {
    const ctx = { languageOptions: [] }

    CampaignManagerAddOrEditModal.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      {
        name: 'English',
        languageTypeName: 'English',
        text: 'EN',
        description: 'English Language',
        value: 'lang-en'
      }
    ])
  })

  it('closeOverlay emits close directly when form is not changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      initialFormValues: { a: 1 },
      getFormValues: jest.fn(() => ({ a: 1 })),
      $emit: emit,
      $store: { dispatch }
    }

    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)

    expect(emit).toHaveBeenCalledWith('on-close')
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay opens leaving dialog when form is changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      initialFormValues: { a: 1 },
      getFormValues: jest.fn(() => ({ a: 2 })),
      $emit: emit,
      $store: { dispatch }
    }

    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
    expect(emit).not.toHaveBeenCalled()
  })
})
