import TestQueryBuilder from '@/components/TestHelpers/TestQueryBuilder.vue'

describe('TestQueryBuilder.vue', () => {
  it('data returns default query with logicalOperator', () => {
    const data = TestQueryBuilder.data.call({ defaultQuery: undefined })
    expect(data.query.logicalOperator).toBe('AND')
    expect(data.query.children).toBeDefined()
    expect(data.query.children.length).toBeGreaterThan(0)
  })

  it('data uses defaultQuery when provided', () => {
    const defaultQuery = { logicalOperator: 'OR', children: [] }
    const data = TestQueryBuilder.data.call({ defaultQuery })
    expect(data.query).toEqual(defaultQuery)
  })

  it('data returns rules with conditions type', () => {
    const data = TestQueryBuilder.data.call({ defaultQuery: undefined })
    expect(data.rules).toBeDefined()
    const conditionsRule = data.rules.find((r) => r.type === 'conditions')
    expect(conditionsRule).toBeDefined()
    expect(conditionsRule.label).toBe('Conditions')
  })
})
