import TrainingLibraryListViewCard from '@/components/TrainingLibrary/TrainingLibraryListViewCard/TrainingLibraryListViewCard.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryListViewCard.vue', () => {
  it('exposes TRAINING_LIBRARY_TYPES constant', () => {
    expect(TrainingLibraryListViewCard.computed.TRAINING_LIBRARY_TYPES()).toBe(TRAINING_LIBRARY_TYPES)
  })
})
