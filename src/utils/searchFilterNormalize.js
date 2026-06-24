import { PROPERTY_STORE } from '@/model/constants/commonConstants'

/** API expects DurationMinutes; never send totalDuration / TotalDuration on the wire. */
export function resolveApiDurationFieldName(fieldName) {
  if (fieldName == null) return fieldName
  const n = String(fieldName)
  if (n === PROPERTY_STORE.TOTAL_DURATION || n === 'TotalDuration') return 'DurationMinutes'
  // Double Barrel: API expects PascalCase BarrelEmailRole for sort/filter on the wire.
  if (n === 'barrelEmailRole') return 'BarrelEmailRole'
  return fieldName
}

export function normalizeSearchFilterItems(filterItems = []) {
  return filterItems.map((item) => {
    if (item.FieldName == null && item.fieldName != null) {
      const resolvedFromFieldName = resolveApiDurationFieldName(item.fieldName)
      if (resolvedFromFieldName !== item.fieldName) {
        return { ...item, FieldName: resolvedFromFieldName }
      }
    }
    return {
      ...item,
      FieldName: resolveApiDurationFieldName(item.FieldName)
    }
  })
}
