import TrainingLibraryTrainingTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryTrainingTable.vue'

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
})
