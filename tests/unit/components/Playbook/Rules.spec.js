import Rules from '@/components/Playbook/Rules.vue'

describe('Rules.vue', () => {
  it('getTitle returns Create New Rule when no selectedPlaybookId', () => {
    const ctx = { selectedPlaybookId: null }
    expect(Rules.computed.getTitle.call(ctx)).toBe('Create New Rule')
  })

  it('getTitle returns Edit Rule when selectedPlaybookId exists', () => {
    const ctx = { selectedPlaybookId: 'pb1' }
    expect(Rules.computed.getTitle.call(ctx)).toBe('Edit Rule')
  })

  it('getIconName returns mdi-plus when no selectedPlaybookId', () => {
    const ctx = { selectedPlaybookId: null }
    expect(Rules.computed.getIconName.call(ctx)).toBe('mdi-plus')
  })

  it('getIconName returns mdi-pencil when selectedPlaybookId exists', () => {
    const ctx = { selectedPlaybookId: 'pb1' }
    expect(Rules.computed.getIconName.call(ctx)).toBe('mdi-pencil')
  })

  it('toggleRuleModal toggles showRuleModal and clears selectedPlaybookId', () => {
    const ctx = { showRuleModal: false, selectedPlaybookId: 'pb1' }
    Rules.methods.toggleRuleModal.call(ctx)
    expect(ctx.showRuleModal).toBe(true)
    expect(ctx.selectedPlaybookId).toBeNull()
  })
})
