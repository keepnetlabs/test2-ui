import InvestigationDetailsLeftBarLoading from '@/components/SkeletonLoading/InvestigationDetailsLeftBarLoading.vue'

describe('InvestigationDetailsLeftBarLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = InvestigationDetailsLeftBarLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
