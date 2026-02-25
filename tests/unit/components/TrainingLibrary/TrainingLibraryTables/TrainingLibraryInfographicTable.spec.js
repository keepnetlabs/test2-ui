import TrainingLibraryInfographicTable from '@/components/TrainingLibrary/TrainingLibraryTables/TrainingLibraryInfographicTable.vue'

describe('TrainingLibraryInfographicTable.vue', () => {
  it('handleAddInfoGraphic opens create modal', () => {
    const setNewInfographicModal = jest.fn()
    TrainingLibraryInfographicTable.methods.handleAddInfoGraphic.call({ setNewInfographicModal })
    expect(setNewInfographicModal).toHaveBeenCalledWith({
      status: true,
      isEdit: false,
      selectedRow: null,
      isDuplicate: false
    })
  })

  it('serverSideSizeChanged updates pagination and fetches data', () => {
    const callForData = jest.fn()
    const ctx = { axiosPayload: { pageSize: 5, pageNumber: 2 }, serverSideProps: {}, callForData }
    TrainingLibraryInfographicTable.methods.serverSideSizeChanged.call(ctx, 10)
    expect(ctx.axiosPayload.pageSize).toBe(10)
    expect(ctx.axiosPayload.pageNumber).toBe(1)
    expect(callForData).toHaveBeenCalled()
  })
})
