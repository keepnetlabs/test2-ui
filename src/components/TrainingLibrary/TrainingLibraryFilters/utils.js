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
  { text: 'Behaviours', icon: 'mdi-account-cog', key: 'behaviours' },
  {
    text: 'Type',
    icon: 'mdi-format-list-bulleted-triangle',
    key: 'type'
  },
  {
    text: 'Category',
    icon: 'mdi-shape',
    key: 'category'
  }
]

export const trainingLibraryFilters = [
  {
    text: 'Behaviours',
    icon: 'mdi-account-cog',
    key: 'behaviours',
    show: true,
    filterType: 'search'
  },
  {
    text: 'Type',
    icon: 'mdi-format-list-bulleted-triangle',
    key: 'type',
    show: true,
    filterType: 'search',
    items: [
      { text: 'Learning Path', value: 'Learning Path' },
      { text: 'Training', value: 'Training' },
      { text: 'Poster', value: 'Poster' },
      { text: 'Infographic', value: 'Infographic' },
      { text: 'Screensaver', value: 'Screensaver' }
    ]
  },
  {
    text: 'Category',
    icon: 'mdi-shape',
    key: 'category',
    show: true,
    filterType: 'search',
    items: []
  },
  {
    text: 'Language',
    icon: 'mdi-web',
    key: 'language',
    show: true,
    filterType: 'search',
    items: []
  },
  {
    text: 'Created By',
    icon: 'mdi-domain',
    key: 'createdBy',
    show: true,
    filterType: 'select'
  },
  {
    text: 'Target Audience',
    icon: 'mdi-account-multiple',
    key: 'targetAudience',
    show: true,
    filterType: 'select'
  },
  {
    text: 'Compliance',
    icon: 'mdi-clipboard-check',
    key: 'compliance',
    show: true,
    filterType: 'select'
  },
  {
    text: 'Vendor',
    icon: 'mdi-store',
    key: 'vendor',
    show: false,
    filterType: 'select'
  },
  {
    text: 'Material Name',
    icon: 'mdi-book',
    key: 'compliance',
    show: false,
    filterType: 'select'
  },
  {
    text: 'Description',
    icon: 'mdi-file-document',
    key: 'description',
    show: false,
    filterType: 'select'
  },
  {
    text: 'Tags',
    icon: 'mdi-tag',
    key: 'tags',
    show: false,
    filterType: 'select'
  },
  {
    text: 'Date Created',
    icon: 'mdi-calendar',
    key: 'dateCreated',
    show: false,
    filterType: 'select'
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
