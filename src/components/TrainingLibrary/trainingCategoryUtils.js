const isEmptyCategoryValue = (value) => {
  return value === undefined || value === null || value === ''
}

const isSameCategoryValue = (leftValue, rightValue) => {
  return String(leftValue) === String(rightValue)
}

const getCategoryId = (category = {}) => {
  return category?.id || category?.categoryId || category?.resourceId
}

const getCategoryCode = (category = {}) => {
  return category?.code || category?.value || category?.name
}

const getCategoryDisplayText = (category = {}) => {
  return (
    category?.text ||
    category?.categoryName ||
    category?.displayName ||
    category?.name ||
    category?.code
  )
}

const pushUniqueCategoryValue = (target, value) => {
  if (
    !isEmptyCategoryValue(value) &&
    !target.some((currentValue) => isSameCategoryValue(currentValue, value))
  ) {
    target.push(value)
  }
}

const resolveCategoryValue = (value, categories = []) => {
  if (isEmptyCategoryValue(value)) {
    return null
  }

  if (typeof value === 'object') {
    const objectId = getCategoryId(value)
    if (!isEmptyCategoryValue(objectId)) {
      return objectId
    }

    const objectCode = getCategoryCode(value)
    if (!isEmptyCategoryValue(objectCode)) {
      return resolveCategoryValue(objectCode, categories)
    }
  }

  const matchedCategoryById = categories.find((category) =>
    isSameCategoryValue(getCategoryId(category), value)
  )
  if (matchedCategoryById) {
    return getCategoryId(matchedCategoryById)
  }

  const matchedCategoryByCode = categories.find((category) => {
    return [getCategoryCode(category), getCategoryDisplayText(category)].some(
      (categoryValue) => !isEmptyCategoryValue(categoryValue) && isSameCategoryValue(categoryValue, value)
    )
  })

  if (matchedCategoryByCode) {
    return getCategoryId(matchedCategoryByCode)
  }

  return value
}

export const getTrainingCategoryValues = (categorySource = {}, categories = []) => {
  const selectedCategoryValues = []

  if (Array.isArray(categorySource?.category)) {
    categorySource.category.forEach((value) => {
      pushUniqueCategoryValue(selectedCategoryValues, resolveCategoryValue(value, categories))
    })
  }

  if (Array.isArray(categorySource?.categoryIds)) {
    categorySource.categoryIds.forEach((value) => {
      pushUniqueCategoryValue(selectedCategoryValues, resolveCategoryValue(value, categories))
    })
  }

  if (Array.isArray(categorySource?.trainingCategories)) {
    categorySource.trainingCategories.forEach((category) => {
      pushUniqueCategoryValue(selectedCategoryValues, resolveCategoryValue(category, categories))
    })
  }

  if (!selectedCategoryValues.length && !isEmptyCategoryValue(categorySource?.category)) {
    pushUniqueCategoryValue(
      selectedCategoryValues,
      resolveCategoryValue(categorySource.category, categories)
    )
  }

  return selectedCategoryValues
}

export const getTrainingCategoryDisplayText = (selectedCategoryValues = [], categories = []) => {
  const normalizedValues = getTrainingCategoryValues({ category: selectedCategoryValues }, categories)

  return normalizedValues
    .map((value) => {
      const matchedCategory = categories.find((category) =>
        isSameCategoryValue(getCategoryId(category), value)
      )

      return matchedCategory ? getCategoryDisplayText(matchedCategory) : String(value)
    })
    .filter(Boolean)
    .join(', ')
}

export const buildTrainingCategoryPayload = (selectedCategoryValues = [], categories = []) => {
  return {
    categoryIds: getTrainingCategoryValues({ category: selectedCategoryValues }, categories)
  }
}

export const appendTrainingCategoryFormData = (
  payload,
  fieldPrefix = 'trainingDetail',
  selectedCategoryValues = [],
  categories = []
) => {
  const { categoryIds } = buildTrainingCategoryPayload(selectedCategoryValues, categories)

  const getFieldName = (fieldName) => {
    return fieldPrefix ? `${fieldPrefix}.${fieldName}` : fieldName
  }

  categoryIds.forEach((categoryId, index) => {
    payload.append(getFieldName(`CategoryIds[${index}]`), categoryId)
  })
}
