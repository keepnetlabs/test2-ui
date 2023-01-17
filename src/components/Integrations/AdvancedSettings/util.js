export const getFormData = (val = [], key = '') => {
  return val.reduce((acc, item) => {
    const { exclusionType, value } = item
    if (exclusionType === key) {
      acc.push(value)
    }
    return acc
  }, [])
}

export const getFormDataWithObjects = (val = [], key = '') => {
  return val.reduce((acc, item) => {
    const { exclusionType } = item
    if (exclusionType === key) {
      acc.push(item)
    }
    return acc
  }, [])
}

export const setFormData = (val = [], key = '') => {
  return val.reduce((acc, item) => {
    acc.push({
      attachmentExtensionType: null,
      exclusionType: key,
      value: typeof item === 'object' ? item.value : item
    })
    return acc
  }, [])
}
