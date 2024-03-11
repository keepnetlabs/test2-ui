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
