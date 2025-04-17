import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const COMMON_SIMULATOR_COLUMNS = {
  NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    editable: false,
    label: labels.ScenarioName,
    sortable: true,
    show: true,
    type: 'text',
    fixed: 'left',
    width: 240,
    filterableType: 'text'
  },
  CATEGORY: {
    property: PROPERTY_STORE.CATEGORY,
    align: 'left',
    editable: false,
    label: `Category`,
    sortable: true,
    show: true,
    type: 'text',
    width: 240,
    filterableType: 'select',
    filterableItems: []
  },
  QUISHING_TYPE: {
    property: 'quishingType',
    align: 'left',
    editable: false,
    label: labels.QuishingType,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 240,
    filterableType: 'select',
    filterableItems: [
      { text: 'Email', value: 'Email' },
      { text: 'Individual Printout', value: 'Individual' }
    ]
  },
  TEMPLATE_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    editable: false,
    label: labels.TemplateName,
    sortable: true,
    show: true,
    type: 'text',
    fixed: 'left',
    width: 240,
    filterableType: 'text'
  },
  METHOD: {
    property: PROPERTY_STORE.METHOD,
    align: 'left',
    editable: false,
    label: labels.Method,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 240,
    filterableType: 'select',
    filterableItems: [
      { text: 'Click Only', value: 'Click-Only' },
      { text: 'Data Submission', value: 'Data Submission' },
      { text: 'Attachment', value: 'Attachment' },
      { text: 'MFA', value: 'MFA' }
    ]
  },
  QUISHING_METHOD: {
    property: PROPERTY_STORE.METHOD,
    align: 'left',
    editable: false,
    label: labels.Method,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 240,
    filterableType: 'select',
    filterableItems: [
      { text: 'Click Only', value: 'Click-Only' },
      { text: 'Data Submission', value: 'Data Submission' },
      { text: 'MFA', value: 'MFA' }
    ]
  },
  PHISHING_METHOD: {
    property: PROPERTY_STORE.METHOD,
    align: 'left',
    editable: false,
    label: labels.Method,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 240,
    filterableType: 'select',
    filterableItems: [
      { text: 'Click Only', value: 'Click-Only' },
      { text: 'Data Submission', value: 'Data Submission' },
      { text: 'Attachment', value: 'Attachment' },
      { text: 'MFA', value: 'MFA' }
    ]
  },
  LANGUAGE: {
    property: PROPERTY_STORE.LANGUAGE,
    align: 'left',
    editable: false,
    label: labels.LANGUAGE,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 175,
    filterableType: 'select',
    filterableItems: [],
    filterableCustomFieldName: 'languageTypeResourceId'
  },
  TAGS: {
    property: PROPERTY_STORE.TAGS,
    align: 'left',
    editable: false,
    label: 'Tags',
    fixed: false,
    sortable: true,
    show: true,
    type: 'smallBadge',
    width: 150,
    hasTooltip: true,
    filterableType: 'text',
    filterableCustomFieldName: PROPERTY_STORE.TAGS
  },
  DIFFICULTY: {
    property: PROPERTY_STORE.JUSTDIFFICULTY,
    align: 'center',
    editable: false,
    label: labels.DIFFICULTY,
    sortable: true,
    show: true,
    type: 'status',
    filterableType: 'select',
    filterableItems: ['Easy', 'Medium', 'Hard'],
    width: 180
  },
  DIFFICULTY_EMAIL_TEMPLATE: {
    property: PROPERTY_STORE.DIFFICULTY,
    align: 'center',
    editable: false,
    label: labels.DIFFICULTY,
    sortable: true,
    show: true,
    type: 'status',
    filterableType: 'select',
    filterableItems: ['Easy', 'Medium', 'Hard'],
    width: 180
  },
  CREATED_BY: {
    property: PROPERTY_STORE.CREATEDBY,
    align: 'left',
    editable: false,
    label: labels.CreatedBy,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    filterableType: 'text'
  },
  CREATE_TIME: {
    property: PROPERTY_STORE.CREATETIME,
    align: 'left',
    editable: false,
    label: getStoreValue(PROPERTY_STORE.CREATETIME),
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'date'
  },
  AVAILABLE_FOR: {
    property: PROPERTY_STORE.AVAILABLEFOR,
    align: 'left',
    editable: false,
    label: labels.AvailableFor,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    filterableType: 'text'
  },
  EMAIL_TEMPLATE: {
    property: PROPERTY_STORE.EMAIL_TEMPLATE,
    align: 'left',
    editable: false,
    label: labels.EmailTemplate,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    filterableType: 'text'
  },
  LANDING_PAGE_TEMPLATE: {
    property: PROPERTY_STORE.LANDING_PAGE_TEMPLATE,
    align: 'left',
    editable: false,
    label: labels.LandingPage,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    filterableType: 'text'
  },
  CATEGORY_NAME: {
    property: PROPERTY_STORE.CATEGORYNAME,
    align: 'left',
    editable: false,
    label: labels.Method,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 175,
    filterableType: 'select',
    filterableCustomFieldName: 'CategoryResourceId',
    filterableItems: [
      { text: 'Click Only', value: 'WNZt0sCVCWB3' },
      { text: 'Data Submission', value: 'DYC0gugxJMjT' },
      { text: 'Attachment', value: '7dLrW2kdBTDs' }
    ]
  },
  QUISHING_CATEGORY_NAME: {
    property: PROPERTY_STORE.CATEGORYNAME,
    align: 'left',
    editable: false,
    label: labels.Method,
    sortable: true,
    show: true,
    type: 'text',
    fixed: false,
    width: 175,
    filterableType: 'select',
    filterableCustomFieldName: 'CategoryResourceId',
    filterableItems: [
      { text: 'Click Only', value: 'WNZt0sCVCWB3' },
      { text: 'Data Submission', value: 'DYC0gugxJMjT' }
    ]
  }
}
export const PREVIEW_DIALOG_TYPES = {
  PHISHING: 'phishing',
  QUISHING: 'quishing'
}

export const SCENARIO_DELETE_DIALOG_TYPES = {
  EMAIL: 'Email',
  LANDING_PAGE: 'Landing Page'
}
export const SCENARIO_TYPES = {
  PHISHING: 'Phishing',
  QUISHING: 'Quishing',
  SMISHING: 'Smishing',
  CALLBACK: 'Callback'
}
export const quishingTypeItems = [
  { text: 'Email', value: 'Email' },
  { text: 'Individual Printout', value: 'Individual' }
]
export const getDifficultyColor = (difficulty) => {
  if (difficulty === 'Easy') {
    return '#217124'
  }

  if (difficulty === 'Medium') {
    return '#2196F3'
  }

  if (difficulty === 'Hard') {
    return '#F56C6C'
  }

  return '#217124'
}

export function getItemDifficultyClass(difficulty = '') {
  if (difficulty === 'Easy') return 'difficulty-easy'
  else if (difficulty === 'Medium') return 'difficulty-medium'
  else if (difficulty === 'Hard') return 'difficulty-hard'
  return ''
}
