jest.mock('@/hooks/useAddTrainingLibraryContent', () => ({
  methods: {
    handleAddTrainingLibraryContent: jest.fn()
  }
}))

import TrainingLibraryFirstCardNewButton from '@/components/TrainingLibrary/TrainingLibraryFirstCard/TrainingLibraryFirstCardNewButton.vue'
import { addTrainingItems } from '@/components/TrainingLibrary/utils'

describe('TrainingLibraryFirstCardNewButton.vue', () => {
  it('getFilteredTrainingItems returns all items for Root user', () => {
    const ctx = {
      addTrainingItems,
      isRootUser: true
    }
    const result = TrainingLibraryFirstCardNewButton.computed.getFilteredTrainingItems.call(ctx)
    expect(result).toEqual(addTrainingItems)
  })

  it('getFilteredTrainingItems filters Survey for non-Root user', () => {
    const ctx = {
      addTrainingItems,
      isRootUser: false
    }
    const result = TrainingLibraryFirstCardNewButton.computed.getFilteredTrainingItems.call(ctx)
    expect(result.find((i) => i.text === 'Survey')).toBeUndefined()
  })
})
