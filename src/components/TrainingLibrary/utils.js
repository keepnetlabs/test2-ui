import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
export const TRAINING_LIBRARY_TYPES = {
  LEARNING_PATH: 'Learning Path',
  TRAINING: 'Training',
  POSTER: 'Poster',
  INFOGRAPHIC: 'Infographic',
  SCREENSAVER: 'Screensaver',
  SURVEY: 'Survey'
}
export const TRAINING_LIBRARY_COLUMNS = {
  SCREENSAVER_NAME: {
    property: PROPERTY_STORE.SCREENSAVER_NAME,
    align: 'left',
    label: labels.ScreenSaverName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  INFOGRAPHIC_NAME: {
    property: PROPERTY_STORE.INFOGRAPHIC_NAME,
    align: 'left',
    label: labels.InfoGraphicName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  POSTER_NAME: {
    property: PROPERTY_STORE.POSTER_NAME,
    align: 'left',
    label: labels.PosterName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  TRAINING_NAME: {
    property: PROPERTY_STORE.TRAINING_NAME,
    align: 'left',
    label: labels.TrainingName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  SURVEY_NAME: {
    property: PROPERTY_STORE.TRAINING_NAME,
    align: 'left',
    label: labels.SurveyName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  MATERIAL_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.MaterialName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'text',
    width: 200
  },
  LEARNING_PATH_NAME: {
    property: PROPERTY_STORE.LEARNING_PATH_NAME,
    align: 'left',
    label: labels.LearningPathName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'text',
    width: 200
  },
  TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    editable: false,
    label: labels.Type,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'select',
    filterableItems: []
  },
  CATEGORY: {
    property: PROPERTY_STORE.CATEGORY,
    align: 'left',
    editable: false,
    label: labels.Category,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'select',
    filterableItems: [],
    width: 200
  },
  TARGET_AUDIENCE: {
    property: PROPERTY_STORE.TARGET_AUDIENCE,
    align: 'left',
    editable: false,
    label: labels.Role,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'select',
    filterableItems: [],
    width: 200
  },
  LANGUAGES: {
    property: PROPERTY_STORE.LANGUAGES,
    align: 'left',
    editable: false,
    label: labels.Languages,
    sortable: true,
    show: true,
    width: 160,
    type: 'smallBadge',
    filterableType: 'select',
    filterableItems: [],
    hasTooltip: true
  },
  CREATED_BY: {
    property: PROPERTY_STORE.CREATEDBY,
    align: 'left',
    editable: false,
    label: labels.CreatedBy,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'text',
    width: 160
  },
  COMPLIANCE: {
    property: PROPERTY_STORE.COMPLIANCE,
    align: 'left',
    editable: false,
    label: labels.Compliance,
    sortable: true,
    show: true,
    type: 'smallBadge',
    filterableType: 'select',
    filterableItems: [],
    width: 160
  },
  TAGS: {
    property: PROPERTY_STORE.TAGS,
    align: 'left',
    editable: false,
    label: labels.Tags,
    sortable: true,
    show: true,
    type: 'smallBadge',
    filterableType: 'text',
    width: 160
  },
  VENDOR: {
    property: PROPERTY_STORE.VENDORNAME,
    align: 'left',
    editable: false,
    label: labels.Vendor,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'select',
    filterableItems: [],
    width: 160
  },
  DATE_CREATED: {
    property: PROPERTY_STORE.CREATE_TIME,
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    sortable: true,
    overrideWidth: true,
    show: false,
    filterableType: 'date',
    type: 'text',
    width: 160
  }
}
export const distributionDelayTimeTypes = [
  {
    text: 'seconds',
    value: '1'
  },
  {
    text: 'minutes',
    value: '2'
  },
  {
    text: 'hours',
    value: '3'
  }
]
export const addTrainingItems = [
  { text: 'Learning Path', id: 'btn-add-training-library-learning-path' },
  {
    text: 'Training',
    id: 'btn-add-training-library-training'
  },
  {
    text: 'Poster',
    id: 'btn-add-training-library-poster'
  },
  {
    text: 'Infographic',
    id: 'btn-add-training-library-infographic'
  },
  {
    text: 'Screensaver',
    id: 'btn-add-training-library-screensaver'
  },
  {
    text: 'Survey',
    id: 'btn-add-training-library-survey'
  }
]

export const TRAINING_LIBRARY_SEARCH_TYPES = {
  All: 1,
  MostPopular: 2,
  Favourites: 3,
  CreatedByMe: 4
}

export const emptyTrainingDeleteDialogObj = {
  status: false,
  title: '',
  body: '',
  selectedRow: null,
  type: '',
  onClose: () => {}
}
export const emptyLearningPathModalTrainingPreviewDialogObj = {
  status: false,
  selectedRow: null,
  type: 'Training',
  showSendButton: false
}
export const emptyTrainingPreviewDialogObj = {
  status: false,
  selectedRow: null,
  showSendButton: true,
  type: TRAINING_LIBRARY_TYPES.TRAINING
}
export const emptySurveyPreviewDialogObj = {
  status: false,
  selectedRow: null,
  showSendButton: true
}
export const emptyLearningPathPreviewDialogObj = {
  status: false,
  selectedRow: null,
  showSendButton: true
}
export const emptyPosterPreviewDialogObj = {
  status: false,
  title: '',
  subtitle: '',
  type: '',
  showDetails: true,
  showTabs: true,
  showPosterName: true,
  showFavoriteButton: true,
  icon: 'mdi-eye',
  selectedRow: null,
  showSendButton: true,
  onClose: () => {}
}
export const emptyInfographicPreviewDialogObj = {
  status: false,
  title: '',
  subtitle: '',
  type: '',
  showDetails: true,
  showTabs: true,
  showInfographicName: true,
  showFavoriteButton: true,
  icon: 'mdi-eye',
  selectedRow: null,
  showSendButton: true,
  onClose: () => {}
}

export const emptyScreensaverPreviewDialogObj = {
  status: false,
  title: '',
  subtitle: '',
  type: '',
  showDetails: true,
  showTabs: true,
  showScreensaverName: true,
  showFavoriteButton: true,
  icon: 'mdi-eye',
  selectedRow: null,
  showSendButton: false,
  onClose: () => {}
}

export const emptyNewTrainingModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}
export const emptyNewLearningPathModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}
export const emptyNewPosterModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}
export const emptyNewInfographicModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}
export const emptyNewSurveyModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}

