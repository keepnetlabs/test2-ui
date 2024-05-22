import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export const EMITS = {
  ON_ADD: 'on-add',
  ON_PREVIEW: 'on-preview',
  ON_ACTION_DELETE: 'on-action-delete',
  ON_EDIT: 'on-edit',
  ON_CLOSE: 'on-close',
  ON_TRAINING: 'on-training',
  ON_ITEM_CHANGE: 'on-item-change',
  ON_DUPLICATE: 'on-duplicate',
  ON_DOWNLOAD: 'on-download',
  ON_ADD_POSTER: 'on-add-poster',
  ON_DOWNLOAD_POSTER: 'on-download-poster'
}

export const TRAINING_TYPES = {
  SCORM: 'SCORM',
  POSTER: 'Poster'
}

export const ENROLLMENT_STATUSES = {
  AUTO_ENROLL: 'Auto-Enroll',
  SENDING: 'Sending',
  FINISHED: 'Finished',
  SCHEDULED: 'Scheduled',
  ERROR: 'Error',
  STOPPED: 'Stopped',
  PAUSED: 'Paused',
  ARCHIVED: 'Archived',
  DELETED: 'Deleted',
  SCORM_PROXY: 'SCORM Proxy'
}

export const ENROLLMENT_STATUSES_FILTER = [
  ENROLLMENT_STATUSES.AUTO_ENROLL,
  ENROLLMENT_STATUSES.SENDING,
  ENROLLMENT_STATUSES.FINISHED,
  ENROLLMENT_STATUSES.SCHEDULED,
  ENROLLMENT_STATUSES.PAUSED,
  ENROLLMENT_STATUSES.ERROR,
  ENROLLMENT_STATUSES.DELETED
]

