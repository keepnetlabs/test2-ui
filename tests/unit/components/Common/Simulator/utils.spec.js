import {
  COMMON_SIMULATOR_COLUMNS,
  PREVIEW_DIALOG_TYPES,
  SCENARIO_DELETE_DIALOG_TYPES,
  SCENARIO_TYPES,
  quishingTypeItems,
  getDifficultyColor,
  getItemDifficultyClass
} from '@/components/Common/Simulator/utils'

describe('Common Simulator utils', () => {
  it('exports simulator constants and column config', () => {
    expect(COMMON_SIMULATOR_COLUMNS).toHaveProperty('NAME')
    expect(COMMON_SIMULATOR_COLUMNS).toHaveProperty('PHISHING_METHOD')
    expect(PREVIEW_DIALOG_TYPES).toEqual({ PHISHING: 'phishing', QUISHING: 'quishing' })
    expect(SCENARIO_DELETE_DIALOG_TYPES.EMAIL).toBe('Email')
    expect(SCENARIO_TYPES.CALLBACK).toBe('Callback')
    expect(quishingTypeItems).toEqual([
      { text: 'Email', value: 'Email' },
      { text: 'Individual Printout', value: 'Individual' }
    ])
  })

  it('maps difficulty to colors and css classes', () => {
    expect(getDifficultyColor('Easy')).toBe('#217124')
    expect(getDifficultyColor('Medium')).toBe('#2196F3')
    expect(getDifficultyColor('Hard')).toBe('#F56C6C')
    expect(getDifficultyColor('Unknown')).toBe('#217124')

    expect(getItemDifficultyClass('Easy')).toBe('difficulty-easy')
    expect(getItemDifficultyClass('Medium')).toBe('difficulty-medium')
    expect(getItemDifficultyClass('Hard')).toBe('difficulty-hard')
    expect(getItemDifficultyClass('Other')).toBe('')
    expect(getItemDifficultyClass()).toBe('')
  })

  it('keeps method and quishing method filters in expected shape', () => {
    expect(COMMON_SIMULATOR_COLUMNS.METHOD.filterableItems).toHaveLength(4)
    expect(COMMON_SIMULATOR_COLUMNS.QUISHING_METHOD.filterableItems).toHaveLength(3)
    expect(COMMON_SIMULATOR_COLUMNS.METHOD.filterableItems).toEqual(
      expect.arrayContaining([
        { text: 'Click Only', value: 'Click-Only' },
        { text: 'Data Submission', value: 'Data Submission' },
        { text: 'Attachment', value: 'Attachment' },
        { text: 'MFA', value: 'MFA' }
      ])
    )
  })

  it('keeps category filter variants for phishing and quishing consistent', () => {
    expect(COMMON_SIMULATOR_COLUMNS.CATEGORY_NAME.filterableItems).toHaveLength(3)
    expect(COMMON_SIMULATOR_COLUMNS.QUISHING_CATEGORY_NAME.filterableItems).toHaveLength(2)
    expect(COMMON_SIMULATOR_COLUMNS.CATEGORY_NAME.filterableCustomFieldName).toBe(
      'CategoryResourceId'
    )
    expect(COMMON_SIMULATOR_COLUMNS.QUISHING_CATEGORY_NAME.filterableCustomFieldName).toBe(
      'CategoryResourceId'
    )
  })

  it('keeps language and tags columns as filterable with custom fields', () => {
    expect(COMMON_SIMULATOR_COLUMNS.LANGUAGES.filterableType).toBe('select')
    expect(COMMON_SIMULATOR_COLUMNS.LANGUAGES.filterableCustomFieldName).toBe(
      'languageTypeResourceId'
    )
    expect(COMMON_SIMULATOR_COLUMNS.TAGS.filterableType).toBe('text')
    expect(COMMON_SIMULATOR_COLUMNS.TAGS.filterableCustomFieldName).toBe('tags')
  })
})
