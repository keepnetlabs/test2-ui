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
  })
})
