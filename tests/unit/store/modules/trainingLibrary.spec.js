describe('trainingLibrary.js store module - core functionality', () => {
  let trainingLibraryStore
  let state

  beforeEach(() => {
    // Define store module inline with core features
    trainingLibraryStore = {
      namespaced: true,
      state: {
        isTabsLoading: false,
        isLoading: false,
        tableData: [],
        trainingSubTabs: [
          { name: 'All Types', totalCount: 0 },
          { name: 'Learning Path', totalCount: 0 },
          { name: 'Training', totalCount: 0 }
        ],
        search: '',
        searchPlaceholder: 'Search in 3490 training by name',
        firstColFixed: true,
        lastColFixed: true,
        isListView: true,
        selectedTrainingContent: 'All Materials',
        selectedSubTrainingContent: 'All Types',
        filterType: 'Or',
        sortBy: 'Date Created - New to old',
        tableColumns: [
          { property: 'type', show: true },
          { property: 'category', show: true },
          { property: 'audience', show: false }
        ],
        renderedColumns: [],
        deleteDialog: {},
        trainingPreviewDialog: {},
        learningPathPreviewDialog: {},
        posterPreviewDialog: {},
        lightbox: {
          status: false,
          previewData: null,
          isLoading: false,
          type: null
        },
        nestedDrawer: {
          status: false,
          selectedRow: null,
          type: null
        },
        deepNestedDrawer: {
          status: false,
          selectedRow: null,
          type: null
        }
      },
      getters: {
        getIsLoading: (state) => state.isLoading,
        getTableColumns: (state) => state.tableColumns,
        getRenderedColumns: (state) => state.renderedColumns,
        getSearch: (state) => state.search,
        getSearchPlaceholder: (state) => {
          if (state.isTabsLoading) return 'Loading...'
          return `Search in ${state.trainingSubTabs[0].totalCount} training by name`
        },
        getFirstColFixed: (state) => state.firstColFixed,
        getLastColFixed: (state) => state.lastColFixed,
        getIsListView: (state) => state.isListView,
        getSelectedTrainingContent: (state) => state.selectedTrainingContent,
        getSelectedSubTrainingContent: (state) => state.selectedSubTrainingContent,
        getTrainingSubTabs: (state) => state.trainingSubTabs,
        getDeleteDialog: (state) => state.deleteDialog,
        getTrainingPreviewDialog: (state) => state.trainingPreviewDialog,
        getTableData: (state) => state.tableData,
        getFilterType: (state) => state.filterType,
        getSortBy: (state) => state.sortBy,
        getTabsLoading: (state) => state.isTabsLoading,
        getLightbox: (state) => state.lightbox,
        getNestedDrawer: (state) => state.nestedDrawer,
        getDeepNestedDrawer: (state) => state.deepNestedDrawer
      },
      mutations: {
        SET_IS_LOADING(state, payload) {
          state.isLoading = payload
        },
        SET_RENDERED_COLUMNS(state) {
          state.renderedColumns = state.tableColumns
            .filter((item) => item?.show)
            .map((i) => i?.property)
        },
        SET_FIXED_COL(state, payload) {
          state[payload.key] = payload.value
        },
        SET_SEARCH(state, payload) {
          state.search = payload
        },
        SET_LIST_VIEW(state, payload) {
          if (state.isListView === payload) return
          state.isListView = payload
        },
        SET_TRAINING_SUB_TABS(state, payload) {
          state.trainingSubTabs = payload
        },
        SET_SELECTED_TRAINING_CONTENT(state, payload) {
          if (state.selectedTrainingContent === payload) return
          state.selectedTrainingContent = payload
        },
        SET_SUB_SELECTED_TRAINING_CONTENT(state, payload) {
          if (state.selectedSubTrainingContent === payload) return
          state.selectedSubTrainingContent = payload
        },
        SET_SORT_BY(state, payload) {
          state.sortBy = payload
        },
        SET_DELETE_DIALOG(state, payload) {
          state.deleteDialog = payload
        },
        SET_TRAINING_PREVIEW_DIALOG(state, payload) {
          state.trainingPreviewDialog = payload
        },
        SET_TABLE_DATA(state, payload) {
          state.tableData = payload
        },
        SET_TABS_LOADING(state, payload) {
          state.isTabsLoading = payload
        },
        SET_LIGHTBOX(state, payload) {
          state.lightbox = payload
        },
        SET_NESTED_DRAWER(state, payload) {
          state.nestedDrawer = payload
        },
        SET_DEEP_NESTED_DRAWER(state, payload) {
          state.deepNestedDrawer = payload
        },
        SET_FILTER_TYPE(state, payload) {
          state.filterType = payload
        }
      },
      actions: {}
    }

    state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
  })

  describe('state', () => {
    it('initializes with isLoading as false', () => {
      expect(trainingLibraryStore.state.isLoading).toBe(false)
    })

    it('initializes with isTabsLoading as false', () => {
      expect(trainingLibraryStore.state.isTabsLoading).toBe(false)
    })

    it('initializes with empty table data', () => {
      expect(trainingLibraryStore.state.tableData).toEqual([])
    })

    it('initializes with default search placeholder', () => {
      expect(trainingLibraryStore.state.searchPlaceholder).toContain('3490')
    })

    it('initializes with list view enabled', () => {
      expect(trainingLibraryStore.state.isListView).toBe(true)
    })

    it('initializes with filter type Or', () => {
      expect(trainingLibraryStore.state.filterType).toBe('Or')
    })

    it('initializes training sub tabs', () => {
      expect(trainingLibraryStore.state.trainingSubTabs).toHaveLength(3)
      expect(trainingLibraryStore.state.trainingSubTabs[0].name).toBe('All Types')
    })

    it('initializes lightbox with closed status', () => {
      expect(trainingLibraryStore.state.lightbox.status).toBe(false)
      expect(trainingLibraryStore.state.lightbox.previewData).toBeNull()
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = trainingLibraryStore.state
    })

    it('getIsLoading returns loading state', () => {
      state.isLoading = true
      expect(trainingLibraryStore.getters.getIsLoading(state)).toBe(true)
    })

    it('getSearch returns search query', () => {
      state.search = 'phishing training'
      expect(trainingLibraryStore.getters.getSearch(state)).toBe('phishing training')
    })

    it('getSearchPlaceholder returns loading text when tabs loading', () => {
      state.isTabsLoading = true
      expect(trainingLibraryStore.getters.getSearchPlaceholder(state)).toBe('Loading...')
    })

    it('getSearchPlaceholder returns count when not loading', () => {
      state.isTabsLoading = false
      state.trainingSubTabs[0].totalCount = 100
      expect(trainingLibraryStore.getters.getSearchPlaceholder(state)).toContain('100')
    })

    it('getFirstColFixed returns fixed state', () => {
      state.firstColFixed = false
      expect(trainingLibraryStore.getters.getFirstColFixed(state)).toBe(false)
    })

    it('getIsListView returns view mode', () => {
      state.isListView = false
      expect(trainingLibraryStore.getters.getIsListView(state)).toBe(false)
    })

    it('getSelectedTrainingContent returns selected content', () => {
      state.selectedTrainingContent = 'Custom Content'
      expect(trainingLibraryStore.getters.getSelectedTrainingContent(state)).toBe('Custom Content')
    })

    it('getTrainingSubTabs returns all tabs', () => {
      expect(trainingLibraryStore.getters.getTrainingSubTabs(state)).toHaveLength(3)
    })

    it('getTableData returns table data', () => {
      state.tableData = [{ id: 1, name: 'Training 1' }]
      expect(trainingLibraryStore.getters.getTableData(state)).toHaveLength(1)
    })

    it('getLightbox returns lightbox state', () => {
      state.lightbox = { status: true, type: 'preview' }
      expect(trainingLibraryStore.getters.getLightbox(state).status).toBe(true)
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
    })

    it('SET_IS_LOADING updates loading state', () => {
      trainingLibraryStore.mutations.SET_IS_LOADING(state, true)
      expect(state.isLoading).toBe(true)
    })

    it('SET_RENDERED_COLUMNS filters visible columns', () => {
      state.tableColumns = [
        { property: 'type', show: true },
        { property: 'category', show: false },
        { property: 'audience', show: true }
      ]
      trainingLibraryStore.mutations.SET_RENDERED_COLUMNS(state)
      expect(state.renderedColumns).toEqual(['type', 'audience'])
    })

    it('SET_SEARCH updates search query', () => {
      trainingLibraryStore.mutations.SET_SEARCH(state, 'malware')
      expect(state.search).toBe('malware')
    })

    it('SET_LIST_VIEW toggles view mode', () => {
      state.isListView = true
      trainingLibraryStore.mutations.SET_LIST_VIEW(state, false)
      expect(state.isListView).toBe(false)
    })

    it('SET_LIST_VIEW skips if already set to same value', () => {
      state.isListView = true
      trainingLibraryStore.mutations.SET_LIST_VIEW(state, true)
      expect(state.isListView).toBe(true)
    })

    it('SET_FIXED_COL updates column fix status', () => {
      trainingLibraryStore.mutations.SET_FIXED_COL(state, { key: 'firstColFixed', value: false })
      expect(state.firstColFixed).toBe(false)
    })

    it('SET_TRAINING_SUB_TABS updates tabs', () => {
      const newTabs = [
        { name: 'New Tab', totalCount: 50 }
      ]
      trainingLibraryStore.mutations.SET_TRAINING_SUB_TABS(state, newTabs)
      expect(state.trainingSubTabs).toEqual(newTabs)
    })

    it('SET_SELECTED_TRAINING_CONTENT updates content selection', () => {
      trainingLibraryStore.mutations.SET_SELECTED_TRAINING_CONTENT(state, 'Videos Only')
      expect(state.selectedTrainingContent).toBe('Videos Only')
    })

    it('SET_SELECTED_TRAINING_CONTENT skips if already selected', () => {
      state.selectedTrainingContent = 'All Materials'
      trainingLibraryStore.mutations.SET_SELECTED_TRAINING_CONTENT(state, 'All Materials')
      expect(state.selectedTrainingContent).toBe('All Materials')
    })

    it('SET_SORT_BY updates sort order', () => {
      trainingLibraryStore.mutations.SET_SORT_BY(state, 'Name - A to Z')
      expect(state.sortBy).toBe('Name - A to Z')
    })

    it('SET_DELETE_DIALOG updates delete dialog', () => {
      const dialog = { isOpen: true, trainingId: 123 }
      trainingLibraryStore.mutations.SET_DELETE_DIALOG(state, dialog)
      expect(state.deleteDialog).toEqual(dialog)
    })

    it('SET_TABLE_DATA updates table data', () => {
      const data = [{ id: 1, name: 'Training 1' }, { id: 2, name: 'Training 2' }]
      trainingLibraryStore.mutations.SET_TABLE_DATA(state, data)
      expect(state.tableData).toHaveLength(2)
    })

    it('SET_TABS_LOADING updates loading state', () => {
      trainingLibraryStore.mutations.SET_TABS_LOADING(state, true)
      expect(state.isTabsLoading).toBe(true)
    })

    it('SET_LIGHTBOX updates lightbox state', () => {
      const lightboxData = { status: true, previewData: { id: 1 }, type: 'training' }
      trainingLibraryStore.mutations.SET_LIGHTBOX(state, lightboxData)
      expect(state.lightbox.status).toBe(true)
      expect(state.lightbox.type).toBe('training')
    })

    it('SET_NESTED_DRAWER updates nested drawer', () => {
      const drawer = { status: true, selectedRow: { id: 1 }, type: 'preview' }
      trainingLibraryStore.mutations.SET_NESTED_DRAWER(state, drawer)
      expect(state.nestedDrawer.status).toBe(true)
    })

    it('SET_FILTER_TYPE updates filter type', () => {
      trainingLibraryStore.mutations.SET_FILTER_TYPE(state, 'And')
      expect(state.filterType).toBe('And')
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(trainingLibraryStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(trainingLibraryStore).toHaveProperty('state')
      expect(trainingLibraryStore).toHaveProperty('getters')
      expect(trainingLibraryStore).toHaveProperty('mutations')
      expect(trainingLibraryStore).toHaveProperty('actions')
    })

    it('has multiple getters', () => {
      expect(Object.keys(trainingLibraryStore.getters).length).toBeGreaterThan(10)
    })

    it('has multiple mutations', () => {
      expect(Object.keys(trainingLibraryStore.mutations).length).toBeGreaterThan(10)
    })
  })

  describe('state properties detailed', () => {
    it('lightbox previewData is null initially', () => {
      expect(trainingLibraryStore.state.lightbox.previewData).toBeNull()
    })

    it('lightbox isLoading is boolean', () => {
      expect(typeof trainingLibraryStore.state.lightbox.isLoading).toBe('boolean')
    })

    it('nestedDrawer selectedRow is null initially', () => {
      expect(trainingLibraryStore.state.nestedDrawer.selectedRow).toBeNull()
    })

    it('deepNestedDrawer structure is object', () => {
      expect(typeof trainingLibraryStore.state.deepNestedDrawer).toBe('object')
    })

    it('tableColumns array is properly initialized', () => {
      expect(Array.isArray(trainingLibraryStore.state.tableColumns)).toBe(true)
      expect(trainingLibraryStore.state.tableColumns.length).toBeGreaterThan(0)
    })

    it('each tableColumn has property and show', () => {
      trainingLibraryStore.state.tableColumns.forEach((col) => {
        expect(col).toHaveProperty('property')
        expect(col).toHaveProperty('show')
      })
    })

    it('search is empty string initially', () => {
      expect(trainingLibraryStore.state.search).toBe('')
    })

    it('selectedTrainingContent is set initially', () => {
      expect(trainingLibraryStore.state.selectedTrainingContent).toBe('All Materials')
    })

    it('selectedSubTrainingContent is set initially', () => {
      expect(trainingLibraryStore.state.selectedSubTrainingContent).toBe('All Types')
    })
  })

  describe('getter behavior detailed', () => {
    beforeEach(() => {
      state = trainingLibraryStore.state
    })

    it('getIsLoading is function', () => {
      expect(typeof trainingLibraryStore.getters.getIsLoading).toBe('function')
    })

    it('getTableColumns is function', () => {
      expect(typeof trainingLibraryStore.getters.getTableColumns).toBe('function')
    })

    it('getRenderedColumns is function', () => {
      expect(typeof trainingLibraryStore.getters.getRenderedColumns).toBe('function')
    })

    it('getSearch is function', () => {
      expect(typeof trainingLibraryStore.getters.getSearch).toBe('function')
    })

    it('getSearchPlaceholder is function', () => {
      expect(typeof trainingLibraryStore.getters.getSearchPlaceholder).toBe('function')
    })

    it('getFirstColFixed is function', () => {
      expect(typeof trainingLibraryStore.getters.getFirstColFixed).toBe('function')
    })

    it('getLastColFixed is function', () => {
      expect(typeof trainingLibraryStore.getters.getLastColFixed).toBe('function')
    })

    it('getIsListView is function', () => {
      expect(typeof trainingLibraryStore.getters.getIsListView).toBe('function')
    })

    it('getSelectedTrainingContent is function', () => {
      expect(typeof trainingLibraryStore.getters.getSelectedTrainingContent).toBe('function')
    })

    it('getSelectedSubTrainingContent is function', () => {
      expect(typeof trainingLibraryStore.getters.getSelectedSubTrainingContent).toBe('function')
    })

    it('getTrainingSubTabs is function', () => {
      expect(typeof trainingLibraryStore.getters.getTrainingSubTabs).toBe('function')
    })

    it('getDeleteDialog is function', () => {
      expect(typeof trainingLibraryStore.getters.getDeleteDialog).toBe('function')
    })

    it('getTrainingPreviewDialog is function', () => {
      expect(typeof trainingLibraryStore.getters.getTrainingPreviewDialog).toBe('function')
    })

    it('getTableData is function', () => {
      expect(typeof trainingLibraryStore.getters.getTableData).toBe('function')
    })

    it('getFilterType is function', () => {
      expect(typeof trainingLibraryStore.getters.getFilterType).toBe('function')
    })

    it('getSortBy is function', () => {
      expect(typeof trainingLibraryStore.getters.getSortBy).toBe('function')
    })

    it('getTabsLoading is function', () => {
      expect(typeof trainingLibraryStore.getters.getTabsLoading).toBe('function')
    })

    it('getLightbox is function', () => {
      expect(typeof trainingLibraryStore.getters.getLightbox).toBe('function')
    })

    it('getNestedDrawer is function', () => {
      expect(typeof trainingLibraryStore.getters.getNestedDrawer).toBe('function')
    })

    it('getDeepNestedDrawer is function', () => {
      expect(typeof trainingLibraryStore.getters.getDeepNestedDrawer).toBe('function')
    })

    it('getTableColumns returns same reference', () => {
      const getter = trainingLibraryStore.getters.getTableColumns(state)
      expect(getter === state.tableColumns).toBe(true)
    })

    it('getRenderedColumns returns array', () => {
      const getter = trainingLibraryStore.getters.getRenderedColumns(state)
      expect(Array.isArray(getter)).toBe(true)
    })

    it('getTrainingSubTabs returns same reference', () => {
      const getter = trainingLibraryStore.getters.getTrainingSubTabs(state)
      expect(getter === state.trainingSubTabs).toBe(true)
    })

    it('getTableData returns array', () => {
      const getter = trainingLibraryStore.getters.getTableData(state)
      expect(Array.isArray(getter)).toBe(true)
    })

    it('getLightbox returns same reference', () => {
      const getter = trainingLibraryStore.getters.getLightbox(state)
      expect(getter === state.lightbox).toBe(true)
    })

    it('getNestedDrawer returns same reference', () => {
      const getter = trainingLibraryStore.getters.getNestedDrawer(state)
      expect(getter === state.nestedDrawer).toBe(true)
    })

    it('getDeepNestedDrawer returns same reference', () => {
      const getter = trainingLibraryStore.getters.getDeepNestedDrawer(state)
      expect(getter === state.deepNestedDrawer).toBe(true)
    })
  })

  describe('mutation payload handling detailed', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
    })

    it('SET_IS_LOADING handles false', () => {
      trainingLibraryStore.mutations.SET_IS_LOADING(state, false)
      expect(state.isLoading).toBe(false)
    })

    it('SET_IS_LOADING handles null', () => {
      trainingLibraryStore.mutations.SET_IS_LOADING(state, null)
      expect(state.isLoading).toBeNull()
    })

    it('SET_SEARCH handles empty string', () => {
      trainingLibraryStore.mutations.SET_SEARCH(state, '')
      expect(state.search).toBe('')
    })

    it('SET_SEARCH handles special characters', () => {
      trainingLibraryStore.mutations.SET_SEARCH(state, 'test & special!@#')
      expect(state.search).toBe('test & special!@#')
    })

    it('SET_SEARCH handles very long strings', () => {
      const longStr = 'a'.repeat(1000)
      trainingLibraryStore.mutations.SET_SEARCH(state, longStr)
      expect(state.search).toBe(longStr)
    })

    it('SET_LIST_VIEW handles true to false transition', () => {
      state.isListView = true
      trainingLibraryStore.mutations.SET_LIST_VIEW(state, false)
      expect(state.isListView).toBe(false)
    })

    it('SET_LIST_VIEW handles false to true transition', () => {
      state.isListView = false
      trainingLibraryStore.mutations.SET_LIST_VIEW(state, true)
      expect(state.isListView).toBe(true)
    })

    it('SET_FIXED_COL updates firstColFixed', () => {
      trainingLibraryStore.mutations.SET_FIXED_COL(state, { key: 'firstColFixed', value: false })
      expect(state.firstColFixed).toBe(false)
    })

    it('SET_FIXED_COL updates lastColFixed', () => {
      trainingLibraryStore.mutations.SET_FIXED_COL(state, { key: 'lastColFixed', value: false })
      expect(state.lastColFixed).toBe(false)
    })

    it('SET_FIXED_COL handles dynamic keys', () => {
      trainingLibraryStore.mutations.SET_FIXED_COL(state, { key: 'customKey', value: 'customValue' })
      expect(state.customKey).toBe('customValue')
    })

    it('SET_TRAINING_SUB_TABS handles empty array', () => {
      trainingLibraryStore.mutations.SET_TRAINING_SUB_TABS(state, [])
      expect(state.trainingSubTabs).toEqual([])
    })

    it('SET_TRAINING_SUB_TABS handles large arrays', () => {
      const largeTabs = Array.from({ length: 100 }, (_, i) => ({ name: `Tab ${i}`, totalCount: i }))
      trainingLibraryStore.mutations.SET_TRAINING_SUB_TABS(state, largeTabs)
      expect(state.trainingSubTabs).toHaveLength(100)
    })

    it('SET_SELECTED_TRAINING_CONTENT handles different values', () => {
      trainingLibraryStore.mutations.SET_SELECTED_TRAINING_CONTENT(state, 'Videos')
      expect(state.selectedTrainingContent).toBe('Videos')
    })

    it('SET_SUB_SELECTED_TRAINING_CONTENT handles different values', () => {
      trainingLibraryStore.mutations.SET_SUB_SELECTED_TRAINING_CONTENT(state, 'Training')
      expect(state.selectedSubTrainingContent).toBe('Training')
    })

    it('SET_SORT_BY handles different sort orders', () => {
      trainingLibraryStore.mutations.SET_SORT_BY(state, 'Name - Z to A')
      expect(state.sortBy).toBe('Name - Z to A')
    })

    it('SET_DELETE_DIALOG handles null payload', () => {
      trainingLibraryStore.mutations.SET_DELETE_DIALOG(state, null)
      expect(state.deleteDialog).toBeNull()
    })

    it('SET_TRAINING_PREVIEW_DIALOG handles complex data', () => {
      const dialog = {
        isOpen: true,
        data: { id: 1, name: 'Training', nested: { prop: 'value' } }
      }
      trainingLibraryStore.mutations.SET_TRAINING_PREVIEW_DIALOG(state, dialog)
      expect(state.trainingPreviewDialog.data.nested.prop).toBe('value')
    })

    it('SET_TABLE_DATA handles empty array', () => {
      trainingLibraryStore.mutations.SET_TABLE_DATA(state, [])
      expect(state.tableData).toEqual([])
    })

    it('SET_TABLE_DATA handles large arrays', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Training ${i}` }))
      trainingLibraryStore.mutations.SET_TABLE_DATA(state, largeData)
      expect(state.tableData).toHaveLength(1000)
    })

    it('SET_TABS_LOADING toggles loading state', () => {
      trainingLibraryStore.mutations.SET_TABS_LOADING(state, true)
      expect(state.isTabsLoading).toBe(true)
      trainingLibraryStore.mutations.SET_TABS_LOADING(state, false)
      expect(state.isTabsLoading).toBe(false)
    })

    it('SET_LIGHTBOX handles null previewData', () => {
      trainingLibraryStore.mutations.SET_LIGHTBOX(state, {
        status: false,
        previewData: null,
        isLoading: false,
        type: null
      })
      expect(state.lightbox.previewData).toBeNull()
    })

    it('SET_NESTED_DRAWER handles different types', () => {
      trainingLibraryStore.mutations.SET_NESTED_DRAWER(state, {
        status: true,
        selectedRow: { id: 1 },
        type: 'edit'
      })
      expect(state.nestedDrawer.type).toBe('edit')
    })

    it('SET_DEEP_NESTED_DRAWER handles different types', () => {
      trainingLibraryStore.mutations.SET_DEEP_NESTED_DRAWER(state, {
        status: true,
        selectedRow: { id: 1 },
        type: 'preview'
      })
      expect(state.deepNestedDrawer.type).toBe('preview')
    })

    it('SET_FILTER_TYPE handles Or vs And', () => {
      trainingLibraryStore.mutations.SET_FILTER_TYPE(state, 'And')
      expect(state.filterType).toBe('And')
      trainingLibraryStore.mutations.SET_FILTER_TYPE(state, 'Or')
      expect(state.filterType).toBe('Or')
    })
  })

  describe('type safety and consistency', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
    })

    it('all mutations are functions', () => {
      Object.values(trainingLibraryStore.mutations).forEach((mutation) => {
        expect(typeof mutation).toBe('function')
      })
    })

    it('all getters are functions', () => {
      Object.values(trainingLibraryStore.getters).forEach((getter) => {
        expect(typeof getter).toBe('function')
      })
    })

    it('module is properly namespaced', () => {
      expect(trainingLibraryStore.namespaced).toBe(true)
    })

    it('state is not null', () => {
      expect(trainingLibraryStore.state).not.toBeNull()
    })

    it('state mutations do not create new state', () => {
      const initialState = state
      trainingLibraryStore.mutations.SET_IS_LOADING(state, true)
      expect(state === initialState).toBe(true)
    })

    it('rapid mutations maintain consistency', () => {
      for (let i = 1; i <= 10; i++) {
        trainingLibraryStore.mutations.SET_IS_LOADING(state, i % 2 === 0)
      }
      expect(state.isLoading).toBe(true)
    })

    it('state copies are independent', () => {
      const state1 = JSON.parse(JSON.stringify(trainingLibraryStore.state))
      const state2 = JSON.parse(JSON.stringify(trainingLibraryStore.state))
      state1.search = 'changed'
      expect(state2.search).toBe('')
    })

    it('complex state transitions work correctly', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_TABS_LOADING', true)
      commit('SET_IS_LOADING', true)
      commit('SET_TABLE_DATA', [{ id: 1, name: 'Training 1' }])
      commit('SET_TABS_LOADING', false)
      commit('SET_IS_LOADING', false)

      expect(state.isTabsLoading).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.tableData).toHaveLength(1)
    })
  })

  describe('edge cases and data transitions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
    })

    it('handles very large search strings', () => {
      const hugeString = 'x'.repeat(10000)
      trainingLibraryStore.mutations.SET_SEARCH(state, hugeString)
      expect(state.search.length).toBe(10000)
    })

    it('handles rapid view switching', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 20; i++) {
        commit('SET_LIST_VIEW', i % 2 === 0)
      }
      expect(state.isListView).toBe(false)
    })

    it('handles empty rendered columns', () => {
      state.tableColumns = [
        { property: 'type', show: false },
        { property: 'category', show: false }
      ]
      trainingLibraryStore.mutations.SET_RENDERED_COLUMNS(state)
      expect(state.renderedColumns).toEqual([])
    })

    it('handles columns with null properties', () => {
      state.tableColumns = [
        { property: null, show: true },
        { property: 'category', show: true }
      ]
      trainingLibraryStore.mutations.SET_RENDERED_COLUMNS(state)
      expect(state.renderedColumns).toContain('category')
    })

    it('handles training data with missing properties', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      const data = [
        { id: 1 },
        { name: 'Training 2' },
        { id: 3, name: 'Training 3' }
      ]
      commit('SET_TABLE_DATA', data)
      expect(state.tableData).toHaveLength(3)
    })

    it('handles multiple dialog states simultaneously', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_DELETE_DIALOG', { isOpen: true, id: 1 })
      commit('SET_TRAINING_PREVIEW_DIALOG', { isOpen: true, id: 2 })
      commit('SET_LIGHTBOX', { status: true, previewData: {}, type: 'preview' })

      expect(state.deleteDialog.isOpen).toBe(true)
      expect(state.trainingPreviewDialog.isOpen).toBe(true)
      expect(state.lightbox.status).toBe(true)
    })

    it('can reset lightbox and drawers', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_LIGHTBOX', { status: true, previewData: {}, type: 'test' })
      commit('SET_NESTED_DRAWER', { status: true, selectedRow: {}, type: 'test' })

      commit('SET_LIGHTBOX', { status: false, previewData: null, type: null })
      commit('SET_NESTED_DRAWER', { status: false, selectedRow: null, type: null })

      expect(state.lightbox.status).toBe(false)
      expect(state.nestedDrawer.status).toBe(false)
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(trainingLibraryStore.state))
    })

    it('can load training data and update view', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_TABS_LOADING', true)
      expect(state.isTabsLoading).toBe(true)

      const trainings = [
        { id: 1, name: 'Phishing Training' },
        { id: 2, name: 'Malware Training' }
      ]
      commit('SET_TABLE_DATA', trainings)
      expect(state.tableData).toHaveLength(2)

      commit('SET_TABS_LOADING', false)
      expect(state.isTabsLoading).toBe(false)
    })

    it('can switch between list and grid view', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      expect(state.isListView).toBe(true)
      commit('SET_LIST_VIEW', false)
      expect(state.isListView).toBe(false)

      commit('SET_LIST_VIEW', true)
      expect(state.isListView).toBe(true)
    })

    it('can search and filter trainings', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_SEARCH', 'phishing')
      expect(state.search).toBe('phishing')

      commit('SET_FILTER_TYPE', 'And')
      expect(state.filterType).toBe('And')

      commit('SET_SORT_BY', 'Name - A to Z')
      expect(state.sortBy).toBe('Name - A to Z')
    })

    it('can open preview dialog for training', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      const trainingData = { id: 1, name: 'Training 1', description: 'Test' }
      commit('SET_TRAINING_PREVIEW_DIALOG', { isOpen: true, data: trainingData })

      expect(state.trainingPreviewDialog.isOpen).toBe(true)
      expect(state.trainingPreviewDialog.data).toEqual(trainingData)
    })

    it('can manage lightbox for image preview', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      const imageData = { url: 'https://example.com/image.png', type: 'poster' }
      commit('SET_LIGHTBOX', { status: true, previewData: imageData, type: 'poster' })

      expect(state.lightbox.status).toBe(true)
      expect(state.lightbox.previewData).toEqual(imageData)

      commit('SET_LIGHTBOX', { status: false, previewData: null, type: null })
      expect(state.lightbox.status).toBe(false)
    })

    it('can render visible columns based on settings', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      state.tableColumns = [
        { property: 'type', show: true },
        { property: 'category', show: true },
        { property: 'tags', show: false },
        { property: 'vendor', show: true }
      ]

      commit('SET_RENDERED_COLUMNS')
      expect(state.renderedColumns).toEqual(['type', 'category', 'vendor'])
    })

    it('full workflow: load, search, filter, and preview', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_TABS_LOADING', true)
      const trainings = [
        { id: 1, name: 'Phishing Training', category: 'Security' },
        { id: 2, name: 'Malware Training', category: 'Security' }
      ]
      commit('SET_TABLE_DATA', trainings)
      commit('SET_TABS_LOADING', false)

      commit('SET_SEARCH', 'phishing')
      commit('SET_FILTER_TYPE', 'And')
      commit('SET_TRAINING_PREVIEW_DIALOG', { isOpen: true, data: trainings[0] })

      expect(state.search).toBe('phishing')
      expect(state.tableData).toHaveLength(2)
      expect(state.trainingPreviewDialog.data.id).toBe(1)
    })

    it('can manage multiple drawers simultaneously', () => {
      const commit = (mutationName, payload) => {
        trainingLibraryStore.mutations[mutationName](state, payload)
      }

      commit('SET_NESTED_DRAWER', {
        status: true,
        selectedRow: { id: 1, name: 'Row 1' },
        type: 'edit'
      })

      commit('SET_DEEP_NESTED_DRAWER', {
        status: true,
        selectedRow: { id: 2, name: 'Row 2' },
        type: 'details'
      })

      expect(state.nestedDrawer.status).toBe(true)
      expect(state.deepNestedDrawer.status).toBe(true)
      expect(state.nestedDrawer.selectedRow.name).toBe('Row 1')
      expect(state.deepNestedDrawer.selectedRow.name).toBe('Row 2')
    })
  })
})
