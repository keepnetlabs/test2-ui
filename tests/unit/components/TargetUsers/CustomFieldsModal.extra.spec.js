jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { name: 'Field1', isActive: true, sortOrder: 0 },
          { name: 'Field2', isActive: false, sortOrder: 1 }
        ]
      }
    })
  ),
  createTargetUserCustomField: jest.fn((item) =>
    Promise.resolve({ data: { data: { resourceId: 'new-id' } } })
  ),
  bulkUpdateOfCustomFields: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import CustomFieldsModal from '@/components/TargetUsers/CustomFieldsModal.vue'

describe('CustomFieldsModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CustomFieldsModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppModal: {
          template: '<div><slot name="overlay-body" /><slot name="overlay-footer" /></div>',
          methods: {}
        },
        AppDialog: true,
        AppDialogFooter: true,
        TableField: true,
        Draggable: true,
        CustomFieldsLoading: true
      }
    })

  it('closeOverlay emits closeCustomFieldsModal when no changes', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    wrapper.vm.isMakePost = false
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeCustomFieldsModal')).toBeTruthy()
  })

  it('closeOverlay emits closeCustomFieldsModalWithUpdate when isMakePost', () => {
    const wrapper = createWrapper()
    wrapper.vm.isMakePost = true
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeCustomFieldsModalWithUpdate')).toBeTruthy()
  })

  it('handleAddCustomField adds new field to customFields', () => {
    const wrapper = createWrapper()
    wrapper.vm.customFields = []
    wrapper.vm.handleAddCustomField()
    expect(wrapper.vm.customFields).toHaveLength(1)
    expect(wrapper.vm.customFields[0]).toMatchObject({
      name: '',
      fieldDataType: 'String',
      isActive: true,
      isNew: true,
      ownerType: 'Company',
      isRequired: false
    })
  })

  it('handleChangeOfList toggles isActive when element added', () => {
    const wrapper = createWrapper()
    const el = { isActive: true }
    wrapper.vm.handleChangeOfList({ added: { element: el } })
    expect(el.isActive).toBe(false)
  })

  it('handleChangeOfList does nothing when no added element', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleChangeOfList({})
    expect(wrapper.vm.customFields).toBeDefined()
  })

  it('handleDeleteTableField sets isWantToDelete and selectedItem', () => {
    const wrapper = createWrapper()
    const item = { name: 'Test' }
    wrapper.vm.handleDeleteTableField(item)
    expect(wrapper.vm.isWantToDelete).toBe(true)
    expect(wrapper.vm.selectedItem).toEqual(JSON.parse(JSON.stringify(item)))
  })

  it('deleteCustomField removes from customFields and closes dialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.customFields = [{ name: 'A' }]
    wrapper.vm.selectedItem = { name: 'A' }
    wrapper.vm.deleteCustomField()
    expect(wrapper.vm.customFields).toHaveLength(0)
    expect(wrapper.vm.isWantToDelete).toBe(false)
  })

  it('deleteCustomField removes from unActiveCustomFields when not in customFields', () => {
    const wrapper = createWrapper()
    wrapper.vm.customFields = []
    wrapper.vm.unActiveCustomFields = [{ name: 'B' }]
    wrapper.vm.selectedItem = { name: 'B' }
    wrapper.vm.deleteCustomField()
    expect(wrapper.vm.unActiveCustomFields).toHaveLength(0)
  })

  it('sortCustomFields sorts by sortOrder', () => {
    const wrapper = createWrapper()
    const data = [{ sortOrder: 2 }, { sortOrder: 0 }, { sortOrder: 1 }]
    wrapper.vm.sortCustomFields(data)
    expect(data[0].sortOrder).toBe(0)
    expect(data[1].sortOrder).toBe(1)
    expect(data[2].sortOrder).toBe(2)
  })
})
