import MainListItemLoading from '@/components/SkeletonLoading/MainListItemLoading.vue'

describe('MainListItemLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = MainListItemLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
