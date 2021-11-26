import {
  COMMON_CONSTANTS,
  getStoreValue,
  LABEL_STORE,
  PROPERTY_STORE
} from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
export const axiosPayload = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'CreateTime',
  ascending: false,
  filter: {
    Condition: 'AND',
    FilterGroups: [
      {
        Condition: 'AND',
        FilterItems: [],
        FilterGroups: []
      },
      {
        Condition: 'OR',
        FilterItems: [],
        FilterGroups: []
      }
    ]
  }
}

export const COLUMNS = {
  CAMPAIGN_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.CampaignName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'slot',
    width: 360,
    isEditable: false,
    isCustomOverflowedColumn: true,
    filterableType: 'text',
    parentRect: 'reported-email-subject',
    overrideWidth: true
  },
  CREATEDBY: {
    property: PROPERTY_STORE.CREATEDBY,
    align: 'left',
    editable: false,
    label: labels.CreatedBy,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  SCHEDULE: {
    property: PROPERTY_STORE.SCHEDULE,
    align: 'center',
    editable: false,
    label: labels.Schedule,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  TARGET_USERS: {
    property: PROPERTY_STORE.TARGET_USERS,
    align: 'right',
    editable: false,
    label: labels.TargetUsers,
    fixed: false,
    sortable: true,
    show: true,
    type: 'number',
    width: 160,
    filterableType: 'number',
    emptyText: 0
  },
  TARGET_USERS_ITEM_TABLE: {
    property: 'totalTargetUserCount',
    align: 'right',
    editable: false,
    label: labels.TargetUsers,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    emptyText: 0,
    filterableType: 'number'
  },
  STATUS: {
    property: PROPERTY_STORE.STATUS,
    align: 'center',
    label: labels.Status,
    fixed: false,
    sortable: true,
    show: true,
    type: 'badge',
    width: 150,
    filterableType: 'select'
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
  },
  CREATE_TIME_ITEM_TABLE: {
    property: 'startDate',
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  LAST_LAUNCH: {
    property: PROPERTY_STORE.LASTLAUNCH,
    align: 'left',
    editable: false,
    label: labels.LastLaunch,
    sortable: true,
    show: true,
    width: 160,
    type: 'text'
  }
}
export const ACTION_STATUSES = {
  RUNNING: 'Running',
  PAUSE: 'Paused',
  RESUME: 'Resumed',
  DELETE: 'Delete',
  COMPLETE: 'Completed',
  CANCEL: 'Canceled',
  IDLE: 'Idle'
}
