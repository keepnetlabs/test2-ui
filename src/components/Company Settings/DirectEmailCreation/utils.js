import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const COLUMNS = {
  NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.Name,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  PLATFORM: {
    property: PROPERTY_STORE.PLATFORM,
    align: 'left',
    label: labels.Name,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 180
  },
  EMAIL: {
    property: PROPERTY_STORE.EMAIL,
    align: 'left',
    label: labels.Email,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'text'
  },
  STATUS: {
    property: PROPERTY_STORE.STATUS,
    label: labels.Status,
    align: 'center',
    fixed: false,
    sortable: true,
    show: true,
    type: 'status',
    width: 160,
    filterableType: 'select',
    filterableItems: ['Running', 'Failed']
  },
  CREATE_TIME: {
    property: PROPERTY_STORE.CREATETIME,
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  }
}

export const EMITS = {
  ON_ADD: 'on-add',
  ON_PREVIEW: 'on-preview',
  ON_ACTION_DELETE: 'on-action-delete',
  ON_EDIT: 'on-edit',
  ON_CLOSE: 'on-close'
}
