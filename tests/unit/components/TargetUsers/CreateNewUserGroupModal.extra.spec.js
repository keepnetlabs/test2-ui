import { shallowMount } from '@vue/test-utils'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal.vue'

describe('CreateNewUserGroupModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CreateNewUserGroupModal, {
      propsData: {
        status: true,
        title: 'Create New User Group',
        subTitle: 'Enter name and priority',
        isCreateButtonDisabled: false,
        ...propsData
      },
      stubs: {
        AppDialog: {
          template: '<div><slot /><slot name="app-dialog-footer" /><div ref="refDialogForm"><div ref="validate" /></div></div>',
          methods: { validate: () => true }
        },
        InputEntityName: true
      }
    })

  it('changeNewUserGroupStatus emits changeNewUserGroupStatus', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeNewUserGroupStatus(false)
    expect(wrapper.emitted('changeNewUserGroupStatus')).toEqual([[false]])
  })

  it('handleSave emits handleSave with name and priority when form valid', () => {
    const wrapper = createWrapper()
    wrapper.setData({ groupName: 'My Group', priority: 'High' })
    const validateStub = jest.fn(() => true)
    wrapper.vm.$refs = {
      appDialog: {
        $refs: {
          refDialogForm: { validate: validateStub }
        }
      }
    }
    wrapper.vm.handleSave()
    expect(validateStub).toHaveBeenCalled()
    expect(wrapper.emitted('handleSave')).toBeTruthy()
    expect(wrapper.emitted('handleSave')[0][0]).toEqual({
      name: 'My Group',
      priority: 'High'
    })
  })
})