export const emptyNewScreensaverModalObj = {
  status: false,
  isEdit: false,
  isDuplicate: false,
  selectedRow: null
}
export const emptyTrainingSendModalObj = {
  status: false,
  selectedRow: null
}
export const emptyPosterSendModalObj = {
  status: false,
  selectedRow: null
}

export const emptyInfographicSendModalObj = {
  status: false,
  selectedRow: null
}
export const emptyScreensaverSendModalObj = {
  status: false,
  selectedRow: null
}
export const emptyLearningPathSendModalObj = {
  status: false,
  selectedRow: null
}
export const emptySurveySendModalObj = {
  status: false,
  selectedRow: null
}
export function isInavailable(
  availableFor,
  training,
  selectedCompanyResourceId,
  selectedCompanyName
) {
  if (selectedCompanyName === 'System') {
    return false
  }
  const isMyCompanyOnly =
    availableFor?.includes('MyCompanyOnly') &&
    (training?.availableFor?.includes('MyCompanyOnly') ||
      training?.availableFor?.includes(selectedCompanyResourceId))

  const isAllCompanies = training?.availableFor?.includes('AllCompanies')

  const isEveryItemIncluded = availableFor.every((item) => training?.availableFor?.includes(item))

  return !(isMyCompanyOnly || isAllCompanies || isEveryItemIncluded)
}

export function getAutoEnrollText(
  autoEnrollType,
  autoEnrollDayOfWeek,
  enrollmentAutoEnroll,
  autoEnrollPeriodType
) {
  let autoEnrollText = ''
  if (autoEnrollType === 'next') {
    autoEnrollText = `on the next ${autoEnrollDayOfWeek}`
  } else if (autoEnrollType === 'in') {
    autoEnrollText = `in ${enrollmentAutoEnroll.periodCount} ${autoEnrollPeriodType}`
  } else {
    autoEnrollText = autoEnrollType
  }
  return `Automatically enroll new users ${autoEnrollText}`
}
