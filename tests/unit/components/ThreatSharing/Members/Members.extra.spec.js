jest.mock('@/api/threatSharing', () => ({
  acceptCommunityMembershipRequest: jest.fn(() => Promise.resolve()),
  appointNewOwner: jest.fn(() => Promise.resolve()),
  getCommunityDetails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getCommunityMembers: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  getCommunityMembersRequest: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  refuseCommunityMembershipRequest: jest.fn(() => Promise.resolve()),
  removeFromCommunity: jest.fn(() => Promise.resolve())
}))

import Members from '@/components/ThreatSharing/Members/Members.vue'
import {
  appointNewOwner,
  getCommunityMembers,
  getCommunityMembersRequest,
  removeFromCommunity
} from '@/api/threatSharing'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Members.vue (branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('callForMembers routes by active tab', () => {
    const tabMembersCtx = {
      tab: 0,
      getMembers: jest.fn(),
      getRequestMembers: jest.fn()
    }
    const tabRequestsCtx = {
      tab: 1,
      getMembers: jest.fn(),
      getRequestMembers: jest.fn()
    }

    Members.methods.callForMembers.call(tabMembersCtx)
    Members.methods.callForMembers.call(tabRequestsCtx)

    expect(tabMembersCtx.getMembers).toHaveBeenCalledTimes(1)
    expect(tabMembersCtx.getRequestMembers).not.toHaveBeenCalled()
    expect(tabRequestsCtx.getRequestMembers).toHaveBeenCalledTimes(1)
  })

  it('handleSizeChange updates itemsPerPage', () => {
    const ctx = { itemsPerPage: 5 }

    Members.methods.handleSizeChange.call(ctx, 20)

    expect(ctx.itemsPerPage).toBe(20)
  })

  it('isCommunityOwner and isOwnCompany return expected booleans', () => {
    localStorage.setItem('isCommunityOwner', 'owner')

    expect(Members.methods.isCommunityOwner.call({})).toBe(true)
    expect(Members.methods.isOwnCompany.call({}, { membershipStatusId: 1 })).toBe(true)
    expect(Members.methods.isOwnCompany.call({}, { membershipStatusId: 2 })).toBe(false)
  })

  it('appointANewOwner prepares modal state', () => {
    const ctx = {
      appointNewOwnerId: null,
      appointUserName: null,
      showAppointANewOwnerModal: false
    }

    Members.methods.appointANewOwner.call(ctx, {
      companyResourceId: 'company-1',
      companyName: 'Blue Company'
    })

    expect(ctx.appointNewOwnerId).toBe('company-1')
    expect(ctx.appointUserName).toBe('Blue Company')
    expect(ctx.showAppointANewOwnerModal).toBe(true)
  })

  it('removeFromCommunity prepares remove modal state', () => {
    const ctx = {
      removeCommunityId: null,
      removeFromCommunityUserName: null,
      showRemoveFromCommunityModal: false
    }

    Members.methods.removeFromCommunity.call(ctx, {
      companyResourceId: 'company-2',
      companyName: 'Red Company'
    })

    expect(ctx.removeCommunityId).toBe('company-2')
    expect(ctx.removeFromCommunityUserName).toBe('Red Company')
    expect(ctx.showRemoveFromCommunityModal).toBe(true)
  })

  it('appointANewOwnerConfirm resets disabled flag on success path', async () => {
    const dispatch = jest.fn(() => Promise.resolve())
    const ctx = {
      isAssignOwnerButtonDisabled: false,
      appointNewOwnerId: 'company-3',
      showAppointANewOwnerModal: true,
      getMembers: jest.fn(),
      $route: { params: { id: 'community-1' } },
      $store: { dispatch }
    }

    Members.methods.appointANewOwnerConfirm.call(ctx)
    await flushPromises()
    await new Promise((r) => setTimeout(r, 550))

    expect(appointNewOwner).toHaveBeenCalledWith('community-1', {
      AppointedCompanyResourceId: 'company-3'
    })
    expect(ctx.getMembers).toHaveBeenCalled()
    expect(ctx.showAppointANewOwnerModal).toBe(false)
    expect(ctx.isAssignOwnerButtonDisabled).toBe(false)
  })

  it('removeFromCommunityConfirm resets disabled flag on error path', async () => {
    removeFromCommunity.mockRejectedValueOnce(new Error('fail'))

    const ctx = {
      isRemoveFromCommunityButtonDisabled: false,
      removeCommunityId: 'company-5',
      getMembers: jest.fn(),
      showRemoveFromCommunityModal: true,
      $route: { params: { id: 'community-2' } },
      $store: { dispatch: jest.fn(() => Promise.resolve()) }
    }

    Members.methods.removeFromCommunityConfirm.call(ctx)
    await flushPromises()

    expect(removeFromCommunity).toHaveBeenCalledWith('community-2', 'company-5')
    expect(ctx.isRemoveFromCommunityButtonDisabled).toBe(false)
  })

  it('getMembers handles RESOURCE_NOT_FOUND and clears members', async () => {
    getCommunityMembers.mockRejectedValueOnce({
      response: { data: { code: 'RESOURCE_NOT_FOUND' } }
    })

    const ctx = {
      search: 'abc',
      membersLoading: false,
      members: [{ id: 1 }],
      $route: { params: { id: 'community-7' } }
    }

    Members.methods.getMembers.call(ctx)
    await flushPromises()

    expect(ctx.members).toEqual([])
    expect(ctx.membersLoading).toBe(false)
  })

  it('getRequestMembers does nothing when user is not owner/private', () => {
    const ctx = {
      communityDetails: { myMembershipStatusId: 2, privacyStatusId: 1 },
      requestMembers: [{ id: 1 }],
      membersLoading: false,
      search: '',
      $route: { params: { id: 'community-8' } }
    }

    Members.methods.getRequestMembers.call(ctx)

    expect(getCommunityMembersRequest).not.toHaveBeenCalled()
    expect(ctx.requestMembers).toEqual([{ id: 1 }])
  })
})
