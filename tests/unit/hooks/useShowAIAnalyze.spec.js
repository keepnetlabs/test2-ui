import useShowAIAnalyze from '@/hooks/useShowAIAnalyze'
import { isTestEnvironment } from '@/utils/isTestEnvironment'

jest.mock('@/utils/isTestEnvironment', () => ({
  isTestEnvironment: jest.fn()
}))

const { showAIAnalyze, hasAgenticAIPermission } = useShowAIAnalyze.computed

const makeThis = ({
  hasAgenticAILicense = false,
  hasAgenticAIPermission: permission = true,
  selectedCompanyName = '',
  selectedCompanyObject
} = {}) => {
  const ctx = {
    $store: {
      getters: {
        'login/getHasAgenticAILicense': hasAgenticAILicense,
        'permissions/getAgenticAISettingsGetPermissions': permission
      },
      state: {
        auth: { selectedCompanyName },
        dashboard: { selectedCompanyObject }
      }
    }
  }
  // showAIAnalyze reads this.hasAgenticAIPermission (the same computed in the
  // mixin), so resolve it onto the context the way Vue would on the instance.
  ctx.hasAgenticAIPermission = hasAgenticAIPermission.call(ctx)
  return ctx
}

describe('useShowAIAnalyze mixin', () => {
  beforeEach(() => {
    isTestEnvironment.mockReturnValue(false)
  })

  it('returns true when tenant has the Agentic AI license', () => {
    expect(showAIAnalyze.call(makeThis({ hasAgenticAILicense: true }))).toBe(true)
  })

  it('returns false without the Agentic AI permission, even with license', () => {
    expect(
      showAIAnalyze.call(
        makeThis({ hasAgenticAILicense: true, hasAgenticAIPermission: false })
      )
    ).toBe(false)
  })

  it('returns false without the Agentic AI permission, even for an allowlisted company', () => {
    expect(
      showAIAnalyze.call(
        makeThis({ selectedCompanyName: 'Bolearis', hasAgenticAIPermission: false })
      )
    ).toBe(false)
  })

  it.each(['Turkey', 'Türkiye', 'turkiye'])(
    'returns false without the Agentic AI permission, even when country is %s',
    (countryName) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryName },
            hasAgenticAIPermission: false
          })
        )
      ).toBe(false)
    }
  )

  it.each(['TR', 'TUR', 'tr-tr'])(
    'returns false without the Agentic AI permission, even when country code is %s',
    (countryCode) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryCode },
            hasAgenticAIPermission: false
          })
        )
      ).toBe(false)
    }
  )

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

  describe('hasAgenticAIPermission', () => {
    it('reflects the Agentic AI settings permission getter', () => {
      expect(
        hasAgenticAIPermission.call(makeThis({ hasAgenticAIPermission: true }))
      ).toBe(true)
      expect(
        hasAgenticAIPermission.call(makeThis({ hasAgenticAIPermission: false }))
      ).toBe(false)
    })
  })
})
