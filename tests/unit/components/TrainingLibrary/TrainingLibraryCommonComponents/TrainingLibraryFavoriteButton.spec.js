import { shallowMount } from '@vue/test-utils'
import TrainingLibraryFavoriteButton from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  addToFavorite: jest.fn(() => Promise.resolve()),
  removeFromFavorite: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingLibraryFavoriteButton.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingLibraryFavoriteButton, {
      propsData: {
        isDefaultFavourite: false,
        trainingId: 'training-1',
        ...propsData
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('isFavourite initializes from isDefaultFavourite', () => {
    const wrapper = createWrapper({ isDefaultFavourite: true })
    expect(wrapper.vm.isFavourite).toBe(true)
  })

  it('handleFavorite does nothing when not trainingId', () => {
    const wrapper = createWrapper({ trainingId: null })

    wrapper.vm.handleFavorite()

    expect(AwarenessEducatorService.addToFavorite).not.toHaveBeenCalled()
    expect(AwarenessEducatorService.removeFromFavorite).not.toHaveBeenCalled()
  })

  it('handleFavorite adds to favorite when not favourite', async () => {
    const wrapper = createWrapper({ isDefaultFavourite: false })

    wrapper.vm.handleFavorite()
    await flushPromises()

    expect(AwarenessEducatorService.addToFavorite).toHaveBeenCalledWith('training-1')
    expect(wrapper.vm.isFavourite).toBe(true)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('handleFavorite removes from favorite when favourite', async () => {
    const wrapper = createWrapper({ isDefaultFavourite: true })

    wrapper.vm.handleFavorite()
    await flushPromises()

    expect(AwarenessEducatorService.removeFromFavorite).toHaveBeenCalledWith('training-1')
    expect(wrapper.vm.isFavourite).toBe(false)
    expect(wrapper.emitted('on-favorite-remove')).toBeTruthy()
  })
})
