import CustomGroup from '@/components/Common/QueryBuilder/CustomGroup.vue'

describe('CustomGroup.vue (extra branch coverage)', () => {
  describe('computed isRenderFirstGroupHeader', () => {
    it('returns true when hideFirstGroupHeader is false', () => {
      const ctx = {
        hideFirstGroupHeader: false,
        depth: 1,
        query: { children: [] }
      }
      expect(CustomGroup.computed.isRenderFirstGroupHeader.call(ctx)).toBe(true)
    })

    it('returns false when hideFirstGroupHeader true, depth 1, children <= 1', () => {
      const ctx = {
        hideFirstGroupHeader: true,
        depth: 1,
        query: { children: [] }
      }
      expect(CustomGroup.computed.isRenderFirstGroupHeader.call(ctx)).toBe(false)
    })

    it('returns true when hideFirstGroupHeader true but depth > 1', () => {
      const ctx = {
        hideFirstGroupHeader: true,
        depth: 2,
        query: { children: [] }
      }
      expect(CustomGroup.computed.isRenderFirstGroupHeader.call(ctx)).toBe(true)
    })

    it('returns true when hideFirstGroupHeader true, depth 1, children > 1', () => {
      const ctx = {
        hideFirstGroupHeader: true,
        depth: 1,
        query: { children: [{}, {}] }
      }
      expect(CustomGroup.computed.isRenderFirstGroupHeader.call(ctx)).toBe(true)
    })
  })

  describe('handleLogicalOperatorChange', () => {
    it('updates logicalOperator when value differs', () => {
      const ctx = {
        query: { logicalOperator: 'AND' },
        blockAnimation: true
      }
      CustomGroup.methods.handleLogicalOperatorChange.call(ctx, 'OR')
      expect(ctx.query.logicalOperator).toBe('OR')
      expect(ctx.blockAnimation).toBe(false)
    })

    it('does not update when value matches', () => {
      const ctx = {
        query: { logicalOperator: 'AND' },
        blockAnimation: true
      }
      CustomGroup.methods.handleLogicalOperatorChange.call(ctx, 'AND')
      expect(ctx.query.logicalOperator).toBe('AND')
      expect(ctx.blockAnimation).toBe(true)
    })
  })

  describe('addRule', () => {
    it('uses operators[0].value when operators have value property', () => {
      const ctx = {
        selectedRule: {
          id: 'conditions',
          operands: [{ value: 'From' }],
          operators: [{ value: 'Equal', text: 'equals' }]
        },
        ruleById: () => ({ type: 'text' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.operator).toBe('Equal')
    })

    it('uses operators[0] when operators[0].value is undefined', () => {
      const ctx = {
        selectedRule: {
          id: 'conditions',
          operands: ['From'],
          operators: ['Contains']
        },
        ruleById: () => ({ type: 'text' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.operator).toBe('Contains')
    })

    it('uses operands[0].value when operands defined', () => {
      const ctx = {
        selectedRule: {
          id: 'conditions',
          operands: [{ value: 'From', text: 'From' }],
          operators: [{ value: 'Contains', text: 'contains' }]
        },
        ruleById: () => ({ type: 'text' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('update:query', expect.any(Object))
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.operand).toBe('From')
    })

    it('uses operands[0] when operands[0].value is undefined', () => {
      const ctx = {
        selectedRule: {
          id: 'conditions',
          operands: ['From'],
          operators: ['Contains']
        },
        ruleById: () => ({ type: 'text' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.operand).toBe('From')
    })

    it('uses selectedRule.label when operands undefined', () => {
      const ctx = {
        selectedRule: {
          id: 'conditions',
          label: 'Conditions',
          operands: undefined,
          operators: [{ value: 'Contains' }]
        },
        ruleById: () => ({ type: 'text' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.operand).toBe('Conditions')
    })

    it('sets value to [] for multi-select rule type', () => {
      const ctx = {
        selectedRule: {
          id: 'multi-rule',
          operands: ['A'],
          operators: [{ value: 'Equal' }]
        },
        ruleById: () => ({ type: 'multi-select' }),
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addRule.call(ctx)
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].query.value).toEqual([])
    })
  })

  describe('addGroup', () => {
    it('emits update:query when depth < maxDepth', () => {
      const ctx = {
        depth: 1,
        maxDepth: 4,
        labels: { matchTypes: [{ id: 'OR', label: 'OR' }] },
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addGroup.call(ctx)
      expect(ctx.$emit).toHaveBeenCalledWith('update:query', expect.any(Object))
      const emittedQuery = ctx.$emit.mock.calls[0][1]
      expect(emittedQuery.children[0].type).toBe('query-builder-group')
      expect(emittedQuery.children[0].query.logicalOperator).toBe('OR')
    })

    it('does not emit when depth >= maxDepth', () => {
      const ctx = {
        depth: 4,
        maxDepth: 4,
        labels: { matchTypes: [{ id: 'OR' }] },
        query: { children: [] },
        $emit: jest.fn()
      }
      CustomGroup.methods.addGroup.call(ctx)
      expect(ctx.$emit).not.toHaveBeenCalled()
    })
  })

  describe('data and getCustomBadgeRender', () => {
    it('getCustomBadgeRender is true when depth !== 1', () => {
      const data = CustomGroup.data.call({ depth: 2 })
      expect(data.getCustomBadgeRender).toBe(true)
    })

    it('getCustomBadgeRender is false when depth === 1', () => {
      const data = CustomGroup.data.call({ depth: 1 })
      expect(data.getCustomBadgeRender).toBe(false)
    })
  })

  describe('deleteGroup', () => {
    it('sets blockAnimation and calls remove', () => {
      const remove = jest.fn()
      const ctx = { blockAnimation: false, remove }
      CustomGroup.methods.deleteGroup.call(ctx)
      expect(ctx.blockAnimation).toBe(true)
      expect(remove).toHaveBeenCalled()
    })
  })
})
