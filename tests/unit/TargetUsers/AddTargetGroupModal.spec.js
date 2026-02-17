import { shallowMount } from '@vue/test-utils'
import AddTargetGroupModal from '@/components/TargetUsers/AddTargetGroupModal.vue'
import { bulkImportTargetUsersToGroups, createTargetGroup } from '@/api/targetUsers'

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          resourceId: 'tg-1'
        }
      }
    })
  ),
  bulkImportTargetUsersToGroups: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AddTargetGroupModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AddTargetGroupModal, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppModal: true,
        AppModalBodyHeader: true,
        InputEntityName: true,
        FormGroup: true,
        TargetGroupUsersTable: true,
        'v-radio-group': true,
        'v-radio': true
      },
      mocks: {
        $router: {
          push: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('AddTargetGroupModal')
  })

  it('emits closeOverlay in handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('closeOverlay')).toEqual([[]])
  })

  it('maps selected users and payload in handleSelectionChange', () => {
    const wrapper = createWrapper()
    wrapper.vm.resourceId = 'group-x'
    wrapper.vm.$refs.refTargetGroupUsersTable = {
      axiosPayload: {
        filter: { FilterGroups: [] }
      }
    }

    wrapper.vm.handleSelectionChange(
      [{ resourceId: 'u-1' }, { resourceId: 'u-2' }],
      ['u-3'],
      false
    )

    expect(wrapper.vm.selectedUsers).toEqual(['u-1', 'u-2'])
    expect(wrapper.vm.payload).toEqual(
      expect.objectContaining({
        targetUserResourceIds: ['u-1', 'u-2'],
        selectAll: false,
        excludedResourceIdList: ['u-3']
      })
    )
  })

  it('does not submit when modal form validation fails', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refModal = {
      $refs: {
        refForm: {
          validate: jest.fn(() => false)
        }
      }
    }

    wrapper.vm.handleSubmit()
    await flushPromises()

    expect(createTargetGroup).not.toHaveBeenCalled()
  })

  it('creates group and routes directly when no users are selected', async () => {
    const wrapper = createWrapper()
    wrapper.vm.formData = { name: 'Blue Group', priority: 'High' }
    wrapper.vm.selectedUsers = []
    wrapper.vm.$refs.refModal = {
      $refs: {
        refForm: {
          validate: jest.fn(() => true)
        }
      }
    }

    wrapper.vm.handleSubmit()
    await flushPromises()

    expect(createTargetGroup).toHaveBeenCalledWith({
      name: 'Blue Group',
      priority: 'High'
    })
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Target Group Users',
      params: { id: 'tg-1', label: 'Blue Group' }
    })
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('creates group and imports users when selected users exist', async () => {
    const wrapper = createWrapper()
    wrapper.vm.formData = { name: 'Red Group', priority: 'Medium' }
    wrapper.vm.selectedUsers = ['u-1', 'u-2']
    wrapper.vm.payload = {
      selectAll: false,
      excludedResourceIdList: [],
      targetGroupResourceIds: [],
      targetUserResourceIds: ['u-1', 'u-2']
    }
    wrapper.vm.$refs.refModal = {
      $refs: {
        refForm: {
          validate: jest.fn(() => true)
        }
      }
    }
    wrapper.vm.$refs.refTargetGroupUsersTable = {
      $refs: {
        refTargetGroupUsersTable: {
          getServerSideSelectionParams: jest.fn(() => ({
            isSelectedAllEver: true,
            excludedResourceIdList: ['u-9']
          }))
        }
      }
    }

    wrapper.vm.handleSubmit()
    await flushPromises()

    expect(createTargetGroup).toHaveBeenCalled()
    expect(bulkImportTargetUsersToGroups).toHaveBeenCalledWith(
      expect.objectContaining({
        selectAll: true,
        excludedResourceIdList: ['u-9'],
        targetGroupResourceIds: ['tg-1'],
        targetUserResourceIds: []
      })
    )
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: 'Target Group Users',
      params: { id: 'tg-1', label: 'Red Group' }
    })
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
