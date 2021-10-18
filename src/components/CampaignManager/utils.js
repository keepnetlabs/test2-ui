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
    width: 300,
    isEditable: false,
    isCustomOverflowedColumn: true,
    filterableType: 'text',
    parentRect: 'reported-email-subject',
    overrideWidth: true
  },
  TARGET_USERS: {
    property: PROPERTY_STORE.TARGET_USERS,
    align: 'center',
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
  STATUS: {
    property: PROPERTY_STORE.STATUS,
    align: 'center',
    label: labels.Status,
    fixed: false,
    sortable: true,
    show: true,
    type: 'status',
    width: 150,
    filterableType: 'select',
    filterableItems: COMMON_CONSTANTS.CAMPAIGN_MANAGER_STATUS_ITEMS
  },
  CREATE_TIME: {
    property: PROPERTY_STORE.CREATETIME,
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'date'
  },
  LAST_LAUNCH: {
    property: PROPERTY_STORE.LASTLAUNCH,
    align: 'left',
    editable: false,
    label: labels.LastLaunch,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'date'
  }
}
