export function getAvailableForListFromBackend(list = []) {
  return list.map((item) => {
    let { resourceId: id, typeName, targetName, targetResourceId } = item
    let label, resourceId, isDisabled
    if (typeName === 'MyCompanyOnly') {
      label = 'My company only'
      resourceId = null
      isDisabled = true
    } else if (typeName === 'AllCompanies') {
      label = 'All companies'
      resourceId = null
      isDisabled = true
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
      resourceId = null
    }
    return {
      resourceId: resourceId ? resourceId : id,
      type
    }
  })
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
    } else {
      if (x.FieldName !== filter.FieldName) {
        items.push(x)
      }
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

export function downloadExportedFile(data = {}, fileName = '', type = '') {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(data)
  link.download = `${fileName}.${
    type.toLocaleLowerCase() === 'xls' ? 'xlsx' : type.toLocaleLowerCase()
  }`
  link.click()
}
