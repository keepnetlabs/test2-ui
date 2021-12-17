import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const COLUMNS = {
  CAMPAIGN_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.CampaignName,
    fixed: 'left',
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    isCustomOverflowedColumn: true,
    filterableType: 'text',
    parentRect: 'reported-email-subject',
    overrideWidth: true
  },
  LAST_LAUNCH: {
    property: 'startDate',
    align: 'left',
    editable: false,
    label: labels.LastLaunch,
    sortable: true,
    show: true,
    width: 160,
    type: 'text',
    filterableType: 'date'
  },
  TARGET_USERS: {
    property: 'totalTargetUserCount',
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
  STATUS: {
    property: PROPERTY_STORE.STATUS,
    align: 'center',
    label: labels.Status,
    fixed: false,
    sortable: true,
    show: true,
    type: 'badge',
    width: 150,
    filterableType: 'select',
    filterableItems: ['Idle', 'Running', 'Completed', 'Canceled', 'Paused', 'Error']
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
  USER_STATS: {
    property: 'campaignStatus',
    align: 'center',
    editable: false,
    label: 'User Stats',
    fixed: false,
    sortable: false,
    show: true,
    type: 'chart',
    width: 130,
    hideSort: true
  },
  DELIVERY: {
    property: 'progress',
    align: 'center',
    editable: false,
    label: getStoreValue('progress'),
    fixed: false,
    sortable: false,
    show: true,
    type: 'progress',
    progressType: 'stats',
    width: 120,
    hideSort: true
    // minWidth: 60
  },
  DATE_CREATED: {
    property: 'createdDate',
    align: 'left',
    label: 'Date Created',
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  }
}
