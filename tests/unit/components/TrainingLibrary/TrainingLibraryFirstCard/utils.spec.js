import {
  downloadButtonOptions,
  TRAINING_LIBRARY_MAIN_TABS,
  trainingTabContents,
  TRAINING_LIBRARY_TYPES,
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_SETTINGS_COLUMNS,
  TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryFirstCard utils', () => {
  it('exports tab and type constants', () => {
    expect(downloadButtonOptions).toEqual(['Download Current Page', 'Download All'])
    expect(TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS).toBe('All Materials')
    expect(trainingTabContents).toHaveLength(4)
    expect(TRAINING_LIBRARY_TYPES.SURVEY).toBe('Survey')
    expect(TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING).toBe('SCORM')
  })

  it('exports settings and filter column descriptors', () => {
    expect(TRAINING_LIBRARY_SETTINGS_COLUMNS).toHaveProperty('TYPE')
    expect(TRAINING_LIBRARY_SETTINGS_COLUMNS.TYPE.show).toBe(true)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS).toHaveProperty('CREATED_BY')
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.CREATED_BY.property).toBe('createdBy')
  })

  it('tab content values are sequential and match main tab labels', () => {
    expect(trainingTabContents.map((x) => x.value)).toEqual([1, 2, 3, 4])
    expect(trainingTabContents.map((x) => x.name)).toEqual([
      TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS,
      TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR,
      TRAINING_LIBRARY_MAIN_TABS.FAVOURITES,
      TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU
    ])
  })

  it('settings and filter maps keep hidden/visible defaults for key fields', () => {
    expect(TRAINING_LIBRARY_SETTINGS_COLUMNS.DATE_CREATED.show).toBe(false)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.MATERIAL_NAME.show).toBe(false)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DESCRIPTION.show).toBe(false)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TAGS.show).toBe(false)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.DATE_CREATED.show).toBe(false)
    expect(TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS.TYPE.show).toBe(true)
  })
})
