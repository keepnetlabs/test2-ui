import AddOrEditSCIMModal from '@/components/Company Settings/SCIM/AddOrEditSCIMModal.vue'
import { createSCIMSetting, updateSCIMSetting } from '@/api/scimSettings'
import { isDifferent, copyToClipboard } from '@/utils/functions'

jest.mock('@/api/scimSettings', () => ({
  createSCIMSetting: jest.fn(() => Promise.resolve({ data: { data: { token: 't-1' } } })),
  updateSCIMSetting: jest.fn(() => Promise.resolve()),
  getSCIMFields: jest.fn(),
  getSCIMSetting: jest.fn()
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

jest.mock('@/utils/functions', () => ({
  isDifferent: jest.fn(() => false),
  copyToClipboard: jest.fn(),
  getDefaultAxiosPayload: jest.fn((payload) => payload || {})
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddOrEditSCIMModal.vue methods', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title and subtitle by edit mode', () => {
    expect(AddOrEditSCIMModal.computed.getTitle.call({ isEdit: false })).toBeTruthy()
    expect(AddOrEditSCIMModal.computed.getBodySubtitle.call({ isEdit: false })).toBeTruthy()
    expect(AddOrEditSCIMModal.computed.getTitle.call({ isEdit: true })).toBeTruthy()
    expect(AddOrEditSCIMModal.computed.getBodySubtitle.call({ isEdit: true })).toBeTruthy()
  })

  it('syncPlatformGroup watcher clears groupBySCIMFieldResourceId when enabled', () => {
    const ctx = { formData: { groupBySCIMFieldResourceId: 'abc' } }
    AddOrEditSCIMModal.watch['formData.syncPlatformGroup'].call(ctx, true)
    expect(ctx.formData.groupBySCIMFieldResourceId).toBe('')
  })

  it('setDefaultGroupByFields keeps only mapped string custom fields', () => {
    const ctx = {
      groupByItems: [],
      defaultCustomFields: [
        { resourceId: 'c1', fieldDataType: 'String', name: 'DeptName' },
        { resourceId: 'c2', fieldDataType: 'Number', name: 'Score' }
      ],
      $refs: {
        refMapCustomAndSCIMFields: {
          fieldMappings: [
            { customFieldResourceId: 'c1', scimFieldResourceId: 'scim-1' },
            { customFieldResourceId: 'c2', scimFieldResourceId: 'scim-2' },
            { customFieldResourceId: '', scimFieldResourceId: 'scim-3' }
          ]
        }
      }
    }

    AddOrEditSCIMModal.methods.setDefaultGroupByFields.call(ctx)

    expect(ctx.groupByItems).toEqual([
      { text: 'Department', value: '9fd0afec416c' },
      { text: 'DeptName', value: 'scim-1' }
    ])
  })

  it('changeStep validates step1 and increments only when valid', () => {
    const ctx = {
      step: 1,
      isEdit: false,
      $refs: { refStep1Form: { validate: jest.fn(() => false) } },
      setDefaultGroupByFields: jest.fn()
    }
    AddOrEditSCIMModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(1)

    ctx.$refs.refStep1Form.validate.mockReturnValue(true)
    AddOrEditSCIMModal.methods.changeStep.call(ctx, 1)
    expect(ctx.step).toBe(2)
    expect(ctx.setDefaultGroupByFields).toHaveBeenCalled()
  })

  it('handleClose emits directly when unchanged, otherwise asks leaving dialog', () => {
    const emit = jest.fn()
    const dispatch = jest.fn((_, payload) => payload.callback())
    const ctx = {
      formData: { a: 1 },
      initialFormData: { a: 1 },
      $emit: emit,
      $store: { dispatch }
    }

    isDifferent.mockReturnValueOnce(false)
    AddOrEditSCIMModal.methods.handleClose.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')

    emit.mockClear()
    isDifferent.mockReturnValueOnce(true)
    AddOrEditSCIMModal.methods.handleClose.call(ctx)
    expect(dispatch).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('handleSubmit updates existing scim setting in edit mode', async () => {
    const emit = jest.fn()
    const ctx = {
      step: 2,
      isEdit: true,
      selectedRow: { resourceId: 'row-1' },
      formData: { name: 'SCIM Name' },
      isActionButtonDisabled: false,
      $emit: emit
    }

    AddOrEditSCIMModal.methods.handleSubmit.call(ctx)
    await flushPromises()

    expect(updateSCIMSetting).toHaveBeenCalledWith({ name: 'SCIM Name' }, 'row-1')
    expect(emit).toHaveBeenCalledWith('on-close')
    expect(emit).toHaveBeenCalledWith('on-close-with-update')
    expect(ctx.isActionButtonDisabled).toBe(false)
  })

  it('handleSubmit creates new scim setting with filtered mappings in create mode', async () => {
    const emit = jest.fn()
    const ctx = {
      step: 2,
      isEdit: false,
      formData: {
        name: 'New SCIM',
        groupResourceId: 'g1',
        groupBySCIMFieldResourceId: 'scim-x',
        syncPlatformGroup: false
      },
      isActionButtonDisabled: false,
      $refs: {
        refMapCustomAndSCIMFields: {
          fieldMappings: [
            { customFieldResourceId: 'c1', scimFieldResourceId: 's1' },
            { customFieldResourceId: '', scimFieldResourceId: 's2' }
          ]
        }
      },
      $emit: emit
    }

    AddOrEditSCIMModal.methods.handleSubmit.call(ctx)
    await flushPromises()

    expect(createSCIMSetting).toHaveBeenCalledWith({
      name: 'New SCIM',
      groupResourceId: 'g1',
      groupBySCIMFieldResourceId: 'scim-x',
      fieldMappings: [{ customFieldResourceId: 'c1', scimFieldResourceId: 's1' }],
      syncPlatformGroup: false
    })
    expect(emit).toHaveBeenCalledWith('on-success-create', 't-1')
  })

  it('handleCopyToClipboard proxies to helper', () => {
    AddOrEditSCIMModal.methods.handleCopyToClipboard.call({}, 'token-123')
    expect(copyToClipboard).toHaveBeenCalledWith('token-123')
  })
})
