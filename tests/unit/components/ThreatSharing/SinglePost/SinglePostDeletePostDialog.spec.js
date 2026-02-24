import { shallowMount } from '@vue/test-utils'
import SinglePostDeletePostDialog from '@/components/ThreatSharing/SinglePost/SinglePostDeletePostDialog.vue'
import { deleteCommunityPost } from '@/api/threatSharing'

jest.mock('@/api/threatSharing', () => ({
  deleteCommunityPost: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SinglePostDeletePostDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SinglePostDeletePostDialog, {
      propsData: {
        status: true,
        deleteIncidentName: 'Test Incident',
        deleteIncidentCommunityName: 'Test Community',
        deleteIncidentId: 'post-1',
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

  it('displays delete incident name in subtitle', () => {
    const wrapper = createWrapper()
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('subtitle')).toBe('Test Incident')
  })

  it('body contains community name', () => {
    const wrapper = createWrapper()
    const dialog = wrapper.find('appdialog-stub')
    expect(dialog.attributes('body')).toContain('Test Community')
  })

  it('handleClose emits on-close with false', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')[0]).toEqual([false])
  })

  it('handleDeletePost calls deleteCommunityPost and emits on-delete', async () => {
    const wrapper = createWrapper()

    wrapper.vm.handleDeletePost()
    await flushPromises()

    expect(deleteCommunityPost).toHaveBeenCalledWith('post-1')
    expect(wrapper.emitted('on-delete')).toBeTruthy()
    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})
