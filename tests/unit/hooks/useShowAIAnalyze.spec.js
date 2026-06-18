import useShowAIAnalyze, {
  isAllowedByLegacyFallback
} from '@/hooks/useShowAIAnalyze'
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

  // AI analysis is gated exactly like Company Settings gates the Agentic AI tab:
  // permission + the Agentic AI license. The legacy company/country allowlist no
  // longer grants access on its own (it caused the very inconsistency below).
  it('returns true when tenant has the Agentic AI license and permission', () => {
    expect(showAIAnalyze.call(makeThis({ hasAgenticAILicense: true }))).toBe(true)
  })

  it('returns false without the Agentic AI permission, even with license', () => {
    expect(
      showAIAnalyze.call(
        makeThis({ hasAgenticAILicense: true, hasAgenticAIPermission: false })
      )
    ).toBe(false)
  })

  it('returns false without the license, even for an allowlisted company', () => {
    expect(
      showAIAnalyze.call(makeThis({ selectedCompanyName: 'Bolearis' }))
    ).toBe(false)
  })

  it.each(['Turkey', 'Türkiye', 'turkiye'])(
    'returns false without the license, even when country is %s',
    (countryName) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryName }
          })
        )
      ).toBe(false)
    }
  )

  it.each(['TR', 'TUR', 'tr-tr'])(
    'returns false without the license, even when country code is %s',
    (countryCode) => {
      expect(
        showAIAnalyze.call(
          makeThis({
            selectedCompanyName: 'Other',
            selectedCompanyObject: { countryCode }
          })
        )
      ).toBe(false)
    }
  )

  it('returns false when permitted but unlicensed (consistent with Company Settings)', () => {
    expect(
      showAIAnalyze.call(
        makeThis({ hasAgenticAILicense: false, selectedCompanyName: 'Other' })
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

  // The legacy allowlist is retained (exported) for reference / rollback but is
  // no longer part of the live gate. These tests document that the function
  // still behaves as before, should it ever need to be re-enabled.
  describe('isAllowedByLegacyFallback (retained, not in live gate)', () => {
    const makeStore = ({ selectedCompanyName = '', selectedCompanyObject } = {}) => ({
      state: {
        auth: { selectedCompanyName },
        dashboard: { selectedCompanyObject }
      }
    })

    it('returns true in test environment', () => {
      isTestEnvironment.mockReturnValue(true)
      expect(isAllowedByLegacyFallback(makeStore())).toBe(true)
    })

    it('matches allowlisted company names case-insensitively', () => {
      expect(
        isAllowedByLegacyFallback(makeStore({ selectedCompanyName: 'bdo uk' }))
      ).toBe(true)
    })

    it.each(['Turkey', 'Türkiye', 'turkiye'])(
      'returns true when company country name is %s',
      (countryName) => {
        expect(
          isAllowedByLegacyFallback(
            makeStore({
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
          isAllowedByLegacyFallback(
            makeStore({
              selectedCompanyName: 'Other',
              selectedCompanyObject: { countryCode }
            })
          )
        ).toBe(true)
      }
    )

    it('returns false when no allowlist or country case matches', () => {
      expect(
        isAllowedByLegacyFallback(makeStore({ selectedCompanyName: 'Other' }))
      ).toBe(false)
      expect(
        isAllowedByLegacyFallback(
          makeStore({ selectedCompanyName: 'Other', selectedCompanyObject: {} })
        )
      ).toBe(false)
    })
  })
})
