import TargetUserLDAPModalStepperFooter from '@/components/TargetUsers/LDAP/TargetUserLDAPModalStepperFooter.vue'

describe('TargetUserLDAPModalStepperFooter.vue', () => {
  const { computed, methods } = TargetUserLDAPModalStepperFooter

  it('computes footer visibility and import button disabled style', () => {
    expect(computed.isStepIsEqualToMax.call({ step: 2, maxStep: '2' })).toBe(true)
    expect(computed.isRenderBackButton.call({ step: 1 })).toBe(false)
    expect(computed.isRenderBackButton.call({ step: 2 })).toBe(true)

    expect(
      computed.getImportButtonStyle.call({
        isEdit: false,
        totalNumberOfRecords: 0,
        isStep2Loading: false,
        isSubmitDisabled: false
      })
    ).toEqual({
      opacity: '.5',
      pointerEvents: 'none'
    })

    expect(
      computed.getImportButtonStyle.call({
        isEdit: true,
        totalNumberOfRecords: 0,
        isStep2Loading: false,
        isSubmitDisabled: false
      })
    ).toBe(false)
  })

  it('changeStep validates before moving forward and moves backward directly', () => {
    const emit = jest.fn()
    const ctx = {
      step: 1,
      $emit: emit
    }

    methods.changeStep.call(ctx)
    expect(emit).toHaveBeenCalledWith('validate-step1', expect.any(Function))

    const callback = emit.mock.calls[0][1]
    callback()
    expect(emit).toHaveBeenCalledWith('update:step', 2)

    methods.changeStep.call({ step: 2, $emit: emit }, -1)
    expect(emit).toHaveBeenCalledWith('update:step', 1)
  })

  it('handleCancel emits on-cancel', () => {
    const emit = jest.fn()

    methods.handleCancel.call({ $emit: emit })

    expect(emit).toHaveBeenCalledWith('on-cancel')
  })
})
