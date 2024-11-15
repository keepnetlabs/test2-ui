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

export const ACTIVITY_TYPES = {
  'Clicked Link': 'Clicked Link',
  'Submitted Data': 'Submitted Data',
  'Submitted MFA Code': 'Submitted MFA Code',
  'Opened Attachment': 'Opened Attachment',
  Reported: 'Reported',
  'Called Back': 'Called Back',
  'Entered Digits': 'Entered Digits',
  Answered: 'Answered',
  Vished: 'Vished (Dialed Number)',
  'Scanned QR Link': 'Scanned QR Link',
  'Training Completed': 'Training Completed',
  'Training Not Completed': 'Training Not Completed',
  'Exam Passed': 'Exam Passed',
  'Exam Failed': 'Exam Failed',
  'Downloaded Poster': 'Downloaded Poster',
  'Downloaded Infographic': 'Downloaded Infographic'
}

export const PRODUCTS = {
  'Phishing Simulator': 'Phishing Simulator',
  'Callback Simulator': 'Callback Simulator',
  'Vishing Simulator': 'Vishing Simulator',
  'Smishing Simulator': 'Smishing Simulator',
  'Quishing Simulator': 'Quishing Simulator',
  'Awareness Educator': 'Awareness Educator'
}

export const DIFFICULTIES = {
  Easy: 'Easy',
  Medium: 'Medium',
  Hard: 'Hard'
}

export const categories = [
  'Remote Working Security',
  'Travel Security',
  'Mobile Device Security',
  'Email Security',
  'Social Media Security',
  'Safe Online Shopping',
  'Malware',
  'Physical Security',
  'Cyber Spying',
  'Password Security',
  'GDPR',
  'Social Engineering',
  'Removable Media',
  'Wi-fi Security',
  'General'
]

export const activityTypesFilterOptions = [
  {
    text: 'Clicked Link',
    value: '0'
  },
  {
    text: 'Submitted Data',
    value: '1'
  },
  {
    text: 'Submitted MFA Code',
    value: '2'
  },
  {
    text: 'Opened Attachment',
    value: '3'
  },
  {
    text: 'Reported',
    value: '4'
  }
]

export const productsFilterOptions = [
  {
    text: 'Phishing Simulator',
    value: '0'
  },
  {
    text: 'Callback Simulator',
    value: '1'
  },
  {
    text: 'Vishing Simulator',
    value: '2'
  },
  {
    text: 'Smishing Simulator',
    value: '3'
  },
  {
    text: 'Quishing Simulator',
    value: '4'
  }
]

export const difficultiesFilterOptions = [
  {
    text: 'Easy',
    value: '0'
  },
  {
    text: 'Medium',
    value: '1'
  },
  {
    text: 'Hard',
    value: '2'
  }
]

export const categoriesFilterOptions = [
  {
    text: 'Remote Working Security',
    value: '0'
  },
  {
    text: 'Travel Security',
    value: '1'
  },
  {
    text: 'Mobile Device Security',
    value: '2'
  },
  {
    text: 'Email Security',
    value: '3'
  }
]

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
  //   items: categoriesFilterOptions,
  //   value: [],
  //   activeValue: [],
  //   isFilterActive: false
  // }
]
