import EmailDetailsPreviewFooter from '@/components/IncidentResponder/EmailDetails/EmailDetailsPreviewFooter.vue'

describe('EmailDetailsPreviewFooter.vue', () => {
  const { methods } = EmailDetailsPreviewFooter

  it('getIsAnalysisMalicious returns true for malicious or phishing results', () => {
    expect(methods.getIsAnalysisMalicious([{ result: 'Malicious' }])).toBe(true)
    expect(methods.getIsAnalysisMalicious([{ result: 'Phishing' }])).toBe(true)
    expect(methods.getIsAnalysisMalicious([{ result: 'Clean' }])).toBe(false)
    expect(methods.getIsAnalysisMalicious([])).toBe(0)
  })

  it('getClass returns red or blue attach class', () => {
    const ctx = {
      getIsAnalysisMalicious: methods.getIsAnalysisMalicious
    }

    expect(methods.getClass.call(ctx, [{ result: 'Malicious' }])).toBe('red-attach')
    expect(methods.getClass.call(ctx, [{ result: 'Clean' }])).toBe('blue-attach')
  })
})
