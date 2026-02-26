jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    getLDAPSettingDetailForMyCompany: jest.fn(),
    updateLDAPSetting: jest.fn(() => Promise.resolve()),
    createLDAPSetting: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { fieldDataType: 'String', isActive: true, sortOrder: 2 },
          { fieldDataType: 'Number', isActive: true, sortOrder: 1 },
          { fieldDataType: 'String', isActive: true, sortOrder: 1 }
        ]
      }
    })
  )
}))

import LDAP from '@/components/Company Settings/LDAP/LDAP.vue'
import LDAPService from '@/api/ldap'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('LDAP.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('created triggers initial data and custom field loading', () => {
    const ctx = {
      callForData: jest.fn(),
      callForCustomFields: jest.fn()
    }
    LDAP.created.call(ctx)
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.callForCustomFields).toHaveBeenCalledTimes(1)
  })

  it('watch tab triggers reload only for field-mapping tab', () => {
    const ctx = {
      callForData: jest.fn(),
      callForCustomFields: jest.fn()
    }

    LDAP.watch.tab.call(ctx, 'field-mapping')
    expect(ctx.callForData).toHaveBeenCalledTimes(1)
    expect(ctx.callForCustomFields).toHaveBeenCalledTimes(1)

    ctx.callForData.mockClear()
    ctx.callForCustomFields.mockClear()
    LDAP.watch.tab.call(ctx, 'settings')
    expect(ctx.callForData).not.toHaveBeenCalled()
    expect(ctx.callForCustomFields).not.toHaveBeenCalled()
  })

  it('handleBeforeLeave blocks disabled tabs and allows valid navigation', () => {
    expect(
      LDAP.methods.handleBeforeLeave.call(
        { isFieldMappingDisabled: true, isNotConfiguredYet: false },
        'field-mapping'
      )
    ).toBe(false)

    expect(
      LDAP.methods.handleBeforeLeave.call(
        { isFieldMappingDisabled: false, isNotConfiguredYet: true },
        'scheduled-syncs'
      )
    ).toBe(false)

    expect(
      LDAP.methods.handleBeforeLeave.call(
        { isFieldMappingDisabled: false, isNotConfiguredYet: false },
        'settings'
      )
    ).toBe(true)
  })

  it('onIntegrateClicked resets not-configured state', () => {
    const ctx = { isNotConfiguredYet: true }
    LDAP.methods.onIntegrateClicked.call(ctx)
    expect(ctx.isNotConfiguredYet).toBe(false)
  })

  it('callForData handles not-configured response branch', async () => {
    LDAPService.getLDAPSettingDetailForMyCompany.mockResolvedValueOnce({
      data: { message: 'LDAP Setting not found', status: 'SUCCESS' }
    })
    const ctx = {
      tab: 'field-mapping',
      isNotConfiguredYet: false,
      isFieldMappingDisabled: false,
      setLoading: jest.fn()
    }

    LDAP.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.isNotConfiguredYet).toBe(true)
    expect(ctx.isFieldMappingDisabled).toBe(true)
    expect(ctx.tab).toBe('settings')
  })

  it('callForCustomFields filters and sorts active string fields', async () => {
    const ctx = { customFields: [] }

    LDAP.methods.callForCustomFields.call(ctx)
    await flushPromises()

    expect(getTargetUserCustomFieldsByCompanyId).toHaveBeenCalledTimes(1)
    expect(ctx.customFields).toEqual([
      { fieldDataType: 'String', isActive: true, sortOrder: 1 },
      { fieldDataType: 'String', isActive: true, sortOrder: 2 }
    ])
  })
})
