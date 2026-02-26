jest.mock('@/api/threatSharing', () => ({
  deleteCommunity: jest.fn(() => Promise.resolve()),
  getCommunityDetails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getMyLastPosts: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getMyTopPosts: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getsuggestedCommunities: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  joinCommunity: jest.fn(() => Promise.resolve()),
  removeFromCommunities: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  isOwner: jest.fn((statusId) => statusId === 1)
}))

import RightColumn from '@/components/ThreatSharing/RightColumn/RightColumn.vue'
import { joinCommunity } from '@/api/threatSharing'

describe('RightColumn.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAllRightColumnData calls all data loaders', () => {
    const ctx = {
      getCommunityDetails: jest.fn(),
      getMyLastPosts: jest.fn(),
      getMyTopPosts: jest.fn(),
      getsuggestedCommunities: jest.fn()
    }
    RightColumn.methods.getAllRightColumnData.call(ctx)
    expect(ctx.getCommunityDetails).toHaveBeenCalled()
    expect(ctx.getMyLastPosts).toHaveBeenCalled()
    expect(ctx.getMyTopPosts).toHaveBeenCalled()
    expect(ctx.getsuggestedCommunities).toHaveBeenCalled()
  })

  it('createNewCommunity emits createCommunityAction', () => {
    const ctx = {
      selectedTab: 0,
      $parent: { $refs: { tsIncidents: { incidentList: [] } } },
      $store: { dispatch: jest.fn() },
      $emit: jest.fn()
    }
    const r = ctx.$parent.$refs.tsIncidents
    r.search = ''
    r.companyValue = ''
    r.threats = []
    r.page = 1
    r.totalNumberOfRecords = 0
    r.totalNumberOfPages = 0
    r.itemsPerPage = 10

    RightColumn.methods.createNewCommunity.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('createCommunityAction')
    expect(ctx.$store.dispatch).toHaveBeenCalled()
  })

  it('joinCommunity private flow emits success without route push', async () => {
    const ctx = {
      isJoinCommunityButtonDisabled: false,
      getsuggestedCommunities: jest.fn(),
      $parent: { $refs: {} },
      $store: { dispatch: jest.fn() },
      $route: { name: 'Threat Sharing' },
      $router: { push: jest.fn() },
      $emit: jest.fn()
    }

    RightColumn.methods.joinCommunity.call(ctx, {
      resourceId: 'c1',
      communityName: 'Com',
      privacyStatusName: 'Private'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(joinCommunity).toHaveBeenCalledWith('c1')
    expect(ctx.$emit).toHaveBeenCalledWith('joinRequestSuccess')
    expect(ctx.$router.push).not.toHaveBeenCalled()
    expect(ctx.isJoinCommunityButtonDisabled).toBe(false)
  })

  it('isOwnerOfTheCommunity returns false when not owner', () => {
    const ctx = { communityDetails: { myMembershipStatusId: 2 } }
    expect(RightColumn.methods.isOwnerOfTheCommunity.call(ctx)).toBe(false)
  })
})
