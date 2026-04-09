jest.mock('@/api/awarenessEducator', () => ({
  getTrainingTypeCount: jest.fn(() => Promise.resolve({ data: {} })),
  searchTraining: jest.fn(() => Promise.resolve({ data: {} }))
}))

import TrainingLibraryCardView from '@/components/TrainingLibrary/TrainingLibraryCardView/TrainingLibraryCardView.vue'
import labels from '@/model/constants/labels'
import { addTrainingItems } from '@/components/TrainingLibrary/utils'
import {
  TRAINING_LIBRARY_MAIN_TABS,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryCardView.vue (extra)', () => {
  it('isFilterActive reacts to active filters and search text', () => {
    expect(
      TrainingLibraryCardView.computed.isFilterActive.call({
        getFilters: [{ isFilterActive: false }, { isFilterActive: true }],
        search: ''
      })
    ).toBe(true)
    expect(
      TrainingLibraryCardView.computed.isFilterActive.call({
        getFilters: [{ isFilterActive: false }],
        search: 'query'
      })
    ).toBe('query')
    expect(
      TrainingLibraryCardView.computed.isFilterActive.call({
        getFilters: [{ isFilterActive: false }],
        search: ''
      })
    ).toBe('')
  })

  it('empty text and subtitle change for filters, favourites, and selected sub tabs', () => {
    expect(
      TrainingLibraryCardView.computed.getEmptyTableText.call({
        isFilterActive: true
      })
    ).toBe('Sorry, that search and filter criteria has no results.')

    expect(
      TrainingLibraryCardView.computed.getEmptyTableText.call({
        isFilterActive: false,
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
      })
    ).toBe(labels.EmptyTrainingFavorites)

    expect(
      TrainingLibraryCardView.computed.getEmptyTableText.call({
        isFilterActive: false,
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS,
        getEmptyTableTextBySelectedSubTab: labels.EmptyScreensaver
      })
    ).toBe(labels.EmptyScreensaver)

    expect(
      TrainingLibraryCardView.computed.getEmptyTableSubtitleText.call({
        isFilterActive: true
      })
    ).toBe('Please try adjusting your search or filter')
    expect(
      TrainingLibraryCardView.computed.getEmptyTableSubtitleText.call({
        isFilterActive: false,
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
      })
    ).toBe('')
  })

  it('sub-tab empty text/button helpers cover all-types, infographic, survey, and fallback branches', () => {
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.ALL_TYPES
      })
    ).toBe(labels.EmptyTrainingMaterial)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.INFOGRAPHIC
      })
    ).toBe(labels.EmptyInfographic)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.SURVEY
      })
    ).toBe(labels.EmptySurvey)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableTextBySelectedSubTab.call({
        selectedSubTrainingContent: 'Unknown'
      })
    ).toBe(labels.EmptyLearningPath)

    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.ALL_TYPES
      })
    ).toBe(labels.CreateNewMaterial)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.INFOGRAPHIC
      })
    ).toBe(labels.CreateNewInfographic)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnTextBySelectedSubTab.call({
        selectedSubTrainingContent: TRAINING_LIBRARY_TYPES.SURVEY
      })
    ).toBe(labels.CreateNewSurvey)
    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnTextBySelectedSubTab.call({
        selectedSubTrainingContent: 'Unknown'
      })
    ).toBe(labels.CreateNewLearningPath)
  })

  it('getEmptyTableBtnText hides CTA for favourites and uses sub-tab CTA otherwise', () => {
    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.FAVOURITES
      })
    ).toBe('')
    expect(
      TrainingLibraryCardView.computed.getEmptyTableBtnText.call({
        selectedTrainingContent: TRAINING_LIBRARY_MAIN_TABS.ALL_MATERIALS,
        getEmptyTableBtnTextBySelectedSubTab: labels.CreateNewPoster
      })
    ).toBe(labels.CreateNewPoster)
  })

  it('isRootUser and getFilteredTrainingItems hide survey for non-root users only', () => {
    expect(
      TrainingLibraryCardView.computed.isRootUser.call({
        $store: { getters: { 'auth/userGetter': { role: { name: 'Root' } } } }
      })
    ).toBe(true)
    expect(
      TrainingLibraryCardView.computed.isRootUser.call({
        $store: { getters: { 'auth/userGetter': { role: { name: 'User' } } } }
      })
    ).toBe(false)

    expect(
      TrainingLibraryCardView.computed.getFilteredTrainingItems.call({
        isRootUser: true,
        addTrainingItems
      })
    ).toEqual(addTrainingItems)

    expect(
      TrainingLibraryCardView.computed.getFilteredTrainingItems.call({
        isRootUser: false,
        addTrainingItems
      })
    ).toEqual(addTrainingItems.filter((item) => item.text !== 'Survey'))
  })

  it('handleServerSideSizeChange resets pagination and refetches data', () => {
    const callForTrainingLibrary = jest.fn()
    const ctx = {
      axiosPayload: { pageSize: 9, pageNumber: 3 },
      serverSideProps: { pageSize: 9, pageNumber: 3 },
      callForTrainingLibrary
    }

    TrainingLibraryCardView.methods.handleServerSideSizeChange.call(ctx, 18)

    expect(ctx.axiosPayload.pageSize).toBe(18)
    expect(ctx.serverSideProps.pageSize).toBe(18)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(callForTrainingLibrary).toHaveBeenCalled()
  })
})
