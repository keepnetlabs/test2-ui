import CreateOrEditSystemUser from '@/components/SystemUsers/CreateOrEditSystemUser.vue'
import {
  createSystemUser,
  sendInformationEmail,
  updateSystemUser
} from '@/api/systemUsers'
import { scrollToComponent, isDifferent } from '@/utils/functions'

jest.mock('@/api/systemUsers', () => ({
  createSystemUser: jest.fn(() => Promise.resolve()),
  sendInformationEmail: jest.fn(() => Promise.resolve()),
  updateSystemUser: jest.fn(() => Promise.resolve()),
  getAvailableSystemUsersRole: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/utils/functions', () => ({
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm')
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CreateOrEditSystemUser.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title/body title based on selectedRow', () => {
    expect(CreateOrEditSystemUser.computed.getTitle.call({ selectedRow: null })).toBe('New System User')
    expect(CreateOrEditSystemUser.computed.getBodyTitle.call({ selectedRow: null })).toBe(
      'Create New System User'
    )
    expect(CreateOrEditSystemUser.computed.getTitle.call({ selectedRow: { resourceId: 'u-1' } })).toBe(
      'Edit System User'
    )
    expect(
      CreateOrEditSystemUser.computed.getBodyTitle.call({ selectedRow: { resourceId: 'u-1' } })
    ).toBe('Edit System User')
  })

  it('country watcher sets phone/timezone defaults only when creating and country exists', () => {
    const ctx = {
      selectedRow: null,
      formValues: { phoneNumber: '', timeZoneId: '' }
    }
    CreateOrEditSystemUser.watch.getCountryName.handler.call(ctx, 'Turkey')
    expect(ctx.formValues.phoneNumber).toBe('+90')
    expect(ctx.formValues.timeZoneId).toBe('Turkey Standard Time')

    const editCtx = {
      selectedRow: { resourceId: 'u-1' },
      formValues: { phoneNumber: '', timeZoneId: '' }
    }
    CreateOrEditSystemUser.watch.getCountryName.handler.call(editCtx, 'Turkey')
    expect(editCtx.formValues.phoneNumber).toBe('')
  })

  it('setRoleItems and setDefaultRole map and pick Company Admin', () => {
    const ctx = { roleItems: [], formValues: { roleResourceIdList: '' } }
    const roles = [
      { name: 'Analyst', resourceId: 'r-1' },
      { name: 'Company Admin', resourceId: 'r-2' }
    ]

    CreateOrEditSystemUser.methods.setRoleItems.call(ctx, roles)
    expect(ctx.roleItems).toEqual([
      { name: 'Analyst', resourceId: 'r-1' },
      { name: 'Company Admin', resourceId: 'r-2' }
    ])

    CreateOrEditSystemUser.methods.setDefaultRole.call(ctx, roles)
    expect(ctx.formValues.roleResourceIdList).toBe('r-2')
  })

  it('callForSendInformationEmail toggles disabled state around request', async () => {
    const ctx = { sendInformationEmailDisabled: false }
    CreateOrEditSystemUser.methods.callForSendInformationEmail.call(ctx, 'u-1')
    expect(ctx.sendInformationEmailDisabled).toBe(true)
    await flushPromises()
    expect(sendInformationEmail).toHaveBeenCalledWith('u-1')
    expect(ctx.sendInformationEmailDisabled).toBe(false)
  })

  it('closeOverlay emits directly when form unchanged', () => {
    isDifferent.mockReturnValueOnce(false)
    const emit = jest.fn()
    const ctx = {
      formValues: { a: 1 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }
    CreateOrEditSystemUser.methods.closeOverlay.call(ctx)
    expect(emit).toHaveBeenCalledWith('closeOverlay')
    expect(ctx.$store.dispatch).not.toHaveBeenCalled()
  })

  it('closeOverlay opens leaving dialog when form changed', () => {
    isDifferent.mockReturnValueOnce(true)
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formValues: { a: 2 },
      initialFormValues: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }
    CreateOrEditSystemUser.methods.closeOverlay.call(ctx)
    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true })
    )
    expect(emit).toHaveBeenCalledWith('closeOverlay')
  })

  it('handleChangeStatus maps status name from val', () => {
    const ctx = {
      formValues: { statusName: '' },
      statusItems: [
        { name: 'Active', val: 1 },
        { name: 'Inactive', val: 0 }
      ]
    }
    CreateOrEditSystemUser.methods.handleChangeStatus.call(ctx, 0)
    expect(ctx.formValues.statusName).toBe('Inactive')
  })

  it('handleChangeStatus sets empty string when no matching status exists', () => {
    const ctx = {
      formValues: { statusName: 'Active' },
      statusItems: [{ name: 'Active', val: 1 }]
    }
    CreateOrEditSystemUser.methods.handleChangeStatus.call(ctx, 99)
    expect(ctx.formValues.statusName).toBe('')
  })

  it('submit calls update flow for edit mode with cleaned phone and role array', () => {
    const callForUpdateSystemUser = jest.fn()
    const ctx = {
      selectedRow: { resourceId: 'u-9' },
      formValues: {
        phoneNumber: '+90 555 111',
        roleResourceIdList: 'r-1'
      },
      saveDisable: false,
      $refs: {
        refForm: {
          validatePhoneNumber: jest.fn(() => true),
          validate: jest.fn(() => true)
        }
      },
      callForUpdateSystemUser,
      callForCreateSystemUser: jest.fn(),
      $forceUpdate: jest.fn(),
      $nextTick: jest.fn()
    }
    CreateOrEditSystemUser.methods.submit.call(ctx)

    expect(ctx.saveDisable).toBe(true)
    expect(callForUpdateSystemUser).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'u-9',
        phoneNumber: '+90555111',
        roleResourceIdList: ['r-1']
      })
    )
  })

  it('submit calls create flow for new user mode', () => {
    const callForCreateSystemUser = jest.fn()
    const ctx = {
      selectedRow: null,
      formValues: {
        phoneNumber: '+1 202 333',
        roleResourceIdList: 'r-2'
      },
      saveDisable: false,
      $refs: {
        refForm: {
          validatePhoneNumber: jest.fn(() => true),
          validate: jest.fn(() => true)
        }
      },
      callForUpdateSystemUser: jest.fn(),
      callForCreateSystemUser,
      $forceUpdate: jest.fn(),
      $nextTick: jest.fn()
    }
    CreateOrEditSystemUser.methods.submit.call(ctx)

    expect(callForCreateSystemUser).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: '+1202333',
        roleResourceIdList: ['r-2']
      })
    )
  })

  it('submit invalid form triggers scrollToComponent path', () => {
    const ctx = {
      selectedRow: null,
      formValues: {},
      $refs: {
        refForm: {
          validatePhoneNumber: jest.fn(() => false),
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => '.error--text') }
        }
      },
      $forceUpdate: jest.fn(),
      $nextTick: (cb) => cb()
    }
    CreateOrEditSystemUser.methods.submit.call(ctx)
    expect(ctx.$forceUpdate).toHaveBeenCalled()
    expect(scrollToComponent).toHaveBeenCalledWith('.error--text')
  })

  it('callForCreateSystemUser adds company id and emits closeOverlayWithUpdate', async () => {
    const emit = jest.fn()
    const ctx = {
      createdCompanyResourceId: 'c-1',
      saveDisable: true,
      $emit: emit
    }
    CreateOrEditSystemUser.methods.callForCreateSystemUser.call(ctx, { firstName: 'A' })
    await flushPromises()
    expect(createSystemUser).toHaveBeenCalledWith(
      expect.objectContaining({ CompanyResourceId: 'c-1', firstName: 'A' })
    )
    expect(ctx.saveDisable).toBe(false)
    expect(emit).toHaveBeenCalledWith('closeOverlayWithUpdate')
  })

  it('callForCreateSystemUser clears saveDisable when request fails', async () => {
    createSystemUser.mockRejectedValueOnce(new Error('create failed'))
    const ctx = {
      saveDisable: true,
      $emit: jest.fn()
    }

    CreateOrEditSystemUser.methods.callForCreateSystemUser.call(ctx, { firstName: 'A' })
    await flushPromises()

    expect(ctx.saveDisable).toBe(false)
    expect(ctx.$emit).not.toHaveBeenCalled()
  })

  it('callForUpdateSystemUser emits closeOverlayWithUpdate and clears saveDisable', async () => {
    const emit = jest.fn()
    const ctx = { saveDisable: true, $emit: emit }
    CreateOrEditSystemUser.methods.callForUpdateSystemUser.call(ctx, { resourceId: 'u-1' })
    await flushPromises()
    expect(updateSystemUser).toHaveBeenCalledWith({ resourceId: 'u-1' })
    expect(ctx.saveDisable).toBe(false)
    expect(emit).toHaveBeenCalledWith('closeOverlayWithUpdate')
  })

  it('callForUpdateSystemUser clears saveDisable when request fails', async () => {
    updateSystemUser.mockRejectedValueOnce(new Error('update failed'))
    const ctx = { saveDisable: true, $emit: jest.fn() }
    CreateOrEditSystemUser.methods.callForUpdateSystemUser.call(ctx, { resourceId: 'u-1' })
    await flushPromises()

    expect(ctx.saveDisable).toBe(false)
    expect(ctx.$emit).not.toHaveBeenCalled()
  })

  it('toggleWelcomeEmailModal toggles modal status', () => {
    const ctx = { showWelcomeEmailModal: false }
    CreateOrEditSystemUser.methods.toggleWelcomeEmailModal.call(ctx)
    expect(ctx.showWelcomeEmailModal).toBe(true)
    CreateOrEditSystemUser.methods.toggleWelcomeEmailModal.call(ctx)
    expect(ctx.showWelcomeEmailModal).toBe(false)
  })

  it('handleSendEmail closes modal via toggle method', () => {
    const ctx = { toggleWelcomeEmailModal: jest.fn() }
    CreateOrEditSystemUser.methods.handleSendEmail.call(ctx)
    expect(ctx.toggleWelcomeEmailModal).toHaveBeenCalledTimes(1)
  })

  it('setDefaultRole leaves role unchanged when company admin is missing', () => {
    const ctx = { formValues: { roleResourceIdList: 'existing-role' } }
    CreateOrEditSystemUser.methods.setDefaultRole.call(ctx, [{ name: 'Analyst', resourceId: 'r-1' }])
    expect(ctx.formValues.roleResourceIdList).toBe('existing-role')
  })
})
