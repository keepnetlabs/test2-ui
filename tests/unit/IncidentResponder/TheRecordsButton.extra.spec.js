import TheRecordsButton from '@/components/IncidentResponder/TheRecordsButton.vue'

describe('TheRecordsButton.vue (extra branch coverage)', () => {
  const { computed, data } = TheRecordsButton

  it('getText prefers singleLabel, zeroLabel, and pluralLabel when provided', () => {
    expect(
      computed.getText.call({
        row: { total: 1 },
        label: 'record',
        singleLabel: 'View Report',
        zeroLabel: '',
        pluralLabel: ''
      })
    ).toBe('View Report')

    expect(
      computed.getText.call({
        row: { total: 0 },
        label: 'record',
        singleLabel: '',
        zeroLabel: 'No Records',
        pluralLabel: ''
      })
    ).toBe('No Records')

    expect(
      computed.getText.call({
        row: { total: 3 },
        label: 'record',
        singleLabel: '',
        zeroLabel: '',
        pluralLabel: 'entries'
      })
    ).toBe('3 entries')
  })

  it('getIcon switches to report icon only for single selected record actions', () => {
    expect(computed.getIcon.call({ singleLabel: 'View Report', row: { total: 1 } })).toBe(
      'mdi-text-box'
    )
    expect(computed.getIcon.call({ singleLabel: 'View Report', row: { total: 2 } })).toBe(
      'mdi-open-in-new'
    )
    expect(computed.getIcon.call({ singleLabel: '', row: { total: 1 } })).toBe('mdi-open-in-new')
  })

  it('isRenderButton returns false when zero-total button is hidden and row is missing', () => {
    expect(
      computed.isRenderButton.call({
        isShowButtonWithZeroTotal: false,
        row: undefined
      })
    ).toBe(false)
  })

  it('data initializes disabled state and base style/color are stable', () => {
    expect(data.call({ row: { total: 1 }, disabledCount: 1 }).isDisabled).toBe(true)
    expect(data.call({ row: { total: 5 }, disabledCount: 1 }).isDisabled).toBe(false)
    expect(computed.getColor.call({})).toBe('#e3f2fd')
    expect(computed.getStyle.call({ width: '160px' })).toEqual({
      boxShadow: 'none !important',
      width: '160px'
    })
  })
})
