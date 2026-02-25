import InvestigationQueryRule from '@/components/Investigation/InvestigationQueryRule.vue'

describe('InvestigationQueryRule.vue', () => {
  it('isOperatorExists returns false for Exists operator', () => {
    const ctx = { query: { operator: 'Exists' } }
    expect(InvestigationQueryRule.computed.isOperatorExists.call(ctx)).toBe(false)
  })

  it('isOperatorExists returns false for DoesNotExist operator', () => {
    const ctx = { query: { operator: 'DoesNotExist' } }
    expect(InvestigationQueryRule.computed.isOperatorExists.call(ctx)).toBe(false)
  })

  it('isOperatorExists returns true for other operators', () => {
    const ctx = { query: { operator: 'Equal' } }
    expect(InvestigationQueryRule.computed.isOperatorExists.call(ctx)).toBe(true)
  })

  it('removeRule calls removeErrorMessage and remove', () => {
    const removeErrorMessage = jest.fn()
    const remove = jest.fn()
    const ctx = { index: 0, removeErrorMessage, remove }
    InvestigationQueryRule.methods.removeRule.call(ctx)
    expect(removeErrorMessage).toHaveBeenCalledWith(0)
    expect(remove).toHaveBeenCalled()
  })
})
