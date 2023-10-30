import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const QUISHING_COLUMNS = {
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
  }
}
