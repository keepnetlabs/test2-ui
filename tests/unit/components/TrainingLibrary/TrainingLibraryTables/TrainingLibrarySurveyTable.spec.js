import TrainingLibrarySurveyTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibrarySurveyTable.vue'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

describe('TrainingLibrarySurveyTable.vue', () => {
  it('keeps the legacy duration property and never adopts totalDuration', () => {
    const columns = TrainingLibrarySurveyTable.data().tableOptions.columns
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.DURATION)
    ).toBeDefined()
    expect(
      columns.find((col) => col.property === PROPERTY_STORE.TOTAL_DURATION)
    ).toBeUndefined()
  })

  it('isRootUser returns true only for Root role', () => {
    expect(
      TrainingLibrarySurveyTable.computed.isRootUser.call({
        $store: { getters: { 'auth/userGetter': { role: { name: 'Root' } } } }
      })
    ).toBe(true)

    expect(
      TrainingLibrarySurveyTable.computed.isRootUser.call({
        $store: { getters: { 'auth/userGetter': { role: { name: 'User' } } } }
      })
    ).toBe(false)
  })

  it('handleAddTraining opens survey modal', () => {
    const setNewSurveyModal = jest.fn()
    TrainingLibrarySurveyTable.methods.handleAddTraining.call({ setNewSurveyModal })
    expect(setNewSurveyModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      isDuplicate: false,
      selectedRow: null
    })
  })
})
