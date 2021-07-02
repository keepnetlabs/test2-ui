export default {
  CUSTOM_EVENTS: {
    REFRESH_ACTION: 'refreshAction',
    DOWNLOAD_ACTION: 'downloadEvent',
    ACTION_BUTTON: 'handleClickAction',
    SEARCH_INPUT: 'searchChangedEvent',
    FILTER_OPTIONS_SET_DEFAULT_SEARCH: 'set-default-search',
    FILTER_OPTIONS_RESET_DEFAULT_SEARCH: 'restore-default-search',
    FILTER_OPTIONS_CLEAR_FILTER: 'clear-filters',
    SELECTION: 'handleSelectionChange',
    COLUMN_FILTER: 'columnFilterChanged',
    CLUSTER: 'clusterChanged',
    BULLETED: 'handleListBulleted',
    SERVER_SIDE_PAGE_CHANGED: 'server-side-page-number-changed'
  },
  SELECTORS: {
    REFRESH_BUTTON: '[id*="btn-refresh--table"] button',
    DOWNLOAD_BUTTON: '[id*="btn-download--table"]',
    ACTIVE_MENU: '.v-menu__content',
    DOWNLOAD_MENU_ITEM_0: '#item--download-option-0',
    DOWNLOAD_MENU_ITEM_1: '#item--download-option-1'
  },
  EVENT_TYPES: {
    CLICK: 'click'
  }
}
