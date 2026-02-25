import TrainingLibraryFirstCardTabs from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardTabs.vue'
import { trainingTabContents } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('TrainingLibraryFirstCardTabs.vue', () => {
  it('trainingTabContents is defined', () => {
    expect(TrainingLibraryFirstCardTabs.data().trainingTabContents).toEqual(trainingTabContents)
  })
})
