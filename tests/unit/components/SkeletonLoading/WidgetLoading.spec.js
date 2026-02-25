import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'

describe('WidgetLoading.vue', () => {
  it('data returns attrs with boilerplate', () => {
    const data = WidgetLoading.data()
    expect(data.attrs).toEqual({ boilerplate: false })
  })
})
