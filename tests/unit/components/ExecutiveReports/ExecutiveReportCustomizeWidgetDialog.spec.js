import ExecutiveReportCustomizeWidgetDialog from '@/components/ExecutiveReports/ExecutiveReportCustomizeWidgetDialog.vue'

describe('ExecutiveReportCustomizeWidgetDialog.vue', () => {
  describe('methods', () => {
    it('callForData populates formData from selectedRow', () => {
      const ctx = {
        formData: {},
        selectedRow: {
          title: 'Test Title',
          chartType: 'bar',
          startDate: '2025-01-01',
          endDate: '2025-12-31'
        }
      }
      ExecutiveReportCustomizeWidgetDialog.methods.callForData.call(ctx)
      expect(ctx.formData.title).toBe('Test Title')
      expect(ctx.formData.chartType).toBe('bar')
      expect(ctx.formData.startDate).toBe('2025-01-01')
      expect(ctx.formData.endDate).toBe('2025-12-31')
    })
  })
})
