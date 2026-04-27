import TrainingLibraryScreensaverTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryScreensaverTable.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

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

  it('uses the totalDuration column property like learning path', () => {
    const columns = TrainingLibraryScreensaverTable.data().tableOptions.columns
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.TOTAL_DURATION)
    ).toBeDefined()
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.DURATION)
    ).toBeUndefined()
  })
})
