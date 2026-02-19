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

  it('exports merge tag groups with expected tokens', () => {
    expect(trainingMergeTags.some((i) => i.value === '{TRAININGURL}')).toBe(true)
    expect(learningPathMergeTags.some((i) => i.value === '{LEARNINGPATHURL}')).toBe(true)
    expect(posterMergeTags.some((i) => i.value === '{POSTERURL}')).toBe(true)
    expect(infographicMergeTags.some((i) => i.value === '{INFOGRAPHICURL}')).toBe(true)
    expect(screensaverMergeTags.some((i) => i.value === '{SCREENSAVERURL}')).toBe(true)
  })
})
