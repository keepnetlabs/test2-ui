import CommunitiesCardLoading from '@/components/SkeletonLoading/CommunitiesCardLoading.vue'

describe('CommunitiesCardLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = CommunitiesCardLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
