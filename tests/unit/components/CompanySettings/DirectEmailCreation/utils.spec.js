import {
  COLUMNS,
  DEC_PLATFORMS,
  PLATFORM_TYPES,
  EMITS
} from '@/components/Company Settings/DirectEmailCreation/utils'

describe('CompanySettings DirectEmailCreation utils', () => {
  it('exports data table columns and filters', () => {
    expect(COLUMNS).toHaveProperty('NAME')
    expect(COLUMNS).toHaveProperty('PLATFORM')
    expect(COLUMNS).toHaveProperty('STATUS')
    expect(COLUMNS.PLATFORM.filterableItems).toHaveLength(2)
  })

  it('exports platform enums and emit names', () => {
    expect(DEC_PLATFORMS.MICROSOFT_365).toBe('Microsoft 365')
    expect(PLATFORM_TYPES.GoogleWorkspace).toBe(2)
    expect(EMITS.ON_ADD_MICROSOFT_365).toBe('on-add-microsoft-365')
    expect(EMITS.ON_ACTION_DELETE).toBe('on-action-delete')
  })
})
