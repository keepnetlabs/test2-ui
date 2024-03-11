import labels from '@/model/constants/labels'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export const downloadButtonOptions = ['Download Current Page', 'Download All']
export const TRAINING_LIBRARY_MAIN_TABS = {
  ALL_MATERIALS: 'All Materials',
  MOST_POPULAR: 'Most Popular',
  FAVOURITES: 'Favourites',
  CREATED_BY_YOU: 'Created by You'
}
export const trainingTabContents = [
  { name: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS },
  { name: TRAINING_LIBRARY_MAIN_TABS.MOST_POPULAR },
  { name: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES },
  { name: TRAINING_LIBRARY_MAIN_TABS.CREATED_BY_YOU }
]
export const TRAINING_LIBRARY_TYPES = {
  ALL_TYPES: 'All Types',
  LEARNING_PATH: 'Learning Path',
  TRAINING: 'Training',
  POSTER: 'Poster',
  INFOGRAPHIC: 'Infographic',
  SCREENSAVER: 'Screensaver'
}
export const TRAINING_LIBRARY_SETTINGS_COLUMNS = {
  TYPE: {
    label: 'Type',
    property: PROPERTY_STORE.TYPE,
    show: true
  },
  CATEGORY: {
    label: 'Category',
    property: PROPERTY_STORE.CATEGORY,
    show: true
  },
  TARGET_AUDIENCE: {
    label: 'Target Audience',
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
    property: PROPERTY_STORE.VENDOR,
    show: false
  },
  DATE_CREATED: {
    label: 'Date Created',
    property: PROPERTY_STORE.DATE_CREATED,
    show: false
  }
}
