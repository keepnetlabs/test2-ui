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
