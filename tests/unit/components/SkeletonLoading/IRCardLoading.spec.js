import IRCardLoading from '@/components/SkeletonLoading/IRCardLoading.vue'

describe('IRCardLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = IRCardLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
