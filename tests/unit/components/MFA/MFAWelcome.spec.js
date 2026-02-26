jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  datePrettier: jest.fn(() => 'Jan 01, 2026')
}))

import MFAWelcome from '@/components/MFA/MFAWelcome.vue'
import { datePrettier } from '@/utils/functions'

describe('MFAWelcome.vue', () => {
  it('returns false when expire time does not exist', () => {
    expect(MFAWelcome.computed.getExpireTime.call({ mfaDetails: null })).toBe(false)
    expect(MFAWelcome.computed.getExpireTime.call({ mfaDetails: {} })).toBe(false)
  })

  it('formats expire time with datePrettier', () => {
    const ctx = { mfaDetails: { ExpireTime: '2026-02-25T10:00:00Z' } }
    const result = MFAWelcome.computed.getExpireTime.call(ctx)
    expect(datePrettier).toHaveBeenCalledWith('2026-02-25T10:00:00Z')
    expect(result).toBe('Jan 01, 2026')
  })
})
