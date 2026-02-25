import labels from '@/model/constants/labels'
import NewSamlSettings from '@/components/Company Settings/SAML/NewSamlSettings.vue'

describe('NewSamlSettings.vue', () => {
  it('has expected component name', () => {
    expect(NewSamlSettings.name).toBe('NewSamlSettings')
  })

  it('computed getId and getTitle return edit/new values', () => {
    expect(NewSamlSettings.computed.getId.call({ isEdit: true })).toBe('edit-saml-settings-modal')
    expect(NewSamlSettings.computed.getId.call({ isEdit: false })).toBe('new-saml-settings-modal')

    expect(NewSamlSettings.computed.getTitle.call({ isEdit: true })).toBe(labels.SamlModalBodyEditTitle)
    expect(NewSamlSettings.computed.getTitle.call({ isEdit: false })).toBe(labels.SamlModalBodyTitle)
  })

  it('getAddDomainButtonStyle disables button when form is invalid', () => {
    const disabledStyle = NewSamlSettings.computed.getAddDomainButtonStyle.call({
      isDomainToAddFormValid: false,
      formValues: { domainToAdd: '' }
    })
    const enabledStyle = NewSamlSettings.computed.getAddDomainButtonStyle.call({
      isDomainToAddFormValid: true,
      formValues: { domainToAdd: 'keepnetlabs.com' }
    })

    expect(disabledStyle.opacity).toBe(0.5)
    expect(disabledStyle.pointerEvents).toBe('none')
    expect(enabledStyle).toEqual({})
  })

  it('toggleBatchImportPopup toggles modal state', () => {
    const ctx = { isBatchImportPopupOpen: false }

    NewSamlSettings.methods.toggleBatchImportPopup.call(ctx)
    expect(ctx.isBatchImportPopupOpen).toBe(true)

    NewSamlSettings.methods.toggleBatchImportPopup.call(ctx)
    expect(ctx.isBatchImportPopupOpen).toBe(false)
  })
})
