export const ACTIVITY_TYPE_COLOR_MAP = {
  Reported: '#43A047',
  'Clicked Link': '#F56C6C',
  'Submitted Data': '#F56C6C',
  'Submitted MFA Code': '#F56C6C',
  'Opened Attachment': '#F56C6C',
  'Called Back': '#F56C6C',
  'Entered Digits': '#F56C6C',
  'Scanned QR Link': '#F56C6C',
  'Vished (Dialed Number)': '#F56C6C',
  Answered: '#E6A23C',
  'Training Completed': '#43A047',
  'Clicked Training Link': '#43A047',
  'Clicked Training': '#43A047',
  'Training Not Completed': '#F56C6C',
  'Exam Passed': '#43A047',
  'Exam Failed': '#F56C6C',
  'Downloaded Poster': '#43A047',
  'Downloaded Infographic': '#43A047'
}

export const ACTIVITY_TYPES_FAIL_MAP = {
  Reported: false,
  'Clicked Link': true,
  'Submitted Data': true,
  'Submitted MFA Code': true,
  'Opened Attachment': true,
  'Called Back': true,
  'Entered Digits': true,
  'Scanned QR Link': true,
  'Vished (Dialed Number)': true,
  Answered: false,
  'Training Completed': false,
  'Clicked Training Link': false,
  'Clicked Training': false,
  'Training Not Completed': true,
  'Exam Passed': false,
  'Exam Failed': true,
  'Downloaded Poster': false,
  'Downloaded Infographic': false
}

export const userActivityDetailsFilters = [
  {
    text: 'Activity Type',
    icon: 'mdi-format-list-bulleted-type',
    key: 'activityType',
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
    text: 'Product',
    icon: 'mdi-package-variant-closed',
    key: 'product',
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
    text: 'Difficulty',
    icon: 'mdi-signal-cellular-3',
    key: 'difficulty',
    show: true,
    filterType: 'search',
    operator: 'Include',
    activeOperator: 'Include',
    items: [],
    value: [],
    activeValue: [],
    isFilterActive: false
  }
  // {
  //   text: 'Category',
  //   icon: 'mdi-shape',
  //   key: 'category',
  //   show: true,
  //   filterType: 'search',
  //   operator: 'Include',
  //   activeOperator: 'Include',
  //   items: [],
  //   value: [],
  //   activeValue: [],
  //   isFilterActive: false
  // }
]
