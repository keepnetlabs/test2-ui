import useEnrollmentTableFilters from '@/hooks/enrollments/useEnrollmentTableFilters'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('useEnrollmentTableFilters', () => {
  const { watch } = useEnrollmentTableFilters

  it('enrollmentStatusEnum watcher maps and sets status filter items', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const statusColumn = { property: 'status', filterableItems: [] }
    const ctx = {
      $set: set,
      tableOptions: { columns: [statusColumn] },
      $refs: { refTable: { reRenderFilters } }
    }

    watch.enrollmentStatusEnum.call(ctx, [{ displayName: 'Completed', id: 1 }, { name: 'Draft' }])

    expect(set).toHaveBeenCalled()
    expect(statusColumn.filterableItems).toEqual([
      { text: 'Completed', value: 1 },
      { text: 'Draft', value: 'Draft' }
    ])
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
  })

  it('languages watcher guards invalid values and maps valid ones', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const languagesColumn = { property: 'languages', filterableItems: [] }
    const ctx = {
      $set: set,
      tableOptions: { columns: [languagesColumn] },
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }

    watch.languages.call(ctx, null)
    expect(set).not.toHaveBeenCalled()

    watch.languages.call(ctx, [{ isoFriendlyName: 'English', code: 'en' }])
    expect(languagesColumn.filterableItems).toEqual([{ text: 'English', value: 'en' }])
  })

  it('targetAudiences watcher normalizes value for roles field', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const targetAudienceColumn = {
      property: 'targetAudience',
      filterableCustomFieldName: PROPERTY_STORE.ROLES,
      filterableItems: []
    }
    const ctx = {
      $set: set,
      tableOptions: { columns: [targetAudienceColumn] },
      $refs: { refTable: { reRenderFilters } }
    }

    watch.targetAudiences.call(ctx, [{ id: '1', name: 'Admin' }, { roleId: '2', name: 'User' }])

    expect(targetAudienceColumn.filterableItems).toEqual([
      { id: '1', name: 'Admin', value: '1' },
      { roleId: '2', name: 'User', value: '2' }
    ])
    expect(reRenderFilters).toHaveBeenCalledTimes(1)
  })
})
