import {
  TRAINING_LIBRARY_FILTER_OPTIONS,
  TRAINING_LIBRARY_SORTING_OPTIONS,
  trainingLibraryFilters,
  trainingMergeTags,
  learningPathMergeTags,
  posterMergeTags,
  infographicMergeTags,
  screensaverMergeTags
} from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'

describe('TrainingLibraryFilters utils', () => {
  it('exports filter and sorting option lists', () => {
    expect(TRAINING_LIBRARY_FILTER_OPTIONS).toHaveLength(4)
    expect(TRAINING_LIBRARY_SORTING_OPTIONS).toHaveLength(3)
    expect(trainingLibraryFilters.length).toBeGreaterThan(5)
  })

  it('sorting options include expected menu order labels', () => {
    const nameSort = TRAINING_LIBRARY_SORTING_OPTIONS.find((i) => i.orderBy === 'trainingName')
    const dateSort = TRAINING_LIBRARY_SORTING_OPTIONS.find((i) => i.orderBy === 'createTime')
    expect(nameSort.menu.map((m) => m.text)).toEqual(['A to Z', 'Z to A'])
    expect(dateSort.menu.map((m) => m.text)).toEqual(['New to old', 'Old to new'])
  })

  it('filter options include both menu and non-menu entries', () => {
    const menuOptions = TRAINING_LIBRARY_FILTER_OPTIONS.filter((x) => x.hasMenu)
    const plainOptions = TRAINING_LIBRARY_FILTER_OPTIONS.filter((x) => !x.hasMenu)
    expect(menuOptions.length).toBeGreaterThan(0)
    expect(plainOptions.length).toBeGreaterThan(0)
  })

  it('exports merge tag groups with expected tokens', () => {
    expect(trainingMergeTags.some((i) => i.value === '{TRAININGURL}')).toBe(true)
    expect(learningPathMergeTags.some((i) => i.value === '{LEARNINGPATHURL}')).toBe(true)
    expect(posterMergeTags.some((i) => i.value === '{POSTERURL}')).toBe(true)
    expect(infographicMergeTags.some((i) => i.value === '{INFOGRAPHICURL}')).toBe(true)
    expect(screensaverMergeTags.some((i) => i.value === '{SCREENSAVERURL}')).toBe(true)
  })

  it('all merge tag groups include common user tokens', () => {
    const groups = [
      trainingMergeTags,
      learningPathMergeTags,
      posterMergeTags,
      infographicMergeTags,
      screensaverMergeTags
    ]
    groups.forEach((group) => {
      expect(group.some((i) => i.value === '{FULLNAME}')).toBe(true)
      expect(group.some((i) => i.value === '{FIRSTNAME}')).toBe(true)
      expect(group.some((i) => i.value === '{LASTNAME}')).toBe(true)
      expect(group.some((i) => i.value === '{DATESMSSENT}')).toBe(true)
    })
  })

  it('trainingLibraryFilters contains expected visible and hidden filter keys', () => {
    const visibleKeys = trainingLibraryFilters.filter((f) => f.show).map((f) => f.key)
    const hiddenKeys = trainingLibraryFilters.filter((f) => !f.show).map((f) => f.key)

    expect(visibleKeys).toContain('behaviours')
    expect(visibleKeys).toContain('vendor')
    expect(hiddenKeys).toContain('trainingName')
    expect(hiddenKeys).toContain('description')
    expect(hiddenKeys).toContain('tags')
  })

  it('trainingLibraryFilters keeps filter type/operator defaults by category', () => {
    const createdBy = trainingLibraryFilters.find((f) => f.key === 'createdBy')
    const dateCreated = trainingLibraryFilters.find((f) => f.key === 'createTime')
    const vendor = trainingLibraryFilters.find((f) => f.key === 'vendor')

    expect(createdBy.filterType).toBe('select')
    expect(createdBy.operator).toBe('Contains')
    expect(dateCreated.filterType).toBe('date')
    expect(dateCreated.operator).toBe('=')
    expect(vendor.filterType).toBe('search')
    expect(vendor.operator).toBe('Include')
  })
})
