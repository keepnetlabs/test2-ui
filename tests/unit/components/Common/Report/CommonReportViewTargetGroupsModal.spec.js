import CommonReportViewTargetGroupsModal from '@/components/Common/Report/CommonReportViewTargetGroupsModal.vue'

describe('CommonReportViewTargetGroupsModal.vue', () => {
  it('has correct component name', () => {
    expect(CommonReportViewTargetGroupsModal.name).toBe('CommonReportViewTargetGroupsModal')
  })

  it('getTargetGroups filters by search text case-insensitively', () => {
    const ctx = {
      search: 'sales',
      targetGroups: [{ name: 'Sales Team' }, { name: 'IT Team' }]
    }
    expect(CommonReportViewTargetGroupsModal.computed.getTargetGroups.call(ctx)).toEqual([
      { name: 'Sales Team' }
    ])
  })

  it('getTargetGroups returns all groups when search is empty', () => {
    const groups = [{ name: 'A' }, { name: 'B' }]
    expect(
      CommonReportViewTargetGroupsModal.computed.getTargetGroups.call({
        search: '',
        targetGroups: groups
      })
    ).toBe(groups)
  })

  it('closeModal emits on-close', () => {
    const $emit = jest.fn()
    CommonReportViewTargetGroupsModal.methods.closeModal.call({ $emit })
    expect($emit).toHaveBeenCalledWith('on-close')
  })
})
