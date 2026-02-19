import useAwarenessColumnBindsFromApi from '@/hooks/awareness-educator/useAwarenessColumnBindsFromApi'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('useAwarenessColumnBindsFromApi', () => {
  const { watch } = useAwarenessColumnBindsFromApi

  it('maps languages, categories and scorm types to related columns', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const reRenderFilters = jest.fn()
    const columns = [
      { property: 'languages', filterableItems: [] },
      { property: 'category', filterableItems: [] },
      { property: 'type', filterableItems: [] }
    ]
    const ctx = {
      $set: set,
      tableOptions: { columns },
      $refs: { refTable: { reRenderFilters } }
    }

    watch.languages.call(ctx, [{ text: 'EN', value: 'en' }])
    watch.categories.call(ctx, [{ text: 'Cat', value: 'cat' }])
    watch.scormTypes.call(ctx, [{ text: 'SCORM', value: 'scorm' }])

    expect(columns[0].filterableItems).toEqual([{ text: 'EN', value: 'en' }])
    expect(columns[1].filterableItems).toEqual([{ text: 'Cat', value: 'cat' }])
    expect(columns[2].filterableItems).toEqual([{ text: 'SCORM', value: 'scorm' }])
    expect(reRenderFilters).toHaveBeenCalledTimes(3)
  })

  it('normalizes target audience values for roles field', () => {
    const set = jest.fn((obj, key, value) => {
      obj[key] = value
    })
    const targetAudienceColumn = {
      property: 'targetAudience',
      filterableCustomFieldName: PROPERTY_STORE.ROLES,
      filterableItems: []
    }
    const ctx = {
      $set: set,
      tableOptions: { columns: [targetAudienceColumn] },
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }

    watch.targetAudiences.call(ctx, [
      { id: '1', text: 'Admin' },
      { roleId: '2', text: 'User' }
    ])

    expect(targetAudienceColumn.filterableItems).toEqual([
      { id: '1', text: 'Admin', value: '1' },
      { roleId: '2', text: 'User', value: '2' }
    ])
  })
})
