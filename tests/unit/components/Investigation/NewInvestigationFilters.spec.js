import NewInvestigationFilters from '@/components/Investigation/NewInvestigationFilters.vue'

describe('NewInvestigationFilters.vue', () => {
  it('data returns label with matchTypes', () => {
    const data = NewInvestigationFilters.data()
    expect(data.label.matchType).toBe('Match Type')
    expect(data.label.matchTypes).toContainEqual({ id: 'OR', label: 'OR' })
    expect(data.label.addRule).toBe('ADD CONDITION')
  })

  it('data returns rules with conditions type', () => {
    const data = NewInvestigationFilters.data()
    const conditionsRule = data.rules.find((r) => r.type === 'conditions')
    expect(conditionsRule).toBeDefined()
    expect(conditionsRule.label).toBe('Conditions')
    expect(conditionsRule.operands).toBeDefined()
  })
})
