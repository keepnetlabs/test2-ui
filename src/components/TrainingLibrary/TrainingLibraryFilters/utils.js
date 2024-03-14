import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export const TRAINING_LIBRARY_FILTER_OPTIONS = [
  { text: 'Set as Default Filter', icon: 'mdi-content-save', hasMenu: false },
  { text: 'Restore Default Filter', icon: 'mdi-restore', hasMenu: false },
  {
    text: 'Filter Type',
    icon: 'mdi-menu-right',
    closeOnContentClick: true,
    maxWidth: '160',
    nudgeTop: '20',
    hasMenu: true
  },
  {
    text: 'Show/Hide Filter Items',
    icon: 'mdi-menu-right',
    closeOnContentClick: false,
    maxWidth: '240',
    nudgeTop: '144',
    hasMenu: true
  }
]
export const TRAINING_LIBRARY_SORTING_OPTIONS = [
  { text: 'Name', icon: 'mdi-menu-right', menu: [{ text: 'A to Z' }, { text: 'Z to A' }] },
  {
    text: 'Category',
    icon: 'mdi-menu-right',
    menu: [{ text: 'A to Z' }, { text: 'Z to A' }]
  },
  {
    text: 'Date Created',
    icon: 'mdi-menu-right',
    menu: [{ text: 'New to old' }, { text: 'Old to new' }]
  }
]

export const trainingLibraryFilters = [
  {
    text: 'Behaviours',
    icon: 'mdi-account-cog',
    key: PROPERTY_STORE.BEHAVIOURS,
    show: true,
    filterType: 'search',
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Type',
    icon: 'mdi-format-list-bulleted-triangle',
    key: PROPERTY_STORE.TYPE,
    show: true,
    filterType: 'search',
    items: [
      { text: 'Learning Path', value: 'Learning Path' },
      { text: 'Training', value: 'Training' },
      { text: 'Poster', value: 'Poster' },
      { text: 'Infographic', value: 'Infographic' },
      { text: 'Screensaver', value: 'Screensaver' }
    ],
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Category',
    icon: 'mdi-shape',
    key: PROPERTY_STORE.CATEGORY,
    show: true,
    filterType: 'search',
    items: [
      { text: 'All Categories', value: 'All Categories' },
      { text: 'Category 1', value: 'Category 1' },
      { text: 'Category 2', value: 'Category 2' },
      { text: 'Category 3', value: 'Category 3' },
      { text: 'Category 4', value: 'Category 4' },
      { text: 'Category 5', value: 'Category 5' }
    ],
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Language',
    icon: 'mdi-web',
    key: PROPERTY_STORE.LANGUAGES,
    show: true,
    filterType: 'search',
    items: [],
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Created By',
    icon: 'mdi-domain',
    key: PROPERTY_STORE.CREATEDBY,
    show: true,
    filterType: 'select',
    operator: 'Contains',
    value: '',
    initialValue: '',
    isFilterActive: false
  },
  {
    text: 'Target Audience',
    icon: 'mdi-account-multiple',
    key: PROPERTY_STORE.TARGET_AUDIENCE,
    show: true,
    filterType: 'search',
    items: [],
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Compliance',
    icon: 'mdi-clipboard-check',
    key: PROPERTY_STORE.COMPLIANCE,
    show: true,
    filterType: 'select',
    operator: 'Contains',
    value: '',
    initialValue: '',
    isFilterActive: false
  },
  {
    text: 'Vendor',
    icon: 'mdi-store',
    key: PROPERTY_STORE.VENDOR,
    show: false,
    filterType: 'search',
    items: [],
    value: [],
    initialValue: [],
    isFilterActive: false
  },
  {
    text: 'Material Name',
    icon: 'mdi-book',
    key: PROPERTY_STORE.MATERIAL_NAME,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    value: '',
    initialValue: '',
    isFilterActive: false
  },
  {
    text: 'Description',
    icon: 'mdi-file-document',
    key: PROPERTY_STORE.DESCRIPTION,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    value: '',
    initialValue: '',
    isFilterActive: false
  },
  {
    text: 'Tags',
    icon: 'mdi-tag',
    key: PROPERTY_STORE.TAGS,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    value: '',
    initialValue: '',
    isFilterActive: false
  },
  {
    text: 'Date Created',
    icon: 'mdi-calendar',
    key: PROPERTY_STORE.DATE_CREATED,
    show: false,
    filterType: 'date',
    operator: '=',
    value: '',
    initialValue: '',
    isFilterActive: false
  }
]

export const trainingMergeTags = [
  {
    text: 'Training URL',
    value: '{TRAININGURL}'
  },
  {
    text: 'Training Name',
    value: '{TRAININGNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'First Name',
    value: '{FIRSTNAME}'
  },
  {
    text: 'Last Name',
    value: '{LASTNAME}'
  },
  {
    text: 'Company Name',
    value: `{COMPANYNAME}`
  },
  {
    text: 'Training Description',
    value: '{TRAININGDESCRIPTION}'
  },
  {
    text: 'Date SMS Sent',
    value: '{DATESMSSENT}'
  }
]
export const learningPathMergeTags = [
  {
    text: 'Learning Path URL',
    value: '{LEARNINGPATHURL}'
  },
  {
    text: 'Learning Path Name',
    value: '{LEARNINGPATHNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'First Name',
    value: '{FIRSTNAME}'
  },
  {
    text: 'Last Name',
    value: '{LASTNAME}'
  },
  {
    text: 'Company Name',
    value: `{COMPANYNAME}`
  },
  {
    text: 'Learning Path Description',
    value: '{LEARNINGPATHDESCRIPTION}'
  },
  {
    text: 'Date SMS Sent',
    value: '{DATESMSSENT}'
  }
]
export const posterMergeTags = [
  {
    text: 'Poster URL',
    value: '{POSTERURL}'
  },
  {
    text: 'Poster Name',
    value: '{POSTERNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'First Name',
    value: '{FIRSTNAME}'
  },
  {
    text: 'Last Name',
    value: '{LASTNAME}'
  },
  {
    text: 'Company Name',
    value: `{COMPANYNAME}`
  },
  {
    text: 'Poster Description',
    value: '{POSTERDESCRIPTION}'
  },
  {
    text: 'Date SMS Sent',
    value: '{DATESMSSENT}'
  }
]
export const infographicMergeTags = [
  {
    text: 'Infographic URL',
    value: '{INFOGRAPHICURL}'
  },
  {
    text: 'Infographic Name',
    value: '{INFOGRAPHICNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'First Name',
    value: '{FIRSTNAME}'
  },
  {
    text: 'Last Name',
    value: '{LASTNAME}'
  },
  {
    text: 'Company Name',
    value: `{COMPANYNAME}`
  },
  {
    text: 'Infographic Description',
    value: '{INFOGRAPHICDESCRIPTION}'
  },
  {
    text: 'Date SMS Sent',
    value: '{DATESMSSENT}'
  }
]
export const screensaverMergeTags = [
  {
    text: 'Screensaver URL',
    value: '{SCREENSAVERURL}'
  },
  {
    text: 'Screensaver Name',
    value: '{SCREENSAVERNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'First Name',
    value: '{FIRSTNAME}'
  },
  {
    text: 'Last Name',
    value: '{LASTNAME}'
  },
  {
    text: 'Company Name',
    value: `{COMPANYNAME}`
  },
  {
    text: 'Screensaver Description',
    value: '{SCREENSAVERDESCRIPTION}'
  },
  {
    text: 'Date SMS Sent',
    value: '{DATESMSSENT}'
  }
]
