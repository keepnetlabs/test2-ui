jest.mock('@/api/awarenessEducator', () => ({
  searchTraining: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } } })
  ),
  exportTrainingList: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  duplicateTraining: jest.fn(() => Promise.resolve())
}))

import TrainingListTable from '@/components/AwarenessEducator/TrainingList/TrainingListTable.vue'

describe('TrainingListTable.vue', () => {
  it('handleAdd emits on-add', () => {
    const $emit = jest.fn()
    TrainingListTable.methods.handleAdd.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-add')
  })

  it('handleAddTraining routes to add poster for poster option', () => {
    const handleAdd = jest.fn()
    const handleAddPoster = jest.fn()
    const ctx = {
      addTrainingItems: [{ text: 'SCORM Training' }, { text: 'Poster' }],
      handleAdd,
      handleAddPoster
    }
    TrainingListTable.methods.handleAddTraining.call(ctx, { text: 'Poster' })
    expect(handleAddPoster).toHaveBeenCalled()
    expect(handleAdd).not.toHaveBeenCalled()
  })

  it('handleDownloadPoster emits row payload', () => {
    const $emit = jest.fn()
    const row = { trainingId: 't1' }
    TrainingListTable.methods.handleDownloadPoster.call({ $emit }, row)
    expect($emit).toHaveBeenCalledWith('on-download-poster', row)
  })
})
