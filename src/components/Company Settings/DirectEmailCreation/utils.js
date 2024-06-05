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
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    label: labels.Platforms,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'select',
    filterableItems: [
      { text: 'Microsoft 365', value: 'Microsoft365' },
      { text: 'Google Workspace', value: 'GoogleWorkspace' }
    ],
    type: 'text',
    width: 180
  },
  STATUS: {
    property: PROPERTY_STORE.STATUS,
    label: labels.Status,
    align: 'center',
    fixed: false,
    sortable: true,
    show: true,
    type: 'status',
    width: 180,
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

export const DEC_PLATFORMS = {
  MICROSOFT_365: 'Microsoft 365',
  GOOGLE_WORKSPACE: 'Google Workspace'
}

export const PLATFORM_TYPES = {
  Microsoft365: 1,
  GoogleWorkspace: 2,
  EWS: 3
}

export const EMITS = {
  ON_ADD_GOOGLE_WORKSPACE: 'on-add-google-workspace',
  ON_ADD_MICROSOFT_365: 'on-add-microsoft-365',
  ON_PREVIEW: 'on-preview',
  ON_ACTION_DELETE: 'on-action-delete',
  ON_EDIT: 'on-edit',
  ON_CLOSE: 'on-close',
  ON_REMOVE_DEFAULT: 'on-remove-default',
  ON_MAKE_DEFAULT: 'on-make-default'
}
