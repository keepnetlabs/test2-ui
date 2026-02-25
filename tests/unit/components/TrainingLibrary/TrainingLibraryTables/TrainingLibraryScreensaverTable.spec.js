import TrainingLibraryScreensaverTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryScreensaverTable.vue'

describe('TrainingLibraryScreensaverTable.vue', () => {
  it('handleAddScreenSaver opens create modal', () => {
    const setNewScreensaverModal = jest.fn()
    TrainingLibraryScreensaverTable.methods.handleAddScreenSaver.call({ setNewScreensaverModal })
    expect(setNewScreensaverModal).toHaveBeenCalledWith({
      status: true,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    })
  })
})
