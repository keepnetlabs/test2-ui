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

export const CAMPAIGN_TYPE = {
  Phishing: 1,
  Smishing: 2,
  Quishing: 3,
  Callback: 4,
  Vishing: 5
}

export const METHOD_TYPES = {
  CLICK_ONLY: 'Click-Only',
  MULTIPLE_METHOD: 'Multiple Method',
  DATA_SUBMISSION: 'Data Submission',
  ATTACHMENT: 'Attachment',
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
export const scenarioDistributionFilterItems = [
  'Manually',
  'AI Ally selects scenario for each user',
  'Random scenarios for each user',
  'Same random scenario for all users'
]
export const scenarioDistributionItems = [
  { text: 'Select scenarios manually', value: 0 },
  { text: 'Select random scenarios for each user', value: 1 },
  { text: 'Select same random scenario for all users', value: 2 },
  { text: 'AI Ally selects scenario for each user', value: 3 }
]
export const COLUMNS = {
  SCENARIO_DISTRIBUTION: {
    property: `categoryDistributionType`,
    align: 'left',
    editable: false,
    label: `Scenario Distribution`,
    sortable: true,
    show: true,
    type: 'slot',
    width: 260,
    filterableType: 'select',
    filterableItems: scenarioDistributionFilterItems,
    filterableCustomFieldName: 'ScenarioDistribution'
  },
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
  HAS_TRAINING: {
    property: PROPERTY_STORE.HAS_TRAINING,
    align: 'center',
    label: labels.Training,
    fixed: false,
    sortable: true,
    show: true,
    type: 'attachment',
    width: 160,
    filterableType: 'select',
    filterableItems: [
      {
        text: 'Yes',
        value: true
      },
      {
        text: 'No',
        value: false
      }
    ]
  },
  FREQUENCY: {
    property: PROPERTY_STORE.FREQUENCY_DESCRIPTION,
    align: 'left',
    label: labels.Frequency,
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
  START_TIME: {
    property: 'startDate',
    align: 'left',
    editable: false,
    label: labels.StartTime,
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
    type: 'slot',
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
    width: 170,
    filterableType: 'select',
    props: {
      style: { maxWidth: '130px' }
    }
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
      { text: 'Attachment', value: 'Attachment' },
      { text: 'MFA', value: 'MFA' }
    ],
    width: 160
  },
  QUISHING_TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    label: labels.QuishingType,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'select',
    filterableItems: [
      { text: 'Email', value: 'Email' },
      { text: 'Individual Printout', value: 'Individual' }
    ],
    width: 160
  },
  QUISHING_EMAIL_TYPE: {
    property: PROPERTY_STORE.TEMPLATETYPE,
    align: 'left',
    label: labels.QuishingType,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    filterableType: 'select',
    filterableItems: [
      { text: 'Email', value: 'Email' },
      { text: 'Individual Printout', value: 'Individual' }
    ],
    width: 160
  },
  QUISHING_METHOD: {
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
  ERROR: 'Error',
  INDIVIDUAL: 'Individual Printout',
  SCHEDULED: 'Scheduled'
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
  if (status === 'Individual Printout') {
    return {
      color: '#757575',
      text: 'Individual Printout'
    }
  }
}

export const frequencyItems = [
  { text: 'One Time', value: 0 },
  { text: 'Weekly', value: 1 },
  { text: 'Every two weeks', value: 2 },
  { text: 'Monthly', value: 3 },
  { text: 'Quarterly', value: 4 }
]

export const SCENARIO_DISTRIBUTION = {
  MANUALLY: 0,
  RANDOM_SCENARIO_FOR_EACH: 1,
  SAME_SCENARIO_FOR_ALL: 2
}

export const SCENARIO_DISTRIBUTION_TEXTS = [
  'Manually',
  'Random scenarios for each user',
  'Same random scenario for all users',
  'AI Ally selects scenario for each user'
]
