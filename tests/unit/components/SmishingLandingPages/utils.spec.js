import { MERGED_TEXTS_MAP } from '@/components/SmishingLandingPages/utils'

describe('SmishingLandingPages utils', () => {
  it('contains expected merge keys', () => {
    expect(MERGED_TEXTS_MAP['{FULLNAME}']).toBeTruthy()
    expect(MERGED_TEXTS_MAP['{EMAIL}']).toBeTruthy()
    expect(MERGED_TEXTS_MAP['{PHISHINGURL}']).toBeTruthy()
    expect(Object.keys(MERGED_TEXTS_MAP).length).toBeGreaterThan(20)
  })
})
