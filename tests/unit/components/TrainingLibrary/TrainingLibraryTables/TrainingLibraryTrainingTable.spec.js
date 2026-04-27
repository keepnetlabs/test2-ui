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

  it('uses the totalDuration column property like learning path', () => {
    const columns = TrainingLibraryTrainingTable.data().tableOptions.columns
    const totalDurationColumn = columns.find(
      (col) => col.property === PROPERTY_STORE.TOTAL_DURATION
    )
    const legacyDurationColumn = columns.find(
      (col) => col.property === PROPERTY_STORE.DURATION
    )
    expect(totalDurationColumn).toBeDefined()
    expect(legacyDurationColumn).toBeUndefined()
  })
})
