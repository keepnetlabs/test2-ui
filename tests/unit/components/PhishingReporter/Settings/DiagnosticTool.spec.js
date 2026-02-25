jest.mock('@/api/phishingReporter', () => ({
  generateDiagnosticTool: jest.fn(() => Promise.resolve()),
  downloadDiagnosticTool: jest.fn(() => Promise.resolve())
}))

import DiagnosticTool from '@/components/PhishingReporter/Settings/DiagnosticTool.vue'

describe('PhishingReporter DiagnosticTool.vue', () => {
  it('data returns formValues with proxyMode', () => {
    const data = DiagnosticTool.data()
    expect(data.formValues.proxyMode).toBe(0)
    expect(data.formValues.proxyAddress).toBe('')
  })

  it('data returns initialFormValues', () => {
    const data = DiagnosticTool.data()
    expect(data.initialFormValues).toBeDefined()
    expect(data.initialFormValues.isEnableAddIn).toBe(false)
  })
})