export const COLUMNS = {
  ENROLLMENT_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.EnrollmentName,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  TRAINING_NAME_UNFIXED: {
    property: PROPERTY_STORE.TRAINING_NAME,
    align: 'left',
    label: labels.TrainingName,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  MATERIAL_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.MaterialName,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  POSTER_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.PosterName,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  LEARNING_PATH_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.LearningPathName,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    overrideWidth: true,
    width: 200
  },
  INFOGRAPHIC_NAME: {
    property: PROPERTY_STORE.MATERIAL_NAME,
    align: 'left',
    label: labels.InfoGraphicName,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  NAME: {
    property: PROPERTY_STORE.TRAINING_NAME,
    align: 'left',
    label: labels.TrainingName,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  DISTRIBUTED: {
    property: PROPERTY_STORE.DISTRIBUTED,
    align: 'left',
    label: labels.Distributed,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'select',
    type: 'text',
    filterableItems: ['Yes', 'No'],
    width: 160
  },
  OWNER: {
    property: PROPERTY_STORE.OWNER,
    align: 'left',
    label: labels.Owner,
    fixed: false,
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 160
  },
  CERTIFICATE_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.CertificateTemplate,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'defaultTemplate',
    width: 160
  },
  DESCRIPTION: {
    property: PROPERTY_STORE.DESCRIPTION,
    align: 'left',
    editable: false,
    label: labels.Description,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'text'
  },
  CATEGORY: {
    property: PROPERTY_STORE.CATEGORY,
    align: 'left',
    editable: false,
    label: labels.Category,
    sortable: true,
    show: true,
    type: 'text',
    width: 200,
    filterableType: 'select',
    filterableItems: []
  },
  AUDIENCE: {
    property: PROPERTY_STORE.TARGET_AUDIENCE,
    align: 'left',
    editable: false,
    label: labels.TargetAudience,
    sortable: true,
    show: true,
    type: 'text',
    width: 220,
    filterableType: 'select',
    filterableItems: []
  },
  LANGUAGES: {
    property: PROPERTY_STORE.LANGUAGES,
    align: 'left',
    editable: false,
    label: labels.Languages,
    sortable: true,
    show: true,
    width: 160,
    type: 'smallBadge',
    hasTooltip: true,
    filterableType: 'select',
    filterableItems: []
  },
  TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    editable: false,
    label: labels.Type,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'select',
    filterableItems: ['SCORM', 'Poster']
  },
  ENROLLMENT_TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    editable: false,
    label: labels.Type,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'select',
    filterableItems: [
      { text: TRAINING_LIBRARY_TYPES.TRAINING, value: 1 },
      { text: TRAINING_LIBRARY_TYPES.POSTER, value: 3 },
      { text: TRAINING_LIBRARY_TYPES.INFOGRAPHIC, value: 4 },
      { text: TRAINING_LIBRARY_TYPES.SCREENSAVER, value: 5 },
      { text: TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH, value: 6 }
    ]
  },
  CREATE_TIME: {
    property: PROPERTY_STORE.CREATETIME,
    align: 'left',
    editable: false,
    label: labels.DateCreated,
    fixed: false,
    sortable: true,
    show: false,
    type: 'text',
    width: 160,
    filterableType: 'date'
  },
  CREATED_BY: {
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
  ENROLLED_BY: {
    property: PROPERTY_STORE.ENROLLED_BY,
    align: 'left',
    editable: false,
    label: labels.EnrolledBy,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  DELIVERY: {
    property: PROPERTY_STORE.DELIVERY,
    align: 'center',
    editable: false,
    label: labels.Delivery,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
  },
  DELIVERY_TYPE: {
    property: PROPERTY_STORE.DELIVERY_TYPE,
    align: 'left',
    editable: false,
    label: labels.DeliveryType,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    filterableType: 'select',
    filterableItems: ['Email', 'Email & SMS']
  },
  START_DATE: {
    property: PROPERTY_STORE.START_DATE,
    align: 'left',
    editable: false,
    label: labels.JustStartDate,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'date'
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
    filterableItems: ENROLLMENT_STATUSES_FILTER
  },
  STATUS_TRASH: {
    property: PROPERTY_STORE.STATUS,
    align: 'center',
    label: labels.Status,
    fixed: false,
    sortable: true,
    show: true,
    type: 'badge',
    width: 150,
    filterableType: 'select',
    filterableItems: ['Archived']
  },
  TARGET_USERS: {
    property: PROPERTY_STORE.RECIPIENT_TYPE,
    align: 'left',
    editable: false,
    label: labels.TargetUsers,
    sortable: true,
    show: true,
    type: 'text',
    width: 220,
    filterableType: 'select',
    filterableItems: [{ text: 'User Group', value: 'UserGroup' }, 'Campaign']
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
    filterableType: 'text'
  },
  ENROLLMENT_TAGS: {
    property: PROPERTY_STORE.TAGS,
    align: 'left',
    editable: false,
    label: 'Tags',
    fixed: false,
    sortable: false,
    hideSort: true,
    show: true,
    type: 'smallBadge',
    width: 150,
    hasTooltip: true,
    filterableType: 'text'
  },
  SCHEDULE_NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.ScheduleName,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'text',
    width: 200
  },
  FREQUENCY: {
    property: PROPERTY_STORE.FREQUENCY,
    align: 'left',
    editable: false,
    label: labels.Frequency,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'select',
    filterableItems: [
      { text: 'One Time', value: 0 },
      { text: 'Weekly', value: 1 },
      { text: 'Every two weeks', value: 2 },
      { text: 'Monthly', value: 3 },
      { text: 'Quarterly', value: 4 }
    ]
  },
  DATE_CREATED: {
    property: 'createTime',
    align: 'left',
    label: 'Date Created',
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  LAST_SEND_DATE: {
    property: PROPERTY_STORE.LAST_SEND_DATE,
    align: 'left',
    label: labels.LastSendDate,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  },
  NEXT_SEND_DATE: {
    property: PROPERTY_STORE.NEXT_SEND_DATE,
    align: 'left',
    label: labels.NextSendDate,
    fixed: false,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
    isEditable: false,
    filterableType: 'date'
  }
}
