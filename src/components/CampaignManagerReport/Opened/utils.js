import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const COLUMNS = {
  FIRST_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.FirstName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_NAME: {
    property: PROPERTY_STORE.LASTNAME,
    align: 'left',
    label: labels.LastName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  EMAIL: {
    property: PROPERTY_STORE.EMAIL,
    align: 'left',
    label: labels.Email,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  DEPARTMENT: {
    property: PROPERTY_STORE.DEPARTMENT,
    align: 'left',
    label: labels.Department,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  SCENARIO: {
    property: PROPERTY_STORE.SCENARIO,
    align: 'left',
    label: labels.Scenario,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_OPENED: {
    property: PROPERTY_STORE.LASTOPENED,
    align: 'left',
    editable: false,
    label: labels.LastOpened,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  TIMES_OPENED: {
    property: PROPERTY_STORE.TIMESOPENED,
    align: 'left',
    editable: false,
    label: labels.TimesOpened,
    sortable: true,
    show: true,
    type: 'numeric',
    width: 160,
    filterableType: 'numeric'
  },
  DATE_CLICKED: {
    property: PROPERTY_STORE.DATECLICKED,
    align: 'left',
    label: labels.DateClicked,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'date',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  USER_AGENT: {
    property: PROPERTY_STORE.USERAGENT,
    align: 'left',
    label: labels.UserAgent,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  BROWSER: {
    property: PROPERTY_STORE.BROWSER,
    align: 'left',
    label: labels.Browser,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  GEOLOCATION: {
    property: PROPERTY_STORE.GEOLOCATION,
    align: 'left',
    label: labels.Geolocation,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  IP: {
    property: PROPERTY_STORE.IP,
    align: 'left',
    label: labels.Ip,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  LAST_CLICKED: {
    property: PROPERTY_STORE.LASTCLICKED,
    align: 'left',
    label: labels.LastClicked,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'date',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  TIMES_CLICKED: {
    property: PROPERTY_STORE.TIMESCLICKED,
    align: 'left',
    editable: false,
    label: labels.TimesClicked,
    sortable: true,
    show: true,
    type: 'numeric',
    width: 160,
    filterableType: 'numeric'
  },
  PASSWORD_COMPLEXITY: {
    property: PROPERTY_STORE.PASSWORD_COMPLEXITY,
    align: 'center',
    label: labels.PasswordComplexity,
    sortable: true,
    show: true,
    type: 'badge',
    width: 160,
    filterableType: 'select'
  },
  LAST_SUBMISSION: {
    property: PROPERTY_STORE.LAST_SUBMISSION,
    align: 'left',
    label: labels.LastSubmission,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'date',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  TIMES_SUBMISSION: {
    property: PROPERTY_STORE.TIMES_SUBMISSION,
    align: 'left',
    label: labels.TimesSubmission,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'numeric'
  }
}
