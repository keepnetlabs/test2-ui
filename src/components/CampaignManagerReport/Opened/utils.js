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
  }
}
