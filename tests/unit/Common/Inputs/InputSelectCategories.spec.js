import InputSelectCategories from '@/components/Common/Inputs/InputSelectCategories.vue'

describe('InputSelectCategories.vue', () => {
  it('selectableItems filters out categories without a valid id', () => {
    const result = InputSelectCategories.computed.selectableItems.call({
      itemValue: 'id',
      items: [
        { id: 1, text: 'Remote Working Security' },
        { id: '', text: 'Invalid Category' },
        { categoryId: 2, text: 'Travel Security' },
        { id: null, text: 'Also Invalid' }
      ]
    })

    expect(result).toEqual([{ id: 1, text: 'Remote Working Security' }])
  })
})
