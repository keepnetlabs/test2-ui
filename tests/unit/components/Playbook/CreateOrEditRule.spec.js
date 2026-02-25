import CreateOrEditRule from '@/components/Playbook/CreateOrEditRule.vue'

describe('CreateOrEditRule.vue', () => {
  it('canNext returns true when activeStep less than totalStep', () => {
    const ctx = { activeStep: 1, totalStep: 3 }
    expect(CreateOrEditRule.computed.canNext.call(ctx)).toBe(true)
  })

  it('canNext returns false when activeStep equals totalStep', () => {
    const ctx = { activeStep: 3, totalStep: 3 }
    expect(CreateOrEditRule.computed.canNext.call(ctx)).toBe(false)
  })

  it('canPrev returns true when activeStep greater than 1', () => {
    const ctx = { activeStep: 2, totalStep: 3 }
    expect(CreateOrEditRule.computed.canPrev.call(ctx)).toBe(true)
  })

  it('canPrev returns false when activeStep is 1', () => {
    const ctx = { activeStep: 1, totalStep: 3 }
    expect(CreateOrEditRule.computed.canPrev.call(ctx)).toBe(false)
  })
})
