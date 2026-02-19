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
})
