import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm.vue'

describe('CreateOrEditSystemUserForm.vue', () => {
  describe('methods', () => {
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
