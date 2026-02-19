import {
  getStatusBadgeProps,
  UNUSUAL_TYPES,
  REPORT_TABS,
  ACTIVITY_TYPES
} from '@/components/CallbackReport/Opened/utils'

describe('CallbackReport Opened utils', () => {
  it('maps status badge props', () => {
    expect(getStatusBadgeProps('Not Delivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered'
    })
    expect(getStatusBadgeProps('In Queue')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
    expect(getStatusBadgeProps('Processing')).toEqual({
      color: '#1173C1',
      text: 'Processing'
    })
  })

  it('exports report tabs and enums', () => {
    expect(UNUSUAL_TYPES.UNUSUAL_IP).toBe(1)
    expect(REPORT_TABS.CALLBACK).toBe('Callback')
    expect(ACTIVITY_TYPES.SYSTEM).toBe('Bot Activity')
  })
})
