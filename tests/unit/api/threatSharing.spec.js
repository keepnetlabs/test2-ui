jest.mock('@/utils/testRequest', () => ({
  get: jest.fn().mockResolvedValue({}),
  post: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
}))

jest.mock('@/utils/uploadRequest', () => ({
  post: jest.fn().mockResolvedValue({})
}))

import testRequest from '@/utils/testRequest'
import uploadRequest from '@/utils/uploadRequest'
import { COMMON_SNACKBAR } from '@/model/constants/commonConstants'
import * as threatSharingApi from '@/api/threatSharing'

// Mock localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'companyRequestId' || key === 'companyId') {
        return 'test-company-id'
      }
      return null
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true,
  configurable: true
})

describe('threatSharing API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue('test-company-id')
  })

  describe('community operations', () => {
    it('should call getAllCommunityList', async () => {
      const payload = { page: 1 }
      await threatSharingApi.getAllCommunityList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('communities/search/all', payload)
    })

    it('should call getMyCommunityList', async () => {
      const payload = { page: 1 }
      await threatSharingApi.getMyCommunityList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('communities/search/my', payload)
    })

    it('should call createCommunity', async () => {
      const payload = { name: 'New Community' }
      await threatSharingApi.createCommunity(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'communities',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateCommunity', async () => {
      const id = 'community-123'
      const payload = { name: 'Updated Community' }
      await threatSharingApi.updateCommunity(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `communities/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCommunityDetails', async () => {
      const id = 'community-123'
      await threatSharingApi.getCommunityDetails(id)
      expect(testRequest.get).toHaveBeenCalledWith(`communities/${id}`)
    })

    it('should call deleteCommunity', async () => {
      const id = 'community-123'
      await threatSharingApi.deleteCommunity(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `communities/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call joinCommunity', async () => {
      const id = 'community-123'
      await threatSharingApi.joinCommunity(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/join`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('community membership operations', () => {
    it('should call getCommunityMembers', async () => {
      const id = 'community-123'
      const payload = { page: 1 }
      await threatSharingApi.getCommunityMembers(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/member`,
        payload
      )
    })

    it('should call getCommunityMembersRequest', async () => {
      const id = 'community-123'
      const payload = { page: 1 }
      await threatSharingApi.getCommunityMembersRequest(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/membershiprequest`,
        payload
      )
    })

    it('should call acceptCommunityMembershipRequest', async () => {
      const id = 'request-123'
      const payload = { approved: true }
      await threatSharingApi.acceptCommunityMembershipRequest(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `communities/membershiprequest/${id}/accept`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call refuseCommunityMembershipRequest', async () => {
      const id = 'request-123'
      const payload = { reason: 'Not approved' }
      await threatSharingApi.refuseCommunityMembershipRequest(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `communities/membershiprequest/${id}/refuse`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeFromCommunity', async () => {
      const id = 'community-123'
      const value = 'user-123'
      await threatSharingApi.removeFromCommunity(id, value)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `communities/${id}/remove-member`,
        {
          data: { RemovedCompanyResourceId: value },
          snackbar: COMMON_SNACKBAR
        }
      )
    })
  })

  describe('community post operations', () => {
    it('should call createCommunityPost', async () => {
      const payload = { title: 'New Post', content: 'Content' }
      await threatSharingApi.createCommunityPost(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        'community-posts',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getCommunityPost', async () => {
      const id = 'post-123'
      await threatSharingApi.getCommunityPost(id)
      expect(testRequest.get).toHaveBeenCalledWith(`community-posts/${id}`)
    })

    it('should call deleteCommunityPost', async () => {
      const id = 'post-123'
      await threatSharingApi.deleteCommunityPost(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `community-posts/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call likePost', async () => {
      const id = 'post-123'
      await threatSharingApi.likePost(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `community-posts/${id}/like`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call shareAPost', async () => {
      const id = 'post-123'
      const payload = { communities: ['community-1'] }
      await threatSharingApi.shareAPost(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `community-posts/${id}/share`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('community post content operations', () => {
    it('should call getCommunityPostPreview', async () => {
      const id = 'post-123'
      await threatSharingApi.getCommunityPostPreview(id)
      expect(testRequest.get).toHaveBeenCalledWith(`community-posts/${id}/preview`)
    })

    it('should call getCommunityPostEditableData', async () => {
      const id = 'post-123'
      await threatSharingApi.getCommunityPostEditableData(id)
      expect(testRequest.get).toHaveBeenCalledWith(`community-posts/${id}/edit`)
    })

    it('should call getMyLastPosts', async () => {
      await threatSharingApi.getMyLastPosts()
      expect(testRequest.get).toHaveBeenCalledWith('community-posts/my-last-posts')
    })

    it('should call getMyTopPosts', async () => {
      await threatSharingApi.getMyTopPosts()
      expect(testRequest.get).toHaveBeenCalledWith('community-posts/top-posts', {})
    })
  })

  describe('comment operations', () => {
    it('should call getComments', async () => {
      const id = 'post-123'
      await threatSharingApi.getComments(id)
      expect(testRequest.get).toHaveBeenCalledWith(`community-posts/${id}/comments`)
    })

    it('should call createComments', async () => {
      const id = 'post-123'
      const payload = { text: 'Nice post' }
      await threatSharingApi.createComments(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `community-posts/${id}/comments`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateComments', async () => {
      const id = 'comment-123'
      const payload = { text: 'Updated comment' }
      await threatSharingApi.updateComments(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `community-posts/comments/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call deleteComments', async () => {
      const id = 'comment-123'
      await threatSharingApi.deleteComments(id)
      expect(testRequest.delete).toHaveBeenCalledWith(
        `community-posts/comments/${id}`,
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('email and incident operations', () => {
    it('should call searchNotifiedMail', async () => {
      const payload = { page: 1 }
      await threatSharingApi.searchNotifiedMail(payload)
      expect(testRequest.post).toHaveBeenCalledWith('notified-emails/search', payload)
    })

    it('should call getSelectedEmailPreview', async () => {
      const id = 'email-123'
      await threatSharingApi.getSelectedEmailPreview(id)
      expect(testRequest.get).toHaveBeenCalledWith('/community-posts/notified-email-preview/' + id)
    })

    it('should call getIncidentList', async () => {
      const payload = { page: 1 }
      await threatSharingApi.getIncidentList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('community-posts/search', payload)
    })

    it('should call getCOmmunityIncidentList', async () => {
      const id = 'community-123'
      const payload = { page: 1 }
      await threatSharingApi.getCOmmunityIncidentList(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `community-posts/search/${id}`,
        payload
      )
    })
  })

  describe('file upload operations', () => {
    it('should call uploadEmlOrMsg', async () => {
      const file = new File(['test'], 'test.eml')
      const onUploadProgress = jest.fn()
      await threatSharingApi.uploadEmlOrMsg(file, onUploadProgress)
      expect(uploadRequest.post).toHaveBeenCalledWith(
        'community-posts/message-file-preview',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress
        })
      )
    })
  })

  describe('invitation and request operations', () => {
    it('should call getInvitations', async () => {
      await threatSharingApi.getInvitations()
      expect(testRequest.get).toHaveBeenCalledWith('communities/my-invitations', {})
    })

    it('should call getInvitationCount', async () => {
      await threatSharingApi.getInvitationCount()
      expect(testRequest.get).toHaveBeenCalledWith('communities/my-invitations-count', {})
    })

    it('should call acceptInvitation', async () => {
      const id = 'invitation-123'
      await threatSharingApi.acceptInvitation(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/communities/invitations/${id}/accept`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call refuseInvitation', async () => {
      const id = 'invitation-123'
      await threatSharingApi.refuseInvitation(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/communities/invitations/${id}/decline`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call inviteToCommunity', async () => {
      const id = 'community-123'
      const payload = { emails: ['user@example.com'] }
      await threatSharingApi.inviteToCommunity(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/invite`,
        payload
      )
    })
  })

  describe('lookup operations', () => {
    it('should call listBusinessCategories', async () => {
      await threatSharingApi.listBusinessCategories()
      expect(testRequest.get).toHaveBeenCalledWith('lookups/2')
    })

    it('should call listThreatCategories', async () => {
      await threatSharingApi.listThreatCategories()
      expect(testRequest.get).toHaveBeenCalledWith('lookups/9')
    })
  })

  describe('other operations', () => {
    it('should call parseEmail', async () => {
      const payload = { url: 'https://example.com/email' }
      await threatSharingApi.parseEmail(payload)
      expect(testRequest.post).toHaveBeenCalledWith('community-posts/parse-email-url', payload)
    })

    it('should call updateCommunityPost', async () => {
      const id = 'post-123'
      const payload = { content: 'Updated' }
      await threatSharingApi.updateCommunityPost(id, payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        `community-posts/${id}`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call removeFromCommunities', async () => {
      const id = 'community-123'
      await threatSharingApi.removeFromCommunities(id)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/leave`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call appointNewOwner', async () => {
      const id = 'community-123'
      const payload = { userId: 'user-123' }
      await threatSharingApi.appointNewOwner(id, payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        `communities/${id}/appoint-owner`,
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call updateNotifications', async () => {
      const payload = { enabled: true }
      await threatSharingApi.updateNotifications(payload)
      expect(testRequest.put).toHaveBeenCalledWith(
        '/system-users/notification-setting',
        payload,
        { snackbar: COMMON_SNACKBAR }
      )
    })

    it('should call getsuggestedCommunities', async () => {
      await threatSharingApi.getsuggestedCommunities()
      expect(testRequest.get).toHaveBeenCalledWith(
        '/communities/suggested',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-IR-COMPANY-ID': 'test-company-id'
          })
        })
      )
    })

    it('should call cancelRequest', async () => {
      const id = 'request-123'
      await threatSharingApi.cancelRequest(id)
      expect(testRequest.put).toHaveBeenCalledWith(
        `/communities/membershiprequest/${id}/cancel`,
        {},
        { snackbar: COMMON_SNACKBAR }
      )
    })
  })

  describe('HTTP method consistency', () => {
    it('should use GET for read operations', async () => {
      const id = 'community-123'
      await threatSharingApi.getCommunityDetails(id)
      expect(testRequest.get).toHaveBeenCalled()
    })

    it('should use POST for search and create', async () => {
      const payload = { page: 1 }
      await threatSharingApi.getAllCommunityList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should use PUT for updates', async () => {
      const id = 'community-123'
      const payload = { name: 'Updated' }
      await threatSharingApi.updateCommunity(id, payload)
      expect(testRequest.put).toHaveBeenCalled()
    })

    it('should use DELETE for deletes', async () => {
      await threatSharingApi.deleteCommunity('community-123')
      expect(testRequest.delete).toHaveBeenCalled()
    })
  })

  describe('snackbar consistency', () => {
    it('should use COMMON_SNACKBAR for mutations', async () => {
      const payload = { name: 'New' }
      await threatSharingApi.createCommunity(payload)
      expect(testRequest.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.objectContaining({ snackbar: COMMON_SNACKBAR })
      )
    })
  })

  describe('edge cases', () => {
    it('should handle community creation with description', async () => {
      const payload = {
        name: 'Threat Sharing Community',
        description: 'Share and discuss threats',
        category: 'security'
      }
      await threatSharingApi.createCommunity(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })

    it('should handle file upload with progress tracking', async () => {
      const file = new File(['content'], 'email.eml', { type: 'text/plain' })
      const progressCallback = jest.fn()
      await threatSharingApi.uploadEmlOrMsg(file, progressCallback)
      expect(uploadRequest.post).toHaveBeenCalled()
    })

    it('should handle bulk community operations', async () => {
      const payload = {
        page: 1,
        filters: { status: ['active'], created: { start: '2024-01-01', end: '2024-12-31' } }
      }
      await threatSharingApi.getAllCommunityList(payload)
      expect(testRequest.post).toHaveBeenCalled()
    })
  })

  describe('return values', () => {
    it('all functions should return thenables', async () => {
      expect(typeof threatSharingApi.getAllCommunityList({}).then).toBe('function')
      expect(typeof threatSharingApi.getMyCommunityList({}).then).toBe('function')
      expect(typeof threatSharingApi.createCommunity({}).then).toBe('function')
      expect(typeof threatSharingApi.getCommunityDetails('id').then).toBe('function')
      expect(typeof threatSharingApi.uploadEmlOrMsg(new File([], '')).then).toBe('function')
    })
  })

  describe('All Exported Functions', () => {
    it('should export 44+ functions', () => {
      const functions = Object.values(threatSharingApi).filter(x => typeof x === 'function')
      expect(functions.length).toBeGreaterThan(40)
    })
  })

  describe('Integration Workflows', () => {
    it('should handle community creation and membership workflow', async () => {
      testRequest.post.mockClear()
      await threatSharingApi.createCommunity({ name: 'Community' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await threatSharingApi.joinCommunity('community-1')
      expect(testRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await threatSharingApi.getCommunityMembers('community-1', {})
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle threat intel sharing workflow', async () => {
      uploadRequest.post.mockClear()
      const file = new File(['content'], 'threat.eml')
      await threatSharingApi.uploadEmlOrMsg(file)
      expect(uploadRequest.post).toHaveBeenCalledTimes(1)

      testRequest.post.mockClear()
      await threatSharingApi.createCommunityPost({ title: 'Threat' })
      expect(testRequest.post).toHaveBeenCalledTimes(1)
    })

    it('should handle parallel community operations', async () => {
      const results = await Promise.all([
        threatSharingApi.getAllCommunityList({}),
        threatSharingApi.getMyCommunityList({}),
        threatSharingApi.getInvitations()
      ])

      expect(results).toHaveLength(3)
      expect(testRequest.post).toHaveBeenCalledTimes(2)
      expect(testRequest.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Parameter Handling', () => {
    it('should handle complex search payloads', async () => {
      const payload = {
        page: 1,
        pageSize: 50,
        filters: { status: ['active'], type: 'email' }
      }
      await threatSharingApi.getAllCommunityList(payload)
      expect(testRequest.post).toHaveBeenCalledWith('communities/search/all', payload)
    })

    it('should handle file uploads with callbacks', async () => {
      const file = new File(['content'], 'file.eml')
      const onProgress = jest.fn()
      await threatSharingApi.uploadEmlOrMsg(file, onProgress)
      expect(uploadRequest.post).toHaveBeenCalled()
    })

    it('should handle localStorage integration', async () => {
      localStorage.getItem.mockReturnValue('custom-company-id')
      await threatSharingApi.getsuggestedCommunities()
      expect(localStorage.getItem).toHaveBeenCalledWith('companyRequestId')
    })
  })

  describe('Error Handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(threatSharingApi.getAllCommunityList({})).rejects.toThrow('API Error')

      testRequest.get.mockRejectedValueOnce(error)
      await expect(threatSharingApi.getCommunityDetails('id')).rejects.toThrow('API Error')

      testRequest.delete.mockRejectedValueOnce(error)
      await expect(threatSharingApi.deleteCommunity('id')).rejects.toThrow('API Error')
    })

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed')
      uploadRequest.post.mockRejectedValueOnce(error)
      const file = new File([], 'test.eml')
      await expect(threatSharingApi.uploadEmlOrMsg(file)).rejects.toThrow('Upload failed')
    })

    it('should handle community operation errors', async () => {
      const error = new Error('Community operation failed')
      testRequest.post.mockRejectedValueOnce(error)
      await expect(threatSharingApi.createCommunity({})).rejects.toThrow('Community operation failed')

      testRequest.put.mockRejectedValueOnce(error)
      await expect(threatSharingApi.updateCommunity('id', {})).rejects.toThrow('Community operation failed')
    })
  })
})
