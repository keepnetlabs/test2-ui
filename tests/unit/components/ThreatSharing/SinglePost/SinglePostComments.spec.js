import { shallowMount } from '@vue/test-utils'
import SinglePostComments from '@/components/ThreatSharing/SinglePost/SinglePostComments.vue'
import * as threatSharingApi from '@/api/threatSharing'

jest.mock('@/api/threatSharing', () => ({
  getComments: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  createComments: jest.fn(() => Promise.resolve()),
  deleteComments: jest.fn(() => Promise.resolve()),
  updateComments: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('SinglePostComments.vue', () => {
  const defaultPost = {
    communityPostResourceId: 'post-1',
    communityResourceId: 'comm-1'
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(SinglePostComments, {
      propsData: {
        post: { ...defaultPost },
        commentOpened: false,
        seeComments: false,
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn(() => Promise.resolve()),
          getters: {
            'permissions/getThreatSharingCreateCommentPermission': true,
            'permissions/getThreatSharingEditCommentPermission': true,
            'permissions/getThreatSharingDeleteCommentPermission': true
          }
        }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        PostCardLoading: true,
        InputEntityName: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('calls getComments on mount', async () => {
    createWrapper()
    await flushPromises()
    expect(threatSharingApi.getComments).toHaveBeenCalledWith('post-1')
  })

  it('canDeleteOrEditComment returns getEditCommentPermission for update', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.canDeleteOrEditComment('update')).toBe(true)
  })

  it('canDeleteOrEditComment returns getDeleteCommentPermission for delete', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.canDeleteOrEditComment('delete')).toBe(true)
  })

  it('editRelativeComment toggles isEdit and sets commentValue', () => {
    const wrapper = createWrapper()
    const comment = { isEdit: false, comment: 'Original', commentValue: '', resourceId: 'c1' }
    wrapper.vm.editRelativeComment(comment)
    expect(comment.isEdit).toBe(true)
    expect(comment.commentValue).toBe('Original')
  })

  it('deleteComment sets deleteCommentId and isWantToDeleteComment', () => {
    const wrapper = createWrapper()
    const comment = { resourceId: 'c1' }
    wrapper.vm.deleteComment(comment)
    expect(wrapper.vm.deleteCommentId).toBe('c1')
    expect(wrapper.vm.isWantToDeleteComment).toBe(true)
  })
})
