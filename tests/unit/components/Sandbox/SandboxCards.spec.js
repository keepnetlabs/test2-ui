import SandboxCards from '@/components/Sandbox/SandboxCards.vue'

describe('SandboxCards.vue', () => {
  it('has correct component name', () => {
    expect(SandboxCards.name).toBe('SandboxCards')
  })

  it('accepts incidentLoading and summaryData props', () => {
    expect(SandboxCards.props.incidentLoading).toBeDefined()
    expect(SandboxCards.props.summaryData).toBeDefined()
  })
})
