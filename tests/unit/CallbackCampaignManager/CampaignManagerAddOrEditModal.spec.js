jest.mock('@/api/callback', () => ({
  getCallbackCampaign: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  calculateScheduleInfo: jest.fn(() => Promise.resolve({ data: { data: { isStarting: true } } })),
  createCallbackCampaign: jest.fn(() => Promise.resolve({}))
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([{ isoFriendlyName: 'EN', name: 'English', resourceId: 'lang-1' }])
  )
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [{ status: 'Active', count: 3 }]
      }
    })
  )
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD'),
    isDifferent: jest.fn(() => false)
  }
})

import CampaignManagerAddOrEditModal from '@/components/CallbackCampaignManager/CampaignManagerAddOrEditModal.vue'
import CallbackService from '@/api/callback'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import { isDifferent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CallbackCampaignManager/CampaignManagerAddOrEditModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title, available count and save button text branches', () => {
    expect(
      CampaignManagerAddOrEditModal.computed.getAvailableNumberCount.call({ availableNumbers: 9 })
    ).toBe(9)
    expect(
      CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: false })
    ).toBe('New Callback Campaign')
    expect(
      CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: true })
    ).toBe('Edit Callback Campaign')

    expect(
      CampaignManagerAddOrEditModal.computed.getSaveButtonText.call({
        step: 3,
        getSaveText: 'Schedule'
      })
    ).toBe('NEXT')
    expect(
      CampaignManagerAddOrEditModal.computed.getSaveButtonText.call({
        step: 5,
        getSaveText: 'Schedule'
      })
    ).toBe('Schedule')
  })

  it('computes showSchedule and resource id values', () => {
    const noSchedule = CampaignManagerAddOrEditModal.computed.showSchedule.call({
      step: 4,
      $refs: {}
    })
    expect(noSchedule).toBe(false)

    const schedule = CampaignManagerAddOrEditModal.computed.showSchedule.call({
      step: 5,
      $refs: {
        refCampaignManagerDeliverySettings: {
          inputScheduleFormData: { scheduleTypeId: '1' },
          formData: { frequency: 2 }
        }
      }
    })
    expect(schedule).toBe(true)

    expect(
      CampaignManagerAddOrEditModal.computed.getCampaignResourceId.call({
        selectedRow: { resourceId: 'r-1' }
      })
    ).toBe('r-1')
  })

  it('watchers update phishing validity and step 4 delivery defaults', () => {
    const ctx = { isPhishingScenariosValid: true }
    CampaignManagerAddOrEditModal.watch.selectedPhishingScenarios.call(ctx, [])
    expect(ctx.isPhishingScenariosValid).toBe(false)

    const stepCtx = {
      $refs: {
        refCampaignManagerDeliverySettings: {
          callForEmailDeliveries: jest.fn(),
          inputScheduleFormData: { scheduledDate: '', scheduleTypeId: '3' }
        }
      },
      $moment: () => ({ format: () => '2026-02-23' })
    }
    CampaignManagerAddOrEditModal.watch.step.call(stepCtx, 4)
    expect(
      stepCtx.$refs.refCampaignManagerDeliverySettings.callForEmailDeliveries
    ).toHaveBeenCalled()
    expect(stepCtx.$refs.refCampaignManagerDeliverySettings.inputScheduleFormData.scheduledDate).toBe(
      '2026-02-23'
    )
  })

  it('callForLanguages maps lookup response', async () => {
    const ctx = { languageOptions: [] }
    CampaignManagerAddOrEditModal.methods.callForLanguages.call(ctx)
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(ctx.languageOptions).toEqual([
      { text: 'EN', languageTypeName: 'English', value: 'lang-1' }
    ])
  })

  it('closeOverlay emits close when unchanged and dispatches leaving dialog when changed', () => {
    const emit = jest.fn()
    const dispatch = jest.fn()
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'A' })),
      initialFormValues: { name: 'A' },
      $emit: emit,
      $store: { dispatch }
    }
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(isDifferent).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-close')

    isDifferent.mockReturnValueOnce(true)
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleSubmit step 1 validates campaign info and advances on success', async () => {
    const changeStep = jest.fn()
    const ctxInvalid = {
      step: 1,
      $refs: { refCampaignManagerCampaignInfo: { validateForm: () => false } },
      changeStep
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxInvalid)
    expect(changeStep).not.toHaveBeenCalled()

    const ctxValid = {
      step: 1,
      $refs: { refCampaignManagerCampaignInfo: { validateForm: () => true } },
      changeStep: jest.fn()
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxValid)
    expect(ctxValid.changeStep).toHaveBeenCalled()
  })

  it('handleSubmit step 2 validates scenario count and snackbar branch', async () => {
    const dispatch = jest.fn()
    const ctx = {
      step: 2,
      availableNumbers: 1,
      selectedPhishingScenarios: [{ resourceId: 'a' }, { resourceId: 'b' }],
      isPhishingScenariosValid: true,
      changeStep: jest.fn(),
      $store: { dispatch }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)

    expect(ctx.isPhishingScenariosValid).toBe(true)
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ icon: 'mdi-alert' })
    )
    expect(ctx.changeStep).not.toHaveBeenCalled()
  })

  it('handleSubmit step 4 handles schedule info success/fail paths', async () => {
    const setActionButtonDisability = jest.fn()
    const changeStep = jest.fn()
    const refCampaignManagerDeliverySettings = {
      validateForm: () => true,
      inputScheduleFormData: {
        scheduleTypeId: '3',
        scheduledDate: '2026-02-23',
        scheduledDateTimeZoneId: 'tz-1'
      },
      formData: { frequency: 1 }
    }
    const ctx = {
      step: 4,
      selectedPhishingScenarios: [{ resourceId: 's1' }],
      $refs: { refCampaignManagerDeliverySettings },
      setActionButtonDisability,
      scheduleInfoResponse: null,
      changeStep
    }

    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctx)
    expect(CallbackService.calculateScheduleInfo).toHaveBeenCalled()
    expect(ctx.scheduleInfoResponse).toEqual({ isStarting: true })
    expect(changeStep).toHaveBeenCalled()
  })
})
