import InvestigationDetailsTopBarLoading from '@/components/SkeletonLoading/InvestigationDetailsTopBarLoading.vue'

describe('InvestigationDetailsTopBarLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = InvestigationDetailsTopBarLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
