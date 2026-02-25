import MailConfigurationSelectItem from '@/components/Common/Others/MailConfigurationSelectItem.vue'

describe('MailConfigurationSelectItem.vue', () => {
  it('has correct component name', () => {
    expect(MailConfigurationSelectItem.name).toBe('MailConfigurationSelectItem')
  })

  it('required props define defaults for visual state', () => {
    expect(MailConfigurationSelectItem.props.isWithTooltip.default).toBe(false)
    expect(MailConfigurationSelectItem.props.isDisabled.default).toBe(false)
    expect(MailConfigurationSelectItem.props.isFirst.default).toBe(false)
    expect(MailConfigurationSelectItem.props.isSelected.default).toBe(false)
    expect(MailConfigurationSelectItem.props.badgeText.default).toBe('Running')
  })

  it('item prop is required object', () => {
    expect(MailConfigurationSelectItem.props.item.required).toBe(true)
    expect(MailConfigurationSelectItem.props.item.type).toBe(Object)
  })
})
