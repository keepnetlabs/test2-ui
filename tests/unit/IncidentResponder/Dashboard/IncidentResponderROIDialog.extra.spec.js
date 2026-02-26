import { getRoiSettings, updateRoiSettings } from '@/api/incidentResponder'
import IncidentResponderROIDialog from '@/components/IncidentResponder/Dashboard/IncidentResponderROIDialog.vue'

jest.mock('@/api/incidentResponder', () => ({
  getRoiSettings: jest.fn(),
  updateRoiSettings: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('IncidentResponderROIDialog.vue (extra branch coverage)', () => {
  const { methods } = IncidentResponderROIDialog

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits false when called without argument', () => {
    const emit = jest.fn()
    methods.handleClose.call({ $emit: emit })

    expect(emit).toHaveBeenCalledWith('on-close', false)
  })

  it('submitRoiModal resets disabled state when update api rejects', async () => {
    updateRoiSettings.mockRejectedValueOnce(new Error('fail'))
    const emit = jest.fn()
    const ctx = {
      baseManHour: 3,
      baseManHourCost: 200,
      isConfirmButtonDisabled: false,
      $emit: emit,
      handleClose: methods.handleClose,
      $refs: {
        form: {
          validate: () => true
        }
      }
    }

    methods.submitRoiModal.call(ctx)
    expect(ctx.isConfirmButtonDisabled).toBe(true)
    await flushPromises()

    expect(updateRoiSettings).toHaveBeenCalledTimes(1)
    expect(emit).not.toHaveBeenCalled()
    expect(ctx.isConfirmButtonDisabled).toBe(false)
  })

  it('callForGetRoiSettings ignores rejected api response', async () => {
    getRoiSettings.mockRejectedValueOnce(new Error('network'))
    const ctx = {
      baseManHour: 1,
      baseManHourCost: 2
    }

    methods.callForGetRoiSettings.call(ctx)
    await flushPromises()

    expect(ctx.baseManHour).toBe(1)
    expect(ctx.baseManHourCost).toBe(2)
  })
})
