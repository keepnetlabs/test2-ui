import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export function getAvailableForListFromBackend(list = []) {
  return list.map((item) => {
    let { typeName, targetName, targetResourceId } = item
    let label, resourceId, isDisabled, id
    if (typeName === 'MyCompanyOnly') {
      label = 'My company only'
      resourceId = null
      isDisabled = true
      id = 'MyCompanyOnly'
    } else if (typeName === 'AllCompanies') {
      label = 'All companies'
      resourceId = null
      isDisabled = true
      id = 'AllCompanies'
    } else {
      label = targetName
      isDisabled = false
      resourceId = targetResourceId
      id = targetResourceId
    }
    return {
      id,
      type: typeName,
      resourceId,
      label,
      isDisabled
    }
  })
}

export function normalizeRoleId(role) {
  if (role == null) return ''
  if (typeof role === 'string' || typeof role === 'number') return String(role)
  const id = role?.id ?? role?.roleId ?? role?.resourceId ?? role?.targetAudienceId
  if (id != null) return String(id)
  const code = role?.code || role?.roleName
  return code ? code.replaceAll(/\s/g, '') : ''
}

export function getAvailableForValues(data) {
  return data.map((item) => {
    let { resourceId, type, id } = item
    if (type === 'MyCompanyOnly') {
      id = null
      resourceId = null
    } else if (type === 'AllCompanies') {
      resourceId = null
    }
    return {
      resourceId: resourceId || id,
      type
    }
  })
}

/** API expects DurationMinutes; never send totalDuration / TotalDuration on the wire. */
export function resolveApiDurationFieldName(fieldName) {
  if (fieldName == null) return fieldName
  const n = String(fieldName)
  if (n === PROPERTY_STORE.TOTAL_DURATION || n === 'TotalDuration') return 'DurationMinutes'
  return fieldName
}

export function normalizeSearchFilterItems(filterItems = []) {
  return filterItems.map((item) => ({
    ...item,
    FieldName: resolveApiDurationFieldName(item.FieldName)
  }))
}

export function getAvailableForValueFromList(list = []) {
  let makeAvailableForValue = [
    {
      id: 'MyCompanyOnly',
      label: 'My company only',
      type: 'MyCompanyOnly',
      resourceId: null
    }
  ]
  if (list.length) {
    const availableForListFromBackend = getAvailableForListFromBackend(list)
    if (availableForListFromBackend.length) makeAvailableForValue = availableForListFromBackend
  }
  return makeAvailableForValue
}
export function columnFilterChanged(filter = {}, axiosPayload = {}) {
  if (Array.isArray(filter) && filter.length === 0) {
    return []
  }

  const normalizedFilter = Array.isArray(filter)
    ? filter.map((item) => ({
        ...item,
        FieldName: resolveApiDurationFieldName(item.FieldName ?? item.fieldName)
      }))
    : {
        ...filter,
        FieldName: resolveApiDurationFieldName(filter.FieldName)
      }

  let items = []
  let requestBody = axiosPayload.filter.FilterGroups[0].FilterItems
  requestBody.map((x) => {
    if (Array.isArray(normalizedFilter)) {
      const replacedFields = new Set(
        normalizedFilter.map((i) => resolveApiDurationFieldName(i.FieldName))
      )
      if (!replacedFields.has(resolveApiDurationFieldName(x.FieldName))) {
        items.push(x)
      }
    } else if (resolveApiDurationFieldName(x.FieldName) !== normalizedFilter.FieldName) {
      items.push(x)
    }
  })

  requestBody = [...items]
  if (Array.isArray(normalizedFilter)) {
    normalizedFilter.forEach((elem) => {
      requestBody.push(elem)
    })
  } else {
    requestBody.push(normalizedFilter)
  }

  return requestBody
}

export function columnFilterCleared(fieldName = '', axiosPayload = {}) {
  let items = []
  let filterPayload = axiosPayload.filter.FilterGroups[0].FilterItems
  const resolvedClearName = resolveApiDurationFieldName(fieldName)

  filterPayload.map((x) => {
    if (resolveApiDurationFieldName(x.FieldName) !== resolvedClearName) {
      items.push(x)
    }
  })

  filterPayload = [...items]
  return filterPayload
}

export function isColumnFilterActive(axiosPayload = {}) {
  return !!(
    axiosPayload?.filter?.FilterGroups[0]?.FilterItems?.length ||
    axiosPayload?.filter?.FilterGroups[1]?.FilterItems?.length
  )
}

export function downloadExportedFile(data = {}, fileName = '', type = '') {
  const link = document.createElement('a')
  link.href = globalThis.URL.createObjectURL(data)
  link.download = `${fileName}.${
    type.toLocaleLowerCase() === 'xls' ? 'xlsx' : type.toLocaleLowerCase()
  }`
  link.click()
}

export function createCustomFieldColumns(customFields = [], isFilterable = true) {
  return customFields.map((field) => {
    const { name, fieldDataType } = field
    const filterableProps = {}
    if (fieldDataType.toLowerCase() === 'string') {
      filterableProps['filterableType'] = 'text'
    }
    if (fieldDataType.toLowerCase() === 'email') {
      filterableProps['filterableType'] = 'text'
    }
    if (fieldDataType.toLowerCase() === 'number') {
      filterableProps['filterableType'] = 'text'
    }
    if (fieldDataType.toLowerCase() === 'boolean') {
      filterableProps['filterableType'] = 'select'
      filterableProps['filterableItems'] = [
        { text: 'Yes', value: 1 },
        { text: 'No', value: 0 }
      ]
    }
    if (fieldDataType.toLowerCase() === 'date') {
      filterableProps['filterableType'] = 'dateOnly'
      filterableProps['type'] = 'date'
    }
    if (fieldDataType.toLowerCase() === 'datetime') {
      filterableProps['filterableType'] = 'date'
    }
    if (!isFilterable) {
      delete filterableProps['filterableType']
    }
    return {
      property: name,
      type: 'text',
      sortable: false,
      filterable: true,
      hideSort: true,
      label: name,
      align: 'left',
      show: true,
      width: 80 + name.length * 7,
      isCustomField: true,
      ...filterableProps
    }
  })
}
