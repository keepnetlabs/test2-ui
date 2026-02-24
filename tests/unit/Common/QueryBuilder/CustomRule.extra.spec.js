import CustomRule from '@/components/Common/QueryBuilder/CustomRule.vue'

describe('CustomRule.vue (extra branch coverage)', () => {

  const createRuleContext = (overrides = {}) => ({
    query: {
      operand: 'From',
      operator: 'Contains',
      format: 'Email',
      value: ''
    },
    validations: {
      required: () => true,
      maxLength: () => true,
      mail: () => true,
      email: () => true,
      controlEmailLength: () => false,
      domain: () => true,
      minLength: () => true,
      extension: () => true,
      startsWithSpace: () => true,
      ip: () => true
    },
    $parent: {
      query: { children: [] },
      $parent: { index: 0 }
    },
    ...overrides
  })

  describe('computed getParentIndex', () => {
    it('returns parent index when available', () => {
      const ctx = createRuleContext({
        $parent: { $parent: { index: 2 } }
      })
      expect(CustomRule.computed.getParentIndex.call(ctx)).toBe(2)
    })

    it('returns "0" when parent index not available', () => {
      const ctx = createRuleContext({
        $parent: { $parent: {} }
      })
      expect(CustomRule.computed.getParentIndex.call(ctx)).toBe('0')
    })
  })

  describe('computed isOperatorExists', () => {
    it('returns true when operator is not Exists or DoesNotExist', () => {
      const ctx = { query: { operator: 'Contains' } }
      expect(CustomRule.computed.isOperatorExists.call(ctx)).toBe(true)
    })

    it('returns false when operator is Exists', () => {
      const ctx = { query: { operator: 'Exists' } }
      expect(CustomRule.computed.isOperatorExists.call(ctx)).toBe(false)
    })

    it('returns false when operator is DoesNotExist', () => {
      const ctx = { query: { operator: 'DoesNotExist' } }
      expect(CustomRule.computed.isOperatorExists.call(ctx)).toBe(false)
    })
  })

  describe('getRules', () => {
    it('returns empty array when query is null', () => {
      expect(CustomRule.methods.getRules.call(createRuleContext({ query: null }))).toEqual([])
    })

    it('returns Email validation rules when format is Email', () => {
      const ctx = createRuleContext({
        query: { format: 'Email', operator: 'Equal' }
      })
      const rules = CustomRule.methods.getRules.call(ctx)
      expect(rules.length).toBeGreaterThan(0)
    })

    it('returns Domain validation rules when format is Domain', () => {
      const ctx = createRuleContext({
        query: { format: 'Domain', operator: 'Equal' }
      })
      const rules = CustomRule.methods.getRules.call(ctx)
      expect(rules.length).toBeGreaterThan(0)
    })

    it('returns Regex validation rules when format is Regex', () => {
      const ctx = createRuleContext({
        query: { format: 'Regex' }
      })
      const rules = CustomRule.methods.getRules.call(ctx)
      expect(rules.length).toBeGreaterThan(0)
    })

    it('returns Group validation rules when format is Group', () => {
      const ctx = createRuleContext({
        query: { format: 'Group' }
      })
      const rules = CustomRule.methods.getRules.call(ctx)
      expect(rules.length).toBeGreaterThan(0)
    })

    it('returns default required rule for unknown format', () => {
      const ctx = createRuleContext({
        query: { format: 'Unknown' }
      })
      const rules = CustomRule.methods.getRules.call(ctx)
      expect(rules.length).toBe(1)
    })
  })

  describe('getPlaceholder', () => {
    it('returns default when query.format is missing', () => {
      const ctx = createRuleContext({ query: {} })
      expect(CustomRule.methods.getPlaceholder.call(ctx)).toBe('Enter custom field value')
    })

    it('returns Email placeholder when format is Email', () => {
      const ctx = createRuleContext({ query: { format: 'Email' } })
      expect(CustomRule.methods.getPlaceholder.call(ctx)).toBe('Enter an email address')
    })

    it('returns Domain placeholder when format is Domain', () => {
      const ctx = createRuleContext({ query: { format: 'Domain' } })
      expect(CustomRule.methods.getPlaceholder.call(ctx)).toBe('Enter a domain address')
    })

    it('returns Regex placeholder when format is Regex', () => {
      const ctx = createRuleContext({ query: { format: 'Regex' } })
      expect(CustomRule.methods.getPlaceholder.call(ctx)).toBe('Enter a regular expression')
    })

    it('returns Group placeholder when format is Group', () => {
      const ctx = createRuleContext({ query: { format: 'Group' } })
      expect(CustomRule.methods.getPlaceholder.call(ctx)).toBe('Enter a group name')
    })
  })

  describe('handleOperandChange', () => {
    it('sets SenderIp operator and format', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'SenderIp')
      expect(ctx.query.operator).toBe('Equal')
      expect(ctx.query.format).toBe('Ip')
    })

    it('sets Analysis result value to Phishing', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'Analysis result')
      expect(ctx.query.value).toBe('Phishing')
    })

    it('sets format to Email for To', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'To')
      expect(ctx.query.format).toBe('Email')
    })

    it('sets format to Email for CC', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'CC')
      expect(ctx.query.format).toBe('Email')
    })

    it('sets format to Email for From', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'From')
      expect(ctx.query.format).toBe('Email')
    })

    it('sets operator to Contains for Keyword', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'Keyword')
      expect(ctx.query.operator).toBe('Contains')
    })

    it('sets format to Custom for other operands', () => {
      const ctx = createRuleContext()
      CustomRule.methods.handleOperandChange.call(ctx, 'Subject')
      expect(ctx.query.format).toBe('Custom')
    })
  })

  describe('isDeleteRuleButton', () => {
    it('returns true when more than one rule', () => {
      const ctx = createRuleContext({
        $parent: {
          $parent: {
            query: {
              children: [
                { type: 'query-builder-rule' },
                { type: 'query-builder-rule' }
              ]
            }
          }
        }
      })
      expect(CustomRule.methods.isDeleteRuleButton.call(ctx)).toBe(true)
    })

    it('returns false when only one rule', () => {
      const ctx = createRuleContext({
        $parent: {
          $parent: {
            query: {
              children: [{ type: 'query-builder-rule' }]
            }
          }
        }
      })
      expect(CustomRule.methods.isDeleteRuleButton.call(ctx)).toBe(false)
    })
  })
})
