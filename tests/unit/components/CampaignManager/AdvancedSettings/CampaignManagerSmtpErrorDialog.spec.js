import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog.vue'

describe('CampaignManagerSmtpErrorDialog.vue', () => {
  it('has correct component name', () => {
    expect(CampaignManagerSmtpErrorDialog.name).toBe('CampaignManagerSmtpErrorDialog')
  })

  it('declares expected props', () => {
    const props = CampaignManagerSmtpErrorDialog.props
    expect(props).toHaveProperty('status')
    expect(props).toHaveProperty('message')
  })
})
