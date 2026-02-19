import useExamStatusFilter from '@/hooks/awareness-educator/useExamStatusFilter'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

describe('useExamStatusFilter', () => {
  const { data, computed, watch } = useExamStatusFilter

  it('provides initial data', () => {
    const result = data()

    expect(result.selectedExamStatusFilter).toBe('FirstAttempt')
    expect(result.isExamStatusFilterMenuActive).toBe(false)
    expect(result.examStatusFilters).toHaveLength(3)
  })

  it('canRenderExamStatusFilter returns true only for training type', () => {
    expect(
      computed.canRenderExamStatusFilter.call({
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }
      })
    ).toBe(true)
    expect(
      computed.canRenderExamStatusFilter.call({
        trainingSummary: { trainingTypeName: 'OTHER' }
      })
    ).toBe(false)
  })

  it('selectedExamStatusFilter watcher updates column label and payload', () => {
    const callForData = jest.fn()
    const ctx = {
      trainingSummary: null,
      canRenderExamStatusFilter: true,
      examStatusFilters: [{ text: 'First Attempt', value: 'FirstAttempt' }],
      tableOptions: {
        columns: [{ property: 'examStatus', label: 'Exam Status' }]
      },
      axiosPayload: {},
      callForData
    }

    watch.selectedExamStatusFilter.handler.call(ctx, 'FirstAttempt')

    expect(ctx.tableOptions.columns[0].label).toBe('Exam Status (First Attempt)')
    expect(ctx.axiosPayload.showByExamStatus).toBe('FirstAttempt')
    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('selectedExamStatusFilter watcher exits early when filter cannot render', () => {
    const callForData = jest.fn()
    const ctx = {
      trainingSummary: { trainingTypeName: 'OTHER' },
      canRenderExamStatusFilter: false,
      examStatusFilters: [{ text: 'First Attempt', value: 'FirstAttempt' }],
      tableOptions: { columns: [{ property: 'examStatus', label: 'Exam Status' }] },
      axiosPayload: {},
      callForData
    }

    watch.selectedExamStatusFilter.handler.call(ctx, 'FirstAttempt')

    expect(ctx.axiosPayload.showByExamStatus).toBeUndefined()
    expect(callForData).not.toHaveBeenCalled()
  })

  it('axiosPayload watcher syncs selectedExamStatusFilter from payload', () => {
    const ctx = { selectedExamStatusFilter: 'FirstAttempt' }

    watch.axiosPayload.handler.call(ctx, { showByExamStatus: 'PassedAnyAttempt' })

    expect(ctx.selectedExamStatusFilter).toBe('PassedAnyAttempt')
  })
})
