jest.mock('@/utils/functions', () => ({
  getTimeZoneForMoment: jest.fn(() => 'YYYY-MM-DD HH:mm'),
  isDifferent: jest.fn(),
  getErrorMessage: jest.fn(() => 'error'),
  cancellableAxiosRequest: jest.fn((fn) => fn),
  getDefaultAxiosPayload: jest.fn(() => ({ filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } }))
}))
jest.mock('@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSummary', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSmishingScenarios', () => ({}))
jest.mock('@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience', () => ({}))
jest.mock('@/components/SmishingCampaignManager/CampaignManagerSMSSettings', () => ({}))
jest.mock('@/api/smishing', () => ({}))
jest.mock('@/api/targetUsers', () => ({
  getTargetGroupCountDetail: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() => Promise.resolve([]))
}))

import CampaignManagerAddOrEditModal from '@/components/SmishingCampaignManager/CampaignManagerAddOrEditModal.vue'
import { isDifferent } from '@/utils/functions'

describe('SmishingCampaignManager CampaignManagerAddOrEditModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getTitle and isMFAScenarioSelected branches', () => {
    expect(CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: false })).toContain('New')
    expect(CampaignManagerAddOrEditModal.computed.getTitle.call({ isEdit: true })).toContain('Edit')

    expect(
      CampaignManagerAddOrEditModal.computed.isMFAScenarioSelected.call({
        selectedPhishingScenarios: [{ method: 'Click-Only' }]
      })
    ).toBe(false)
    expect(
      CampaignManagerAddOrEditModal.computed.isMFAScenarioSelected.call({
        selectedPhishingScenarios: [{ method: 'MFA' }]
      })
    ).toBe(true)
  })

  it('changeStep and setActionButtonDisability mutate state', () => {
    const ctx = { step: 1, isActionButtonDisabled: false }
    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    CampaignManagerAddOrEditModal.methods.changeStep.call(ctx, -1)
    expect(ctx.step).toBe(1)
    CampaignManagerAddOrEditModal.methods.setActionButtonDisability.call(ctx, true)
    expect(ctx.isActionButtonDisabled).toBe(true)
  })

  it('closeOverlay emits on-close when unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'x' })),
      initialFormValues: { name: 'x' },
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('closeOverlay opens leaving dialog when changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const ctx = {
      getFormValues: jest.fn(() => ({ name: 'y' })),
      initialFormValues: { name: 'x' },
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() }
    }
    CampaignManagerAddOrEditModal.methods.closeOverlay.call(ctx)
    expect(ctx.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleSubmit step 1 and 2 validation branches', async () => {
    const ctxStep1 = {
      step: 1,
      changeStep: jest.fn(),
      $refs: { refCampaignManagerCampaignInfo: { validateForm: jest.fn(() => false) } }
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep1)
    expect(ctxStep1.changeStep).not.toHaveBeenCalled()
    ctxStep1.$refs.refCampaignManagerCampaignInfo.validateForm = jest.fn(() => true)
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep1)
    expect(ctxStep1.changeStep).toHaveBeenCalled()

    const ctxStep2 = {
      step: 2,
      changeStep: jest.fn(),
      selectedPhishingScenarios: [],
      isPhishingScenariosValid: true
    }
    await CampaignManagerAddOrEditModal.methods.handleSubmit.call(ctxStep2)
    expect(ctxStep2.isPhishingScenariosValid).toBe(false)
    expect(ctxStep2.changeStep).not.toHaveBeenCalled()
  })
})
