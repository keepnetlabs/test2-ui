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
  {
    text: 'Name',
    orderBy: 'trainingName',
    icon: 'mdi-menu-right',
    menu: [
      { text: 'A to Z', ascending: true },
      { text: 'Z to A', ascending: false }
    ]
  },
  {
    text: 'Category',
    icon: 'mdi-menu-right',
    orderBy: 'category',
    menu: [
      { text: 'A to Z', ascending: true },
      { text: 'Z to A', ascending: false }
    ]
  },
  {
    text: 'Date Created',
    icon: 'mdi-menu-right',
    orderBy: 'createTime',
    menu: [
      { text: 'New to old', ascending: false },
      { text: 'Old to new', ascending: true }
    ]
  }
]

export const trainingLibraryFilters = [
  {
    text: 'Behaviours',
    icon: 'mdi-account-cog',
    key: PROPERTY_STORE.BEHAVIOURS,
    show: true,
    filterType: 'longTextSearch',
    value: [],
    activeValue: [],
    operator: 'Include',
    activeOperator: 'Include',
    isFilterActive: false
  },
  {
    text: 'Type',
    icon: 'mdi-format-list-bulleted-type',
    key: PROPERTY_STORE.TYPE,
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    items: [],
    value: [],
    activeValue: [],
    isFilterActive: false
  },
  {
    text: 'Category',
    icon: 'mdi-shape',
    key: PROPERTY_STORE.CATEGORY,
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    items: [],
    value: [],
    activeValue: [],
    isFilterActive: false
  },
  {
    text: 'Language',
    icon: 'mdi-web',
    key: PROPERTY_STORE.LANGUAGES,
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    items: [],
    value: [],
    activeValue: [],
    isFilterActive: false
  },
  {
    text: 'Created By',
    icon: 'mdi-domain',
    key: PROPERTY_STORE.CREATEDBY,
    show: true,
    filterType: 'select',
    operator: 'Contains',
    activeOperator: 'Contains',
    value: '',
    activeValue: '',
    isFilterActive: false
  },
  {
    text: 'Role',
    icon: 'mdi-account-multiple',
    key: PROPERTY_STORE.TARGET_AUDIENCE,
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    items: [],
    value: [],
    activeValue: [],
    isFilterActive: false
  },
  {
    text: 'Compliance',
    icon: 'mdi-clipboard-check',
    key: PROPERTY_STORE.COMPLIANCE,
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    value: [],
    activeValue: [],
    isFilterActive: false
  },
  {
    text: 'Vendor',
    icon: 'mdi-store',
    key: PROPERTY_STORE.VENDOR,
    show: true,
    filterType: 'search',
    items: [],
    value: [],
    activeValue: [],
    operator: 'Include',
    activeOperator: 'Include',
    isFilterActive: false
  },
  {
    text: 'Material Name',
    icon: 'mdi-book',
    key: PROPERTY_STORE.MATERIAL_NAME,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    activeOperator: 'Contains',
    value: '',
    activeValue: '',
    isFilterActive: false
  },
  {
    text: 'Description',
    icon: 'mdi-file-document',
    key: PROPERTY_STORE.DESCRIPTION,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    activeOperator: 'Contains',
    value: '',
    activeValue: '',
    isFilterActive: false
  },
  {
    text: 'Tags',
    icon: 'mdi-tag',
    key: PROPERTY_STORE.TAGS,
    show: false,
    filterType: 'select',
    operator: 'Contains',
    activeOperator: 'Contains',
    value: '',
    activeValue: '',
    isFilterActive: false
  },
  {
    text: 'Date Created',
    icon: 'mdi-calendar',
    key: PROPERTY_STORE.CREATETIME,
    show: false,
    filterType: 'date',
    operator: '=',
    activeOperator: '=',
    value: '',
    activeValue: '',
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
    text: 'Training Name',
    value: '{TRAININGNAME}'
  },
  {
    text: 'Full Name',
    value: '{FULLNAME}'
  },
  {
    text: 'Learning Path Step',
    value: '{LEARNING_PATH_STEP}'
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
    value: '{LEARNING_PATH_DESCRIPTION}'
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
