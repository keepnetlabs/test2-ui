import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm.vue'

describe('CreateOrEditSystemUserForm.vue', () => {
  describe('computed', () => {
    it('authenticationOverrideStatus returns the active override chip label', () => {
      expect(
        CreateOrEditSystemUserForm.computed.authenticationOverrideStatus.call({
          formValues: { bypassSsoRedirect: false, bypassMfa: false }
        })
      ).toBe('No overrides active')
      expect(
        CreateOrEditSystemUserForm.computed.authenticationOverrideStatus.call({
          formValues: { bypassSsoRedirect: true, bypassMfa: false }
        })
      ).toBe('SSO bypassed')
      expect(
        CreateOrEditSystemUserForm.computed.authenticationOverrideStatus.call({
          formValues: { bypassSsoRedirect: false, bypassMfa: true }
        })
      ).toBe('MFA bypassed')
      expect(
        CreateOrEditSystemUserForm.computed.authenticationOverrideStatus.call({
          formValues: { bypassSsoRedirect: true, bypassMfa: true }
        })
      ).toBe('SSO + MFA bypassed')
    })

    it('hasAuthenticationOverrides returns true when any override is enabled', () => {
      expect(
        CreateOrEditSystemUserForm.computed.hasAuthenticationOverrides.call({
          formValues: { bypassSsoRedirect: false, bypassMfa: false }
        })
      ).toBe(false)
      expect(
        CreateOrEditSystemUserForm.computed.hasAuthenticationOverrides.call({
          formValues: { bypassSsoRedirect: true, bypassMfa: false }
        })
      ).toBe(true)
    })
  })

  describe('methods', () => {
    it('getSwitchLabel returns readable on/off labels', () => {
      expect(CreateOrEditSystemUserForm.methods.getSwitchLabel(true)).toBe('On')
      expect(CreateOrEditSystemUserForm.methods.getSwitchLabel(false)).toBe('Off')
    })

    it('validate calls refForm validate', () => {
      const validate = jest.fn(() => true)
      const ctx = {
        $refs: {
          refForm: { validate }
        }
      }
      const result = CreateOrEditSystemUserForm.methods.validate.call(ctx)
      expect(validate).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('resetValidation calls refForm resetValidation', () => {
      const resetValidation = jest.fn()
      const ctx = {
        $refs: {
          refForm: { resetValidation }
        }
      }
      CreateOrEditSystemUserForm.methods.resetValidation.call(ctx)
      expect(resetValidation).toHaveBeenCalled()
    })
  })
})
