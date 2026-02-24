import { shallowMount } from '@vue/test-utils'
import RightColumnNotificationDialog from '@/components/ThreatSharing/RightColumn/RightColumnNotificationDialog.vue'
import { getNotifications } from '@/api/dashboard'
import { updateNotifications } from '@/api/threatSharing'

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

jest.mock('@/api/threatSharing', () => ({
  updateNotifications: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('RightColumnNotificationDialog.vue', () => {
  const createWrapper = (propsData = {}, routeOverrides = {}) =>
    shallowMount(RightColumnNotificationDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      mocks: {
        $route: {
          name: 'Community',
          params: { id: 'comm-1' },
          ...routeOverrides
        }
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

  it('loads notifications on created when route is Community', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getNotifications).toHaveBeenCalledWith({
      EntityResourceId: 'comm-1',
      TypeId: 1
    })
    expect(wrapper.vm.notifications.isEmailEnabled).toBe(true)
  })

  it('skips callForData when route is not Community', () => {
    createWrapper({}, { name: 'Other' })
    expect(getNotifications).not.toHaveBeenCalled()
  })

  it('handleClose emits on-close', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('saveNotificationSetting calls updateNotifications and emits on-close', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.saveNotificationSetting()
    await flushPromises()

    expect(updateNotifications).toHaveBeenCalledWith({
      EntityResourceId: 'comm-1',
      TypeId: 1,
      IsSMSEnabled: false,
      IsEmailEnabled: true,
      IsDashboardEnabled: false
    })
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.isEmailNotificationsDisabled).toBe(false)
  })
})
