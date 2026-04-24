import TrainingLibraryTrainingTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryTrainingTable.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibraryTrainingTable.vue', () => {
  it('handleAddTraining opens training modal', () => {
    const setNewTrainingModal = jest.fn()
    TrainingLibraryTrainingTable.methods.handleAddTraining.call({ setNewTrainingModal })
    expect(setNewTrainingModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      isDuplicate: false,
      selectedRow: null
    })
  })

  it('non-learning-path tables keep the legacy duration column property', () => {
    const columns = TrainingLibraryTrainingTable.data().tableOptions.columns
    const durationColumn = columns.find(
      (col) => col.property === PROPERTY_STORE.DURATION
    )
    const totalDurationColumn = columns.find(
      (col) => col.property === PROPERTY_STORE.TOTAL_DURATION
    )
    expect(durationColumn).toBeDefined()
    expect(totalDurationColumn).toBeUndefined()
  })
})
