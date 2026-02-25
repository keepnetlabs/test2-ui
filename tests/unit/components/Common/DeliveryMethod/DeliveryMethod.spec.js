jest.mock('@/components/Common/DeliveryMethod/utils', () => ({
  __esModule: true,
  deliveryMethodOptions: jest.fn(() => [
    { label: 'Email', value: 'email' },
    { label: 'Microsoft Teams', value: 'microsoft-teams', isDisabled: false }
  ])
}))

jest.mock('@/api/microsoftTeamsSettings', () => ({
  __esModule: true,
  default: {
    getMicrosoftTeamsSettings: jest.fn(() => Promise.resolve({ data: { data: { isFound: false } } }))
  }
}))

import DeliveryMethod from '@/components/Common/DeliveryMethod/DeliveryMethod.vue'
import MicrosoftTeamsSettingsService from '@/api/microsoftTeamsSettings'

describe('DeliveryMethod.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(DeliveryMethod.name).toBe('DeliveryMethod')
  })

  it('validationRules includes required validator when required is true', () => {
    const rules = DeliveryMethod.computed.validationRules.call({ required: true })
    expect(Array.isArray(rules)).toBe(true)
    expect(rules.length).toBeGreaterThan(0)
  })

  it('watch value syncs selectedValue when changed', () => {
    const ctx = { selectedValue: 'email' }
    DeliveryMethod.watch.value.call(ctx, 'microsoft-teams')
    expect(ctx.selectedValue).toBe('microsoft-teams')
  })

  it('handleInput ignores disabled option', () => {
    const $emit = jest.fn()
    const ctx = {
      deliveryOptions: [{ value: 'microsoft-teams', isDisabled: true }],
      selectedValue: 'email',
      $emit
    }
    DeliveryMethod.methods.handleInput.call(ctx, 'microsoft-teams')
    expect(ctx.selectedValue).toBe('email')
    expect($emit).not.toHaveBeenCalled()
  })

  it('handleInput emits input and change for enabled option', () => {
    const $emit = jest.fn()
    const selectedOption = { value: 'email', isDisabled: false }
    const ctx = {
      deliveryOptions: [selectedOption],
      selectedValue: '',
      $emit,
      selectedOption
    }
    DeliveryMethod.methods.handleInput.call(ctx, 'email')
    expect(ctx.selectedValue).toBe('email')
    expect($emit).toHaveBeenCalledWith('input', 'email')
    expect($emit).toHaveBeenCalledWith('change', selectedOption)
  })

  it('checkTeamsIntegration disables teams option when integration not found', async () => {
    const teams = { value: 'microsoft-teams', isDisabled: false, tooltip: '' }
    const ctx = {
      deliveryOptions: [{ value: 'email' }, teams],
      isTeamsIntegrationEnabled: true,
      $set: (obj, key, val) => {
        obj[key] = val
      }
    }
    DeliveryMethod.methods.checkTeamsIntegration.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings).toHaveBeenCalled()
    expect(ctx.isTeamsIntegrationEnabled).toBe(false)
    expect(teams.isDisabled).toBe(true)
    expect(teams.tooltip).toContain('Enable the Microsoft Teams integration')
  })
})
