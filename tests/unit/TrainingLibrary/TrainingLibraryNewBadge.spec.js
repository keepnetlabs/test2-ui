import { shallowMount } from '@vue/test-utils'
import TrainingLibraryNewBadge from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryNewBadge'

describe('TrainingLibraryNewBadge.vue', () => {
  it('renders new badge text', () => {
    const wrapper = shallowMount(TrainingLibraryNewBadge)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('training-library-new-badge')
    expect(wrapper.text().trim()).toBe('New')
  })
})

