jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    deleteTraining: jest.fn(() => Promise.resolve())
  }
}))

import { shallowMount } from '@vue/test-utils'
import DeleteTrainingDialog from '@/components/AwarenessEducator/TrainingList/DeleteTrainingDialog.vue'
import { EMITS, TRAINING_TYPES } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('DeleteTrainingDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteTrainingDialog, {
      propsData: {
        status: true,
        selectedRow: { trainingId: 't1', type: 'SCORM' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getBody returns poster text for POSTER type', () => {
    const wrapper = createWrapper({ selectedRow: { type: TRAINING_TYPES.POSTER } })
    expect(wrapper.vm.getBody).toContain('poster')
  })

  it('getBody returns training text for other types', () => {
    const wrapper = createWrapper({ selectedRow: { type: 'SCORM' } })
    expect(wrapper.vm.getBody).toContain('training content')
  })

  it('getTitle returns poster title for POSTER type', () => {
    const wrapper = createWrapper({ selectedRow: { type: TRAINING_TYPES.POSTER } })
    expect(wrapper.vm.getTitle).toBe('Delete Poster Content?')
  })

  it('getTitle returns training title for other types', () => {
    const wrapper = createWrapper({ selectedRow: { type: 'SCORM' } })
    expect(wrapper.vm.getTitle).toBe('Delete Training Content?')
  })

  it('handleClose emits ON_CLOSE', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })

  it('handleDelete calls deleteTraining and emits ON_CLOSE', async () => {
    const wrapper = createWrapper({ selectedRow: { trainingId: 't5', type: 'SCORM' } })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(AwarenessEducatorService.deleteTraining).toHaveBeenCalledWith('t5')
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })
})
