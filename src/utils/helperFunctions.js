export function getAvailableForListFromBackend(list = []) {
  return list.map((item) => {
    let { resourceId: id, typeName } = item
    let label
    let resourceId = id
    if (typeName === 'MyCompanyOnly') {
      label = 'My company only'
      resourceId = null
    } else if (typeName === 'AllCompanies') {
      label = 'All companies'
      resourceId = null
    }
    return {
      id,
      type: typeName,
      resourceId,
      label
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
