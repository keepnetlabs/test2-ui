import InputManager from '@/components/Common/Inputs/InputManager.vue'
import * as Validations from '@/utils/validations'

jest.mock('@/utils/validations', () => ({
  startsWithSpace: jest.fn(() => true),
  maxLength: jest.fn(() => true),
  required: jest.fn((v) => !!v),
  email: jest.fn((v) => !!v && String(v).includes('@')),
  controlEmailLength: jest.fn(() => true)
}))

describe('InputManager.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed field-state helpers return expected values', () => {
    const emptyCtx = {
      managerFirstName: '',
      managerLastName: '',
      managerEmail: '',
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true
    }
    expect(InputManager.computed.hasAnyManagerField.call(emptyCtx)).toBe(false)
    expect(InputManager.computed.allFieldsFilled.call(emptyCtx)).toBe(false)

    const partialCtx = {
      managerFirstName: 'A',
      managerLastName: '',
      managerEmail: '',
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      hasAnyManagerField: true,
      allFieldsFilled: false
    }
    expect(InputManager.computed.hasPartialFields.call(partialCtx)).toBe(true)

    const validCtx = {
      managerFirstName: 'A',
      managerLastName: 'B',
      managerEmail: 'a@b.com',
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      hasAnyManagerField: true,
      hasPartialFields: false,
      allFieldsValid: true
    }
    expect(InputManager.computed.isValid.call(validCtx)).toBe(true)
  })

  it('computed allFieldsValid handles empty and invalid states', () => {
    expect(
      InputManager.computed.allFieldsValid.call({
        hasAnyManagerField: false,
        firstNameValid: false,
        lastNameValid: false,
        emailValid: false
      })
    ).toBe(true)

    expect(
      InputManager.computed.allFieldsValid.call({
        hasAnyManagerField: true,
        firstNameValid: true,
        lastNameValid: false,
        emailValid: true
      })
    ).toBe(false)
  })

  it('rules include required only when any manager field is filled', () => {
    const noFieldCtx = { hasAnyManagerField: false }
    const withFieldCtx = { hasAnyManagerField: true }

    expect(InputManager.computed.firstNameRules.call(noFieldCtx)).toHaveLength(2)
    expect(InputManager.computed.firstNameRules.call(withFieldCtx)).toHaveLength(3)

    expect(InputManager.computed.lastNameRules.call(noFieldCtx)).toHaveLength(2)
    expect(InputManager.computed.lastNameRules.call(withFieldCtx)).toHaveLength(3)

    expect(InputManager.computed.emailRules.call(noFieldCtx)).toHaveLength(4)
    expect(InputManager.computed.emailRules.call(withFieldCtx)).toHaveLength(5)
  })

  it('emailRules custom rule returns false for invalid email and true for valid', () => {
    const rules = InputManager.computed.emailRules.call({ hasAnyManagerField: false })
    const customRule = rules[3]

    expect(customRule('not-an-email')).toBe(false)
    expect(customRule('user@example.com')).toBe(true)
    expect(Validations.email).toHaveBeenCalled()
    expect(Validations.controlEmailLength).toHaveBeenCalledWith('user@example.com')
  })

  it('value watcher syncs local fields from incoming value', () => {
    const ctx = {
      managerFirstName: '',
      managerLastName: '',
      managerEmail: ''
    }

    InputManager.watch.value.handler.call(ctx, {
      managerFirstName: 'Jane',
      managerLastName: 'Doe',
      managerEmail: 'jane@keepnet.com'
    })

    expect(ctx.managerFirstName).toBe('Jane')
    expect(ctx.managerLastName).toBe('Doe')
    expect(ctx.managerEmail).toBe('jane@keepnet.com')
  })

  it('validateFields updates validity flags from refs', () => {
    const ctx = {
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      $nextTick: (cb) => cb(),
      $refs: {
        firstNameField: { validate: jest.fn(() => false) },
        lastNameField: { validate: jest.fn(() => true) },
        emailField: { validate: jest.fn(() => false) }
      }
    }

    InputManager.methods.validateFields.call(ctx)

    expect(ctx.firstNameValid).toBe(false)
    expect(ctx.lastNameValid).toBe(true)
    expect(ctx.emailValid).toBe(false)
  })

  it('input handlers update field, validate and emit', () => {
    const validateFields = jest.fn()
    const emitChange = jest.fn()

    const firstCtx = { managerFirstName: '', validateFields, emitChange }
    InputManager.methods.handleFirstNameInput.call(firstCtx, 'John')
    expect(firstCtx.managerFirstName).toBe('John')
    expect(validateFields).toHaveBeenCalled()
    expect(emitChange).toHaveBeenCalled()

    const lastCtx = { managerLastName: '', validateFields, emitChange }
    InputManager.methods.handleLastNameInput.call(lastCtx, 'Doe')
    expect(lastCtx.managerLastName).toBe('Doe')

    const emailCtx = { managerEmail: '', validateFields, emitChange }
    InputManager.methods.handleEmailInput.call(emailCtx, 'john@keepnet.com')
    expect(emailCtx.managerEmail).toBe('john@keepnet.com')
  })

  it('emitChange emits composed manager payload', () => {
    const emit = jest.fn()
    const ctx = {
      managerFirstName: 'John',
      managerLastName: 'Doe',
      managerEmail: 'john@keepnet.com',
      $emit: emit
    }

    InputManager.methods.emitChange.call(ctx)

    expect(emit).toHaveBeenCalledWith('input', {
      managerFirstName: 'John',
      managerLastName: 'Doe',
      managerEmail: 'john@keepnet.com'
    })
  })
})
