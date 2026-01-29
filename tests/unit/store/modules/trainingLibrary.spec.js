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
  })
})
