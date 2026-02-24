import { shallowMount } from '@vue/test-utils'
import CommunitiesNotificationDialog from '@/components/ThreatSharing/Communities/CommunitiesNotificationDialog.vue'
import { updateNotifications } from '@/api/threatSharing'
import { getNotifications } from '@/api/dashboard'

jest.mock('@/api/threatSharing', () => ({
  updateNotifications: jest.fn(() => Promise.resolve())
}))

jest.mock('@/api/dashboard', () => ({
  getNotifications: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CommunitiesNotificationDialog.vue (branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CommunitiesNotificationDialog, {
      propsData: {
        status: true,
        communityResourceId: 'comm-1',
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForData handles empty response.data.data', async () => {
    getNotifications.mockResolvedValueOnce({ data: {} })
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.notifications.isEmailEnabled).toBe(false)
    expect(wrapper.vm.notifications.isSMSEnabled).toBe(false)
    expect(wrapper.vm.notifications.isDashboardEnabled).toBe(false)
    expect(wrapper.vm.notificationLoading).toBe(false)
  })

  it('callForData handles null response', async () => {
    getNotifications.mockResolvedValueOnce(null)
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.notificationLoading).toBe(false)
  })

  it('saveNotificationSetting passes all notification flags', async () => {
    getNotifications.mockResolvedValueOnce({
      data: {
        data: {
          isSMSEnabled: true,
          isEmailEnabled: true,
          isDashboardEnabled: true
        }
      }
    })
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.saveNotificationSetting()
    await flushPromises()

    expect(updateNotifications).toHaveBeenCalledWith({
      EntityResourceId: 'comm-1',
      TypeId: 1,
      IsSMSEnabled: true,
      IsEmailEnabled: true,
      IsDashboardEnabled: true
    })
  })
})
