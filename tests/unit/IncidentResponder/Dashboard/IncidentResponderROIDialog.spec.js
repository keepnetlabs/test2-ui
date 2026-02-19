jest.mock('@/api/incidentResponder', () => ({
  getRoiSettings: jest.fn(),
  updateRoiSettings: jest.fn()
}))

import { getRoiSettings, updateRoiSettings } from '@/api/incidentResponder'
import IncidentResponderROIDialog from '@/components/IncidentResponder/Dashboard/IncidentResponderROIDialog.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('IncidentResponderROIDialog.vue', () => {
  const { computed, methods, created } = IncidentResponderROIDialog

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('submit button disabled state follows isConfirmButtonDisabled', () => {
    expect(computed.isRoiSettingSubmitButtonDisabled.call({ isConfirmButtonDisabled: true })).toBe(
      true
    )
    expect(
      computed.isRoiSettingSubmitButtonDisabled.call({ isConfirmButtonDisabled: false })
    ).toBe(false)
  })

  it('created calls roi settings api only with permission', () => {
    const callForGetRoiSettings = jest.fn()
    created.call({
      getIncidentResponderROISettingGetPermission: true,
      callForGetRoiSettings
    })
    created.call({
      getIncidentResponderROISettingGetPermission: false,
      callForGetRoiSettings
    })

    expect(callForGetRoiSettings).toHaveBeenCalledTimes(1)
  })

  it('callForGetRoiSettings sets base values from response', async () => {
    getRoiSettings.mockResolvedValueOnce({
      data: {
        data: {
          baseManHour: 2,
          baseManHourCost: 100
        }
      }
    })
    const ctx = {
      baseManHour: null,
      baseManHourCost: null
    }

    methods.callForGetRoiSettings.call(ctx)
    await flushPromises()

    expect(ctx.baseManHour).toBe(2)
    expect(ctx.baseManHourCost).toBe(100)
  })

  it('handleClose emits on-close with forceUpdate flag', () => {
    const emit = jest.fn()
    methods.handleClose.call({ $emit: emit }, true)

    expect(emit).toHaveBeenCalledWith('on-close', true)
  })

  it('submitRoiModal validates, updates settings and resets disabled state', async () => {
    updateRoiSettings.mockResolvedValueOnce({})
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

    expect(updateRoiSettings).toHaveBeenCalledWith({
      baseManHour: 3,
      baseManHourCost: 200
    })
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.isConfirmButtonDisabled).toBe(false)
  })

  it('submitRoiModal does nothing when form is invalid', () => {
    const ctx = {
      baseManHour: 3,
      baseManHourCost: 200,
      isConfirmButtonDisabled: false,
      $refs: {
        form: {
          validate: () => false
        }
      }
    }

    methods.submitRoiModal.call(ctx)

    expect(updateRoiSettings).not.toHaveBeenCalled()
    expect(ctx.isConfirmButtonDisabled).toBe(false)
  })
})
