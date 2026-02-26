import { shallowMount } from '@vue/test-utils'
import AttacksVectors from '@/components/EmailThreatSmulator/AttacksVectors.vue'

jest.mock('@/api/emailThreatSimlator', () => ({
  getAttackVectorList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  getAttackVectorById: jest.fn(),
  exportAttacksVector: jest.fn(() => Promise.resolve({ size: 0, type: '' }))
}))

describe('AttacksVectors.vue', () => {
  const getEtsAttackVectorPermissionSearch = true
  const createWrapper = (getters = {}) =>
    shallowMount(AttacksVectors, {
      mocks: {
        $store: {
          getters: {
            'permissions/getEtsAttackVectorPermissionSearch': getEtsAttackVectorPermissionSearch,
            'permissions/getEtsAttackVectorPermissionUpdate': true,
            'permissions/getEtsAttackVectorPermissionEnableDisable': true,
            'permissions/getEtsAttackVectorPermissionDelete': true,
            'permissions/getEtsAttackVectorPermissionExport': true,
            'permissions/getEtsAttackVectorPermissionCreate': true,
            ...getters
          }
        }
      },
      stubs: {
        DataTable: true,
        NewAttackVector: true,
        DeleteAttackVector: true,
        ChangeStatusAttackVector: true,
        DefaultButtonRowAction: true,
        DefaultMenuRowAction: true,
        RowActionsMenu: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('setStatusColor returns blue for default risk factor', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(4)).toContain('#1173C1')
  })

  it('setStatusColor returns blue for riskFactor 5', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(5)).toContain('#0198AC')
  })

  it('setStatusColor returns orange for riskFactor 6-7', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(6)).toContain('#B6791D')
    expect(wrapper.vm.setStatusColor(7)).toContain('#B6791D')
  })

  it('setStatusColor returns red for riskFactor >= 8', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.setStatusColor(8)).toContain('#B83A3A')
    expect(wrapper.vm.setStatusColor(10)).toContain('#B83A3A')
  })

  it('changeNewAttackVectorModalStatus sets modal and clears edit state', () => {
    const wrapper = createWrapper()
    wrapper.vm.changeNewAttackVectorModalStatus(false)
    expect(wrapper.vm.modalStatus).toBe(false)
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.attackVectorDetails).toEqual({})
  })

  it('handleActionDelete sets selectedAttackVector and opens delete modal', () => {
    const wrapper = createWrapper()
    const row = { pluginResourceId: 'p1', pluginName: 'Test' }
    wrapper.vm.handleActionDelete(row)
    expect(wrapper.vm.selectedAttackVector).toEqual(row)
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('handleActionStatus sets selectedAttackVector and opens status modal', () => {
    const wrapper = createWrapper()
    const row = { pluginResourceId: 'p1', pluginName: 'Test' }
    wrapper.vm.handleActionStatus(row)
    expect(wrapper.vm.selectedAttackVector).toEqual(row)
    expect(wrapper.vm.showStatusModal).toBe(true)
  })
})
