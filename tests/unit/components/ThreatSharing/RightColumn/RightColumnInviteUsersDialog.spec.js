import { shallowMount } from '@vue/test-utils'
import RightColumnInviteUsersDialog from '@/components/ThreatSharing/RightColumn/RightColumnInviteUsersDialog.vue'
import { inviteToCommunity } from '@/api/threatSharing'

jest.mock('@/api/threatSharing', () => ({
  inviteToCommunity: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { result: 'Success', resultText: 'Invited', email: 'a@test.com' },
          { result: 'Failed', resultText: 'Error', email: 'b@test.com' }
        ]
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('RightColumnInviteUsersDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(RightColumnInviteUsersDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      mocks: {
        $route: { params: { id: 'comm-1' } },
        $store: { dispatch: jest.fn() }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        KSelect: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('handleClose emits on-close with false', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')[0]).toEqual([false])
  })

  it('handleEmailChange trims and updates emails', () => {
    const wrapper = createWrapper()
    const result = wrapper.vm.handleEmailChange(['  a@test.com  ', 'b@test.com'])
    expect(wrapper.vm.emails).toEqual(['a@test.com', 'b@test.com'])
    expect(result).toEqual(['a@test.com', 'b@test.com'])
  })

  it('inviteMember calls inviteToCommunity when form valid', async () => {
    const wrapper = createWrapper()
    wrapper.vm.emails = ['a@test.com']
    wrapper.vm.$refs = {
      inviteModal: { validate: jest.fn(() => true) }
    }

    wrapper.vm.inviteMember()
    await flushPromises()

    expect(inviteToCommunity).toHaveBeenCalledWith('comm-1', {
      emailArray: ['a@test.com']
    })
    expect(wrapper.vm.emails).toEqual([])
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.inviteAllButtonDisabled).toBe(false)
  })

  it('inviteMember does not call API when form invalid', () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs = {
      inviteModal: { validate: jest.fn(() => false) }
    }

    wrapper.vm.inviteMember()

    expect(inviteToCommunity).not.toHaveBeenCalled()
  })
})
