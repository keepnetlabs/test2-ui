import { PROPERTY_STORE } from '@/model/constants/commonConstants'
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

export const METHOD_TYPES = {
  CLICK_ONLY: 'Click-Only',
  MULTIPLE_METHOD: 'Multiple Method',
  DATA_SUBMISSION: 'Data Submission',
  MFA: 'MFA'
}

export const SCHEDULE_TYPES = {
  SEND_NOW: '1',
  SAVE_FOR_LATER: '2',
  SCHEDULE_TO: '3'
}
export const SEND_RANDOMLY_USERS_CALCULATE_TYPES = {
  PERCENTAGE: '1',
  USERS: '2'
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
    // filterableType: 'select',
    // filterableItems: ['Custom', 'System']
  },
  SCHEDULE: {
    property: 'startDate',
    align: 'left',
    editable: false,
    label: labels.Schedule,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
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
  SCENARIO_COUNT: {
    property: PROPERTY_STORE.SCENARIO_COUNT,
    align: 'right',
    editable: false,
    label: labels.Scenarios,
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
    type: 'slot',
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
    property: 'createdDate',
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  METHOD: {
    property: PROPERTY_STORE.METHOD,
    align: 'left',
    label: labels.Method,
    fixed: false,
    sortable: true,
    show: true,
    type: 'slot',
    filterableType: 'select',
    filterableItems: [
      { text: 'Multiple Method', value: 'Multiple Method' },
      { text: 'Click Only', value: 'Click-Only' },
      { text: 'Data Submission', value: 'Data Submission' },
      { text: 'MFA', value: 'MFA' }
    ],
    width: 160
  },
  EMAIL_DELIVERY: {
    property: PROPERTY_STORE.EMAIL_DELIVERY,
    align: 'left',
    editable: false,
    label: labels.EmailDelivery,
    sortable: true,
    show: true,
    fixed: false,
    width: 200,
    type: 'text',
    filterableType: 'text'
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
  },
  LAST_LAUNCH_FILTERED: {
    property: PROPERTY_STORE.LASTLAUNCH,
    align: 'left',
    editable: false,
    label: labels.LastLaunch,
    sortable: true,
    show: true,
    width: 160,
    type: 'text',
    filterableType: 'date'
  }
}
export const ACTION_STATUSES = {
  RUNNING: 'Running',
  PAUSE: 'Paused',
  RESUME: 'Resumed',
  DELETE: 'Delete',
  COMPLETE: 'Completed',
  CANCEL: 'Canceled',
  IDLE: 'Idle',
  ERROR: 'Error'
}

export function getStatusBadgeProps(status) {
  if (status === 'Completed') {
    return {
      color: '#217124',
      text: 'Completed'
    }
  }

  if (status === 'Running') {
    return {
      color: '#1173C1',
      text: 'Running'
    }
  }

  if (status === 'Idle') {
    return {
      color: '#0198AC',
      text: 'Idle'
    }
  }

  if (status === 'Paused') {
    return {
      color: '#B6791D',
      text: 'Paused'
    }
  }

  if (status === 'Cancelled' || status === 'Canceled') {
    return {
      color: '#B6791D',
      text: 'Cancelled'
    }
  }

  if (status === 'Scheduled') {
    return {
      color: '#757575',
      text: 'Scheduled'
    }
  }

  if (status === 'Error') {
    return {
      color: '#F56C6C',
      text: 'Error',
      outline: false
    }
  }
}

export const methods = [
  { text: 'Click-Only', value: 'WNZt0sCVCWB3' },
  { text: 'Data Submission', value: 'DYC0gugxJMjT' },
  { text: 'MFA', value: '7dLrW2kdBTDs' }
]

export const difficulties = [
  { text: 'Easy', value: 'mT0CeYGgKsVb' },
  { text: 'Medium', value: 'Z5XeVlpw6Dps' },
  { text: 'Hard', value: 'c4LCGEB9MayB' }
]

export const DISTRIBUTION_TYPES = {
  PHISHING: '1',
  SMISHING: '3',
  QUISHING_INDIVIDUAL_PRINTOUT: '4'
}
export const DISTRIBUTION_START_TYPES = {
  NOW: 1,
  SCHEDULED: 2
}
