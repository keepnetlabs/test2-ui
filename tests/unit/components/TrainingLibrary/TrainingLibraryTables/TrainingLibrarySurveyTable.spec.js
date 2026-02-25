import TrainingLibrarySurveyTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibrarySurveyTable.vue'

describe('TrainingLibrarySurveyTable.vue', () => {
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
