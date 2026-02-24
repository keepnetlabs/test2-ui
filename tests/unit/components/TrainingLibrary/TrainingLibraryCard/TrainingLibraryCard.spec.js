import { shallowMount } from '@vue/test-utils'
import TrainingLibraryCard from '@/components/TrainingLibrary/TrainingLibraryCard/TrainingLibraryCard.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import {
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

jest.mock('@/api/awarenessEducator', () => ({
  duplicateTraining: jest.fn(() => Promise.resolve()),
  deleteTraining: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('TrainingLibraryCard.vue', () => {
  const dispatch = jest.fn()
  const getters = {
    'trainingLibrary/getSelectedTrainingContent': 'All Materials'
  }

  const baseItem = {
    trainingId: 't1',
    trainingName: 'Test Training',
    createdBy: 'Admin',
    category: 'Security',
    type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING,
    tags: ['tag1'],
    languages: ['en'],
    coverImage: null,
    isNew: false,
    isFavourite: false,
    hasQuiz: false
  }

  const createWrapper = (propsData = {}, storeOverrides = {}) =>
    shallowMount(TrainingLibraryCard, {
      propsData: {
        item: { ...baseItem, ...propsData.item },
        ...propsData
      },
      mocks: {
        $store: {
          dispatch,
          getters: { ...getters, ...storeOverrides }
        }
      },
      stubs: {
        TrainingLibraryNewBadge: true,
        TrainingLibraryFavoriteButton: true,
        VTooltip: true,
        VMenu: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'addEventListener', { value: jest.fn(), writable: true })
    Object.defineProperty(window, 'removeEventListener', { value: jest.fn(), writable: true })
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('getBgColor returns training class for SCORM type', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getBgColor).toContain('training')
  })

  it('getBgColor returns survey class when hasQuiz', () => {
    const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
    expect(wrapper.vm.getBgColor).toContain('survey')
  })

  it('getTypeText returns Training for SCORM type', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getTypeText).toBe('Training')
  })

  it('getTypeText returns Survey when hasQuiz', () => {
    const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
    expect(wrapper.vm.getTypeText).toBe('Survey')
  })

  it('handlePreviewClick dispatches setTrainingPreviewDialog for training', () => {
    const wrapper = createWrapper()
    const row = { ...wrapper.props().item, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }

    wrapper.vm.handlePreviewClick(row)

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/setTrainingPreviewDialog', expect.objectContaining({
      status: true,
      selectedRow: row,
      showSendButton: true,
      type: TRAINING_LIBRARY_TYPES.TRAINING
    }))
  })

  it('handlePreviewClick dispatches setSurveyPreviewDialog when hasQuiz', () => {
    const wrapper = createWrapper({ item: { ...baseItem, hasQuiz: true } })
    const row = { ...baseItem, hasQuiz: true }

    wrapper.vm.handlePreviewClick(row)

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/setSurveyPreviewDialog', expect.any(Object))
  })

  it('handleFastLaunchClick dispatches setTrainingSendModal for training', () => {
    const wrapper = createWrapper()
    const row = { ...wrapper.props().item, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }

    wrapper.vm.handleFastLaunchClick(row)

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/setTrainingSendModal', {
      status: true,
      selectedRow: row
    })
  })

  it('handleFavoriteRemove calls callForTrainingLibrary when on Favourites tab', () => {
    const wrapper = createWrapper(
      {},
      { 'trainingLibrary/getSelectedTrainingContent': 'Favourites' }
    )

    wrapper.vm.handleFavoriteRemove()

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/callForTrainingLibrary')
  })

  it('handleListItemClick Edit dispatches setNewTrainingModal', () => {
    const wrapper = createWrapper()
    const item = { ...wrapper.props().item, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }

    wrapper.vm.handleListItemClick('Edit', item)

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/setNewTrainingModal', expect.objectContaining({
      status: true,
      selectedRow: item,
      isEdit: true,
      isDuplicate: false
    }))
  })

  it('handleListItemClick Duplicate calls duplicateTraining API', async () => {
    const wrapper = createWrapper()

    wrapper.vm.handleListItemClick('Duplicate', { ...wrapper.props().item, trainingId: 'tid-1' })
    await flushPromises()

    expect(AwarenessEducatorService.duplicateTraining).toHaveBeenCalledWith('tid-1')
    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/callForTrainingLibrary')
  })

  it('handleListItemClick Delete dispatches setDeleteDialog', () => {
    const wrapper = createWrapper()
    const item = { ...wrapper.props().item, type: TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING }

    wrapper.vm.handleListItemClick('Delete', item)

    expect(dispatch).toHaveBeenCalledWith('trainingLibrary/setDeleteDialog', expect.objectContaining({
      status: true,
      title: 'Delete Training Material?',
      selectedRow: item,
      type: 'training',
      apiFunc: AwarenessEducatorService.deleteTraining
    }))
  })

  it('getCardImageBackground returns empty object when no coverImage', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getCardImageBackground).toEqual({})
  })

  it('getCardImageBackground returns backgroundImage when coverImage exists', () => {
    const wrapper = createWrapper({
      item: {
        ...baseItem,
        coverImage: { imageUrl: 'https://example.com/img.png' }
      }
    })
    expect(wrapper.vm.getCardImageBackground).toEqual({
      backgroundImage: "url('https://example.com/img.png')"
    })
  })
})
