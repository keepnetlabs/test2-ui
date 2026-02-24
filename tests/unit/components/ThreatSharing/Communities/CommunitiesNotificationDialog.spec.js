import { shallowMount } from '@vue/test-utils'
import CommunitiesNotificationDialog from '@/components/ThreatSharing/Communities/CommunitiesNotificationDialog.vue'
import { updateNotifications } from '@/api/threatSharing'
import { getNotifications } from '@/api/dashboard'

jest.mock('@/api/threatSharing', () => ({
  updateNotifications: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/dashboard', () => ({
  getNotifications: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          isSMSEnabled: false,
          isEmailEnabled: true,
          isDashboardEnabled: false
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommunitiesNotificationDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CommunitiesNotificationDialog, {
      propsData: {
        status: true,
        communityResourceId: 'comm-1',
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('loads notifications on created', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getNotifications).toHaveBeenCalledWith({
      EntityResourceId: 'comm-1',
      TypeId: 1
    })
    expect(wrapper.vm.notifications.isEmailEnabled).toBe(true)
    expect(wrapper.vm.notificationLoading).toBe(false)
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('saveNotificationSetting calls updateNotifications and closes', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    wrapper.vm.notifications.isEmailEnabled = false

    wrapper.vm.saveNotificationSetting()
    await flushPromises()

    expect(updateNotifications).toHaveBeenCalledWith({
      EntityResourceId: 'comm-1',
      TypeId: 1,
      IsSMSEnabled: false,
      IsEmailEnabled: false,
      IsDashboardEnabled: false
    })
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.isNotificationSettingButtonDisabled).toBe(false)
  })
})
