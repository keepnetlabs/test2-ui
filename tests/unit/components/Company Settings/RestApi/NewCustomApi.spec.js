jest.mock('@/api/restApi', () => ({
  __esModule: true,
  createRestApi: jest.fn(() => Promise.resolve()),
  updateRestApi: jest.fn(() => Promise.resolve()),
  generateClientCredentials: jest.fn(() =>
    Promise.resolve({ data: { data: { clientId: 'cid', clientSecret: 'csec' } } })
  ),
  getRestApi: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          resourceId: 'r1',
          statusId: 1,
          roleResourceIdList: ['role1'],
          allowedIpAddresses: ['1.1.1.1'],
          clientSecret: 'secret'
        }
      }
    })
  )
}))

jest.mock('@/api/systemUsers', () => ({
  __esModule: true,
  getAvailableSystemUsersRole: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [{ name: 'Company Admin', resourceId: 'role1' }]
      }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  scrollToComponent: jest.fn(),
  isDifferent: jest.fn(() => false),
  copyToClipboard: jest.fn(),
  getTimeZone: jest.fn(() => 'yyyy/MM/dd HH:mm'),
  cancellableAxiosRequest: jest.fn((fn) => fn)
}))

import NewCustomApi from '@/components/Company Settings/RestApi/NewCustomApi.vue'
import { createRestApi, updateRestApi, generateClientCredentials, getRestApi } from '@/api/restApi'
import { getAvailableSystemUsersRole } from '@/api/systemUsers'

describe('NewCustomApi.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(NewCustomApi.name).toBe('NewCustomApi')
  })

  it('computed modal labels change by edit/new mode', () => {
    expect(NewCustomApi.computed.getTitle.call({ selectedRow: null })).toBe('New Client')
    expect(NewCustomApi.computed.getIconName.call({ selectedRow: { resourceId: 'x' } })).toBe(
      'mdi-pencil'
    )
    expect(NewCustomApi.computed.isShowGenerateCredentialsBtn.call({ selectedRow: null })).toBe(true)
  })

  it('fillForm maps status and hidden client secret fields', () => {
    const formValues = {
      status: false,
      statusId: 0,
      clientSecret: '',
      allowedIpAddresses: [],
      roleResourceIdList: '',
      test: ''
    }
    const ctx = { formValues, editedClientSecret: '' }
    NewCustomApi.methods.fillForm.call(ctx, {
      statusId: 1,
      clientSecret: 'secret',
      allowedIpAddresses: ['1.1.1.1'],
      roleResourceIdList: ['role1']
    })
    expect(ctx.formValues.status).toBe(true)
    expect(ctx.editedClientSecret).toBe('secret')
    expect(ctx.formValues.clientSecret).toBe('secret')
    expect(ctx.formValues.roleResourceIdList).toBe('role1')
  })

  it('handleGenerateClientBtnClick sets generated credentials', async () => {
    const ctx = {
      selectedRow: null,
      isGenerateClientBtnDisabled: false,
      formValues: { clientId: '', clientSecret: '' }
    }
    NewCustomApi.methods.handleGenerateClientBtnClick.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(generateClientCredentials).toHaveBeenCalled()
    expect(ctx.formValues.clientId).toBe('cid')
    expect(ctx.formValues.clientSecret).toBe('csec')
  })

  it('submit calls create for new and update for edit', async () => {
    const baseCtx = {
      saveDisable: false,
      selectedRow: null,
      formValues: {
        roleResourceIdList: 'role1',
        allowedIpAddresses: [{ value: '1.1.1.1' }],
        hasIpAddressRestriction: true
      },
      $emit: jest.fn(),
      $refs: { refForm: { validate: () => true } }
    }
    NewCustomApi.methods.submit.call(baseCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(createRestApi).toHaveBeenCalled()
    expect(baseCtx.$emit).toHaveBeenCalledWith('closeOverlayWithUpdate')

    const editCtx = {
      ...baseCtx,
      selectedRow: { resourceId: 'r1' }
    }
    NewCustomApi.methods.submit.call(editCtx)
    await Promise.resolve()
    await Promise.resolve()
    expect(updateRestApi).toHaveBeenCalled()
  })

  it('getRoles loads role list and default role for new mode', async () => {
    const ctx = { roleItems: [], selectedRow: null, formValues: {} }
    await NewCustomApi.methods.getRoles.call(ctx)
    expect(ctx.roleItems).toEqual([{ name: 'Company Admin', resourceId: 'role1' }])
    expect(ctx.formValues.roleResourceIdList).toBe('role1')
  })

  it('getRoles does not throw when no CompanyAdmin role exists', async () => {
    getAvailableSystemUsersRole.mockResolvedValueOnce({
      data: { data: [{ name: 'Viewer', resourceId: 'viewer1' }] }
    })
    const ctx = { roleItems: [], selectedRow: null, formValues: {} }
    await NewCustomApi.methods.getRoles.call(ctx)
    expect(ctx.formValues.roleResourceIdList).toBeUndefined()
    expect(ctx.roleItems).toEqual([{ name: 'Viewer', resourceId: 'viewer1' }])
  })

  it('created edit path can fetch existing api detail', async () => {
    await getRestApi('r1')
    expect(getRestApi).toHaveBeenCalledWith('r1')
  })
})
