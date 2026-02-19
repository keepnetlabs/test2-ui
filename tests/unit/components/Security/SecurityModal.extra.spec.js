import SecurityModal from '@/components/Security/SecurityModal.vue'
import { getMfaSetup } from '@/api/auth'

jest.mock('@/api/auth', () => ({
  disableMfaStatus: jest.fn(() => Promise.resolve()),
  getMfaStatus: jest.fn(() => Promise.resolve({ data: { data: { statusId: 1 } } })),
  updatePassword: jest.fn(() => Promise.resolve()),
  getMfaSetup: jest.fn(() => Promise.resolve({ data: { data: { qrCode: 'qr' } } })),
  setMfaResync: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SecurityModal.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created calls getMfaStatus', () => {
    const getMfaStatusSpy = jest.fn()
    SecurityModal.created.call({ getMfaStatus: getMfaStatusSpy })
    expect(getMfaStatusSpy).toHaveBeenCalledTimes(1)
  })

  it('getTitle returns null for unknown step', () => {
    const title = SecurityModal.computed.getTitle.call({ step: 999 })
    expect(title).toBe(null)
  })

  it('rules validate expected values', () => {
    const ctx = { newPassword: 'Same#1234' }
    const data = SecurityModal.data.call(ctx)

    expect(data.rules.required('x')).toBe(true)
    expect(data.rules.required('')).toBe('Required')

    expect(data.rules.min('12345678')).toBe(true)
    expect(data.rules.min('123')).toBe('Minimum 8 characters')

    expect(data.rules.max('a'.repeat(200))).toBe(true)
    expect(data.rules.max('a'.repeat(300))).toBe('Email address cannot exceed 254 characters')

    expect(data.rules.minPassword('Aa1!aaaa')).toBe(true)
    expect(typeof data.rules.minPassword('short')).toBe('string')

    expect(data.rules.maxPassword('Aa1!aaaa')).toBe(true)
    expect(typeof data.rules.maxPassword('')).toBe('string')

    expect(data.rules.equal('Same#1234')).toBe(true)
    expect(data.rules.equal('Different#123')).toBe(
      "'New password' and 'Confirm password' do not match"
    )
  })

  it('setupMFA swallow errors and does not change step/details on failure', async () => {
    getMfaSetup.mockRejectedValueOnce(new Error('setup failed'))
    const ctx = {
      mfaSetupDetails: null,
      step: 1
    }

    expect(() => SecurityModal.methods.setupMFA.call(ctx)).not.toThrow()
    await flushPromises()

    expect(getMfaSetup).toHaveBeenCalledTimes(1)
    expect(ctx.mfaSetupDetails).toBe(null)
    expect(ctx.step).toBe(1)
  })
})
