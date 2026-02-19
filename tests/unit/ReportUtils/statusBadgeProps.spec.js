import { getStatusBadgeProps as getCampaignReportStatus } from '@/components/CampaignReports/utils'
import { getStatusBadgeProps as getVishingStatus } from '@/components/VishingReport/utils'
import {
  getStatusBadgeProps as getSmishingOpenedStatus,
  getDifficultyColor
} from '@/components/SmishingReport/Opened/utils'
import { getStatusBadgeProps as getQuishingOpenedStatus } from '@/components/QuishingCampaignManagerReport/Opened/utils'

describe('report status badge utility functions', () => {
  it('CampaignReports maps known statuses', () => {
    expect(getCampaignReportStatus('Completed')).toEqual({ color: '#217124', text: 'Completed' })
    expect(getCampaignReportStatus('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getCampaignReportStatus('Error')).toEqual({
      color: '#F56C6C',
      text: 'Error',
      outline: false
    })
  })

  it('VishingReport maps known statuses', () => {
    expect(getVishingStatus('NotResponded')).toEqual({
      color: '#757575',
      text: 'Not Responded'
    })
    expect(getVishingStatus('In Queue')).toEqual({ color: '#1173C1', text: 'In Queue' })
    expect(getVishingStatus('Calling Error')).toEqual({
      color: '#F56C6C',
      text: 'Calling Error',
      outline: false
    })
  })

  it('SmishingReport opened maps statuses and difficulty colors', () => {
    expect(getSmishingOpenedStatus('Not Delivered')).toEqual({
      color: '#757575',
      text: 'Not Delivered'
    })
    expect(getSmishingOpenedStatus('InQueue')).toEqual({ color: '#1173C1', text: 'In Queue' })
    expect(getSmishingOpenedStatus('Delivered')).toEqual({ color: '#217124', text: 'Delivered' })

    expect(getDifficultyColor('Easy')).toBe('#217124')
    expect(getDifficultyColor('Medium')).toBe('#2196F3')
    expect(getDifficultyColor('Hard')).toBe('#F56C6C')
    expect(getDifficultyColor('Unknown')).toBe('#217124')
  })

  it('Quishing opened maps statuses', () => {
    expect(getQuishingOpenedStatus('Successful')).toEqual({ color: '#217124', text: 'Successful' })
    expect(getQuishingOpenedStatus('Canceled')).toEqual({ color: '#B6791D', text: 'Cancelled' })
    expect(getQuishingOpenedStatus('Processing')).toEqual({ color: '#1173C1', text: 'Processing' })
  })
})
