import { PROPERTY_STORE } from '@/model/constants/commonConstants'
export const downloadButtonOptions = ['Download Current Page', 'Download All']
export const TRAINING_LIBRARY_MAIN_TABS = {
  ALL_MATERIALS: 'All Materials',
  MOST_POPULAR: 'Most Popular',
  FAVOURITES: 'Favourites',
  CREATED_BY_YOU: 'Created by You'
}
export const trainingTabContents = [
  { name: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS, value: 1 },
  { name: TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR, value: 2 },
  { name: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES, value: 3 },
  { name: TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU, value: 4 }
]
export const TRAINING_LIBRARY_TYPES = {
  ALL_TYPES: 'All Types',
  LEARNING_PATH: 'Learning Path',
  TRAINING: 'Training',
  POSTER: 'Poster',
  INFOGRAPHIC: 'Infographic',
  SCREENSAVER: 'Screensaver',
  SURVEY: 'Survey'
}
export const TRAINING_LIBRARY_PAYLOAD_TYPES = {
  ALL_TYPES: 'All Types',
  LEARNING_PATH: 'LearningPath',
  TRAINING: 'SCORM',
  POSTER: 'Poster',
  INFOGRAPHIC: 'Infographic',
  SCREENSAVER: 'Screensaver',
  SURVEY: 'Survey'
}
export const TRAINING_LIBRARY_SETTINGS_COLUMNS = {
  TYPE: {
    label: 'Type',
    property: PROPERTY_STORE.TYPE,
    show: true
  },
  LEVEL: {
    label: 'Training Level',
    property: PROPERTY_STORE.LEVEL,
    show: true
  },
  DURATION: {
    label: 'Duration',
    property: PROPERTY_STORE.DURATION,
    show: true
  },
  CATEGORY: {
    label: 'Category',
    property: PROPERTY_STORE.CATEGORY,
    show: true
  },
  TARGET_AUDIENCE: {
    label: 'Role',
    property: PROPERTY_STORE.TARGET_AUDIENCE,
    show: true
  },
  LANGUAGES: {
    label: 'Languages',
    property: PROPERTY_STORE.LANGUAGES,
    show: true
  },
  CREATED_BY: {
    label: 'Created By',
    property: PROPERTY_STORE.CREATEDBY,
    show: true
  },
  COMPLIANCE: {
    label: 'Compliance',
    property: PROPERTY_STORE.COMPLIANCE,
    show: true
  },
  TAGS: {
    label: 'Tags',
    property: PROPERTY_STORE.TAGS,
    show: true
  },
  VENDOR: {
    label: 'Vendor',
    property: PROPERTY_STORE.VENDORNAME,
    show: true
  },
  DATE_CREATED: {
    label: 'Date Created',
    property: PROPERTY_STORE.CREATE_TIME,
    show: false
  }
}
export const TRAINING_LIBRARY_FILTER_OPTIONS_FILTERS = {
  BEHAVIOURS: {
    label: 'Behaviours',
    property: PROPERTY_STORE.BEHAVIOURS,
    show: true
  },
  TYPE: {
    label: 'Type',
    property: PROPERTY_STORE.TYPE,
    show: true
  },
  LEVEL: {
    label: 'Training Level',
    property: PROPERTY_STORE.LEVEL,
    show: true
  },
  DURATION: {
    label: 'Duration',
    property: PROPERTY_STORE.DURATION,
    show: true
  },
  CATEGORY: {
    label: 'Category',
    property: PROPERTY_STORE.CATEGORY,
    show: true
  },
  LANGUAGES: {
    label: 'Language',
    property: PROPERTY_STORE.LANGUAGES,
    show: true
  },
  CREATED_BY: {
    label: 'Created By',
    property: PROPERTY_STORE.CREATEDBY,
    show: true
  },
  TARGET_AUDIENCE: {
    label: 'Role',
    property: PROPERTY_STORE.TARGET_AUDIENCE,
    show: true
  },
  COMPLIANCE: {
    label: 'Compliance',
    property: PROPERTY_STORE.COMPLIANCE,
    show: true
  },
  VENDOR: {
    label: 'Vendor',
    property: PROPERTY_STORE.VENDOR,
    show: true
  },
  MATERIAL_NAME: {
    label: 'Material Name',
    property: PROPERTY_STORE.TRAINING_NAME,
    show: false
  },
  DESCRIPTION: {
    label: 'Description',
    property: PROPERTY_STORE.DESCRIPTION,
    show: false
  },
  TAGS: {
    label: 'Tags',
    property: PROPERTY_STORE.TAGS,
    show: false
  },
  DATE_CREATED: {
    label: 'Date Created',
    property: PROPERTY_STORE.CREATETIME,
    show: false
  }
}
