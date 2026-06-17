import useShowAIAnalyze from '@/hooks/useShowAIAnalyze'
import { isTestEnvironment } from '@/utils/isTestEnvironment'

jest.mock('@/utils/isTestEnvironment', () => ({
  isTestEnvironment: jest.fn()
}))

const { showAIAnalyze } = useShowAIAnalyze.computed

const makeThis = ({
  hasAgenticAILicense = false,
  selectedCompanyName = '',
  selectedCompanyObject
} = {}) => ({
  $store: {
    getters: { 'login/getHasAgenticAILicense': hasAgenticAILicense },
    state: {
      auth: { selectedCompanyName },
      dashboard: { selectedCompanyObject }
    }
  }
})

describe('useShowAIAnalyze mixin', () => {
  beforeEach(() => {
    isTestEnvironment.mockReturnValue(false)
  })

  it('returns true when tenant has the Agentic AI license', () => {
    expect(showAIAnalyze.call(makeThis({ hasAgenticAILicense: true }))).toBe(true)
  })

  it('returns true in test environment even without license or allowed company', () => {
    isTestEnvironment.mockReturnValue(true)
    expect(showAIAnalyze.call(makeThis())).toBe(true)
  })

  it('returns true for an allowlisted company without license', () => {
    expect(
      showAIAnalyze.call(makeThis({ selectedCompanyName: 'Bolearis' }))
    ).toBe(true)
  })

  it('matches allowlisted company names case-insensitively', () => {
    expect(
      showAIAnalyze.call(makeThis({ selectedCompanyName: 'bdo uk' }))
    ).toBe(true)
  })

  it.each(['Turkey', 'Türkiye', 'turkiye'])(
    'returns true when company country name is %s',
    (countryName) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryName }
          })
        )
      ).toBe(true)
    }
  )

  it.each(['TR', 'TUR', 'tr-tr'])(
    'returns true when company country code is %s',
    (countryCode) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryCode }
          })
        )
      ).toBe(true)
    }
  )

  it('returns false when no license and no fallback case matches', () => {
    expect(
      showAIAnalyze.call(makeThis({ selectedCompanyName: 'Other' }))
    ).toBe(false)
  })

  it('returns false when company object has no country data', () => {
    expect(
      showAIAnalyze.call(
        makeThis({ selectedCompanyName: 'Other', selectedCompanyObject: {} })
      )
    ).toBe(false)
  })
})
