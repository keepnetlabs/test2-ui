import { shallowMount } from '@vue/test-utils'
import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

const stubs = {
  TrainingLibraryAllTypesTable: {
    name: 'TrainingLibraryAllTypesTable',
    template: '<div class="all-types-table"></div>'
  },
  TrainingLibraryLearningPathTable: {
    name: 'TrainingLibraryLearningPathTable',
    template: '<div class="learning-path-table"></div>'
  },
  TrainingLibraryTrainingTable: {
    name: 'TrainingLibraryTrainingTable',
    template: '<div class="training-table"></div>'
  },
  TrainingLibraryPosterTable: {
    name: 'TrainingLibraryPosterTable',
    template: '<div class="poster-table"></div>'
  },
  TrainingLibraryInfographicTable: {
    name: 'TrainingLibraryInfographicTable',
    template: '<div class="infographic-table"></div>'
  },
  TrainingLibraryScreensaverTable: {
    name: 'TrainingLibraryScreensaverTable',
    template: '<div class="screensaver-table"></div>'
  },
  TrainingLibrarySurveyTable: {
    name: 'TrainingLibrarySurveyTable',
    template: '<div class="survey-table"></div>'
  }
}

const createWrapper = (selectedTab) =>
  shallowMount(TrainingLibraryListViewCard, {
    mocks: {
      $store: {
        getters: {
          'trainingLibrary/getSelectedSubTrainingContent': selectedTab
        }
      }
    },
    stubs
  })

describe('TrainingLibraryListViewCard.vue (extra)', () => {
  it.each([
    [TRAINING_LIBRARY_TYPES.ALL_TYPES, '.all-types-table'],
    [TRAINING_LIBRARY_TYPES.LEARNING_PATH, '.learning-path-table'],
    [TRAINING_LIBRARY_TYPES.TRAINING, '.training-table'],
    [TRAINING_LIBRARY_TYPES.POSTER, '.poster-table'],
    [TRAINING_LIBRARY_TYPES.INFOGRAPHIC, '.infographic-table'],
    [TRAINING_LIBRARY_TYPES.SCREENSAVER, '.screensaver-table'],
    [TRAINING_LIBRARY_TYPES.SURVEY, '.survey-table']
  ])('renders the correct table for %s', (selectedTab, selector) => {
    const wrapper = createWrapper(selectedTab)

    expect(wrapper.find(selector).exists()).toBe(true)
  })
})
