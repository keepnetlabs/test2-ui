import { shallowMount } from '@vue/test-utils'
import TrainingLibraryFavoriteButton from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryFavoriteButton.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  addToFavorite: jest.fn(() => Promise.resolve()),
  removeFromFavorite: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingLibraryFavoriteButton.vue (branch coverage)', () => {
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
    AwarenessEducatorService.addToFavorite.mockResolvedValue()
    AwarenessEducatorService.removeFromFavorite.mockResolvedValue()
  })

  it('handleFavorite does nothing when trainingId is empty string', () => {
    const wrapper = createWrapper({ trainingId: '' })
    wrapper.vm.handleFavorite()
    expect(AwarenessEducatorService.addToFavorite).not.toHaveBeenCalled()
    expect(AwarenessEducatorService.removeFromFavorite).not.toHaveBeenCalled()
  })

  it('isLoading is true during API call', () => {
    AwarenessEducatorService.addToFavorite.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    const wrapper = createWrapper({ isDefaultFavourite: false })
    wrapper.vm.handleFavorite()
    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('addToFavorite branch toggles isFavourite and resets loading', async () => {
    const wrapper = createWrapper({ isDefaultFavourite: false, trainingId: 'training-1' })
    wrapper.vm.handleFavorite()
    await flushPromises()

    expect(AwarenessEducatorService.addToFavorite).toHaveBeenCalledWith('training-1')
    expect(wrapper.vm.isFavourite).toBe(true)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('removeFromFavorite branch emits event, toggles flag and resets loading', async () => {
    const wrapper = createWrapper({ isDefaultFavourite: true, trainingId: 'training-1' })
    wrapper.vm.handleFavorite()
    await flushPromises()

    expect(AwarenessEducatorService.removeFromFavorite).toHaveBeenCalledWith('training-1')
    expect(wrapper.vm.isFavourite).toBe(false)
    expect(wrapper.emitted('on-favorite-remove')).toBeTruthy()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('addToFavorite non-success path still resets loading in finally', async () => {
    const failedThenable = {
      then() {
        return this
      },
      finally(cb) {
        cb()
        return this
      }
    }
    AwarenessEducatorService.addToFavorite.mockReturnValueOnce(failedThenable)
    const wrapper = createWrapper({ isDefaultFavourite: false, trainingId: 'training-1' })
    wrapper.vm.handleFavorite()

    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.isFavourite).toBe(false)
  })
})
