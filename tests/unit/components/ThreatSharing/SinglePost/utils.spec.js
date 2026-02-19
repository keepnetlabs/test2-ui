import {
  getTlcClass,
  getTlcTooltip,
  getTlcName,
  findCategory,
  getCategories
} from '@/components/ThreatSharing/SinglePost/utils'

describe('ThreatSharing SinglePost utils', () => {
  it('maps TLP ids to class, tooltip and name', () => {
    expect(getTlcClass('wKBhLuFZ46y9')).toBe('TLP-GREEN')
    expect(getTlcTooltip('YpUZxVhYJlKg')).toContain('participants only')
    expect(getTlcName('wFlYRDMW946M')).toBe('TLP: WHITE')
  })

  it('returns empty string for unknown values', () => {
    expect(getTlcClass('unknown')).toBe('')
    expect(getTlcTooltip('unknown')).toBe('')
    expect(getTlcName('unknown')).toBe('')
    expect(findCategory('unknown')).toBe('')
  })

  it('findCategory and getCategories are consistent', () => {
    const categories = getCategories()
    expect(categories).toHaveLength(4)
    expect(findCategory(categories[0].resourceId)).toBe(categories[0].name)
  })
})
