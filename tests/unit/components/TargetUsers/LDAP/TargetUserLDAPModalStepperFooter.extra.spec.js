import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPModalStepperFooter from '@/components/TargetUsers/LDAP/TargetUserLDAPModalStepperFooter.vue'

describe('TargetUserLDAPModalStepperFooter.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetUserLDAPModalStepperFooter, {
      propsData: {
        step: 1,
        maxStep: 3,
        totalNumberOfRecords: 10,
        selectedItemsCount: 2,
        selectedRadioStep: 0,
        isEdit: false,
        ...propsData
      },
      provide: { isEdit: false },
      stubs: { StepperFooter: true, BackButton: true, NextButton: true }
    })

  it('isStepIsEqualToMax is false when step < maxStep', () => {
    const wrapper = createWrapper({ step: 1, maxStep: 3 })
    expect(wrapper.vm.isStepIsEqualToMax).toBe(false)
  })

  it('isStepIsEqualToMax is true when step equals maxStep', () => {
    const wrapper = createWrapper({ step: 3, maxStep: 3 })
    expect(wrapper.vm.isStepIsEqualToMax).toBe(true)
  })

  it('isRenderBackButton is false when step is 1', () => {
    const wrapper = createWrapper({ step: 1 })
    expect(wrapper.vm.isRenderBackButton).toBe(false)
  })

  it('isRenderBackButton is true when step > 1', () => {
    const wrapper = createWrapper({ step: 2 })
    expect(wrapper.vm.isRenderBackButton).toBe(true)
  })

  it('changeStep with 1 emits validate-step1', () => {
    const wrapper = createWrapper({ step: 1 })
    wrapper.vm.changeStep(1)
    expect(wrapper.emitted('validate-step1')).toBeTruthy()
  })

  it('changeStep with -1 emits update:step', () => {
    const wrapper = createWrapper({ step: 2 })
    wrapper.vm.changeStep(-1)
    expect(wrapper.emitted('update:step')).toEqual([[1]])
  })

  it('handleCancel emits on-cancel', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleCancel()
    expect(wrapper.emitted('on-cancel')).toBeTruthy()
  })
})
