import PhishingReporterTopBar from '@/components/SkeletonLoading/PhishingReporterTopBar.vue'

describe('PhishingReporterTopBar.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = PhishingReporterTopBar.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
