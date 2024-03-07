import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const TRAINING_LIBRARY_COLUMNS = {
  SCREENSAVER_NAME: {
    property: PROPERTY_STORE.SCREENSAVER_NAME,
    align: 'left',
    label: labels.ScreenSaverName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  INFOGRAPHIC_NAME: {
    property: PROPERTY_STORE.INFOGRAPHIC_NAME,
    align: 'left',
    label: labels.InfoGraphicName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  POSTER_NAME: {
    property: PROPERTY_STORE.POSTER_NAME,
    align: 'left',
    label: labels.PosterName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  TRAINING_NAME: {
    property: PROPERTY_STORE.TRAINING_NAME,
    align: 'left',
    label: labels.TrainingName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  MATERIAL_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.MaterialName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  LEARNING_PATH_NAME: {
    property: PROPERTY_STORE.LEARNING_PATH_NAME,
    align: 'left',
    label: labels.LearningPathName,
    fixed: 'left',
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    editable: false,
    label: labels.Type,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 160
  },
  CATEGORY: {
    property: PROPERTY_STORE.CATEGORY,
    align: 'left',
    editable: false,
    label: labels.Category,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  TARGET_AUDIENCE: {
    property: PROPERTY_STORE.TARGET_AUDIENCE,
    align: 'left',
    editable: false,
    label: labels.TargetAudience,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200
  },
  LANGUAGES: {
    property: PROPERTY_STORE.LANGUAGES,
    align: 'left',
    editable: false,
    label: labels.Languages,
    sortable: false,
    hideSort: true,
    show: true,
    width: 160,
    type: 'smallBadge',
    hasTooltip: true
  },
  CREATED_BY: {
    property: PROPERTY_STORE.CREATEDBY,
    align: 'left',
    editable: false,
    label: labels.CreatedBy,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 160
  },
  COMPLIANCE: {
    property: PROPERTY_STORE.COMPLIANCE,
    align: 'left',
    editable: false,
    label: labels.Compliance,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 160
  },
  TAGS: {
    property: PROPERTY_STORE.TAGS,
    align: 'left',
    editable: false,
    label: labels.Tags,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'smallBadge',
    width: 160
  }
}

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
  }
]

export const emptyTrainingDeleteDialogObj = {
  status: false,
  title: '',
  body: '',
  selectedRow: null,
  type: '',
  onClose: () => {}
}
export const emptyTrainingPreviewDialogObj = {
  status: false,
  selectedRow: null,
  onClose: () => {}
}
