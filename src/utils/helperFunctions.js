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
  let items = []
  let requestBody = axiosPayload.filter.FilterGroups[0].FilterItems
  requestBody.map((x) => {
    if (Array.isArray(filter)) {
      filter.forEach((i) => {
        if (x.FieldName !== i.FieldName) {
          items.push(x)
        }
      })
    } else if (x.FieldName !== filter.FieldName) {
      items.push(x)
    }
  })

  requestBody = [...items]
  if (Array.isArray(filter)) {
    filter.forEach((x, i) => {
      const elem = filter[i]
      elem.FieldName = filter[i].FieldName
      requestBody.push(elem)
    })
  } else {
    const elem = filter
    elem.FieldName = filter.FieldName
    requestBody.push(elem)
  }

  return requestBody
}

export function columnFilterCleared(fieldName = '', axiosPayload = {}) {
  let items = []
  let filterPayload = axiosPayload.filter.FilterGroups[0].FilterItems

  filterPayload.map((x) => {
    if (x.FieldName !== fieldName) {
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
  link.href = window.URL.createObjectURL(data)
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
