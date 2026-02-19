import {
  getStatusBadgeProps,
  UNUSUAL_TYPES,
  ACTIVITY_TYPES
} from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerReport Opened utils', () => {
  it('maps status badge props', () => {
    expect(getStatusBadgeProps('Not Delivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered'
    })
    expect(getStatusBadgeProps('In Queue')).toEqual({
      color: '#1173C1',
      text: 'In Queue'
    })
    expect(getStatusBadgeProps('Successful')).toEqual({
      color: '#217124',
      text: 'Successful'
    })
  })

  it('exports unusual and activity type enums', () => {
    expect(UNUSUAL_TYPES).toEqual({
      USER_AGENT: 0,
      IP: 1,
      HONEYPOT: 2,
      USER_AGENT_MATCHED: 3
    })
    expect(ACTIVITY_TYPES.BOT).toBe('Bot Activity')
  })
})
