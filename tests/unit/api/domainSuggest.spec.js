jest.mock('axios', () => {
  const instance = { post: jest.fn() }
  return { create: () => instance }
})

import axios from 'axios'
import { suggestDomainByContent } from '@/api/domainSuggest'

// Same singleton instance the module's client was built from → its post is our spy.
const mockPost = axios.create().post

const domains = [
  { id: '1', name: 'random-store.net' },
  { id: '2', name: 'acme-bank-login.com' }
]

describe('suggestDomainByContent', () => {
  beforeEach(() => jest.clearAllMocks())

  it('posts to /suggest and returns the chosen id as a string', async () => {
    mockPost.mockResolvedValue({ data: { domainId: 2 } })
    const id = await suggestDomainByContent({ signal: 'Acme Bank', domains, language: 'en' })
    expect(id).toBe('2')
    expect(mockPost).toHaveBeenCalledWith('/suggest', {
      signal: 'Acme Bank',
      language: 'en',
      domains
    })
  })

  it('returns null (no call) when domains is empty or missing', async () => {
    expect(await suggestDomainByContent({ signal: 'x', domains: [] })).toBeNull()
    expect(await suggestDomainByContent({ signal: 'x' })).toBeNull()
    expect(await suggestDomainByContent()).toBeNull()
    expect(mockPost).not.toHaveBeenCalled()
  })

  it('returns null when the worker responds without a domainId', async () => {
    mockPost.mockResolvedValue({ data: { domainId: null } })
    expect(await suggestDomainByContent({ signal: 'x', domains })).toBeNull()
  })

  it('returns null when the request throws (worker down / timeout)', async () => {
    mockPost.mockRejectedValue(new Error('timeout'))
    expect(await suggestDomainByContent({ signal: 'x', domains })).toBeNull()
  })

  it('defaults signal/language to empty strings when omitted', async () => {
    mockPost.mockResolvedValue({ data: { domainId: '1' } })
    await suggestDomainByContent({ domains })
    expect(mockPost).toHaveBeenCalledWith('/suggest', {
      signal: '',
      language: '',
      domains
    })
  })
})
