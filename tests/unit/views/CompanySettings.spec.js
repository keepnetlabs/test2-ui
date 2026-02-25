import CompanySettings from '@/views/CompanySettings.vue'

describe('CompanySettings.vue', () => {
  it('has correct component name', () => {
    expect(CompanySettings.name).toBe('CompanySettings')
  })

  it('tab watcher dispatches getAgenticAIEnabled when switching to agentic-ai-settings', () => {
    const dispatch = jest.fn()
    const ctx = {
      tab: 'agentic-ai-settings',
      hasAgenticAILicense: true,
      $store: { dispatch }
    }
    CompanySettings.watch.tab.call(ctx, 'agentic-ai-settings')
    expect(dispatch).toHaveBeenCalledWith('login/getAgenticAIEnabled')
  })
})
