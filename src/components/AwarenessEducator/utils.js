import { getStoreValue, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'

export const EMITS = {
  ON_ADD: 'on-add',
  ON_PREVIEW: 'on-preview',
  ON_ACTION_DELETE: 'on-action-delete',
  ON_EDIT: 'on-edit',
  ON_CLOSE: 'on-close',
  ON_TRAINING: 'on-training',
  ON_ITEM_CHANGE: 'on-item-change'
}

export const COLUMNS = {
  NAME: {
    property: PROPERTY_STORE.NAME,
    align: 'left',
    label: labels.TrainingName,
    fixed: 'left',
    sortable: true,
    show: true,
    filterableType: 'text',
    type: 'slot',
    width: 160
  },
  DESCRIPTION: {
    property: PROPERTY_STORE.DESCRIPTION,
    align: 'left',
    editable: false,
    label: labels.Description,
    sortable: true,
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
    width: 180,
    filterableType: 'select',
    filterableItems: []
  },
  AUDIENCE: {
    property: PROPERTY_STORE.AUDIENCE,
    align: 'left',
    editable: false,
    label: labels.TargetAudience,
    sortable: true,
    show: true,
    type: 'text',
    width: 180,
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
    filterableType: 'select',
    filterableItems: []
  },
  TYPE: {
    property: PROPERTY_STORE.TYPE,
    align: 'left',
    editable: false,
    label: labels.Type,
    sortable: true,
    show: true,
    type: 'text',
    width: 160,
    filterableType: 'text'
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
  }
}
