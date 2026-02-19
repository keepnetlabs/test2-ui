import { COLUMNS, getStatusBadgeProps } from '@/components/CampaignReports/utils'

describe('CampaignReports utils', () => {
  it('exports campaign report columns', () => {
    expect(COLUMNS).toHaveProperty('CAMPAIGN_NAME')
    expect(COLUMNS).toHaveProperty('METHOD')
    expect(COLUMNS).toHaveProperty('STATUS')
    expect(COLUMNS.METHOD.filterableItems).toHaveLength(5)
  })

  it('maps campaign report status badge props', () => {
    expect(getStatusBadgeProps('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getStatusBadgeProps('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getStatusBadgeProps('Scheduled')).toEqual({ color: '#757575', text: 'Scheduled' })
    expect(getStatusBadgeProps('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
  })
})
