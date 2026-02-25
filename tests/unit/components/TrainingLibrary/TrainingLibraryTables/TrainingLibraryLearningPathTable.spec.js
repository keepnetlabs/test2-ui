import TrainingLibraryLearningPathTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryLearningPathTable.vue'

describe('TrainingLibraryLearningPathTable.vue', () => {
  it('handleAddLearningPath opens create modal', () => {
    const setNewLearningPathModal = jest.fn()
    TrainingLibraryLearningPathTable.methods.handleAddLearningPath.call({ setNewLearningPathModal })
    expect(setNewLearningPathModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      isDuplicate: false,
      selectedRow: null
    })
  })
})
