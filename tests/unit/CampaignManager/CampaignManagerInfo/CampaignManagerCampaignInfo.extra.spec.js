jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn().mockResolvedValue({ data: { data: { results: [], totalNumberOfPages: 1 } } }),
  createTargetGroup: jest.fn().mockResolvedValue({ data: { data: { resourceId: 'new-id' } } })
}))

import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo.vue'
import { getDefaultAxiosPayload } from '@/utils/functions'

const { searchTargetGroups } = require('@/api/targetUsers')
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerCampaignInfo.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('noTargetGroupText returns Loading when isTargetGroupsLoading', () => {
      expect(
        CampaignManagerCampaignInfo.computed.noTargetGroupText.call({
          isTargetGroupsLoading: true
        })
      ).toBe('Loading...')
    })

    it('noTargetGroupText returns fallback when not loading', () => {
      expect(
        CampaignManagerCampaignInfo.computed.noTargetGroupText.call({
          isTargetGroupsLoading: false
        })
      ).toBe('No target group available')
    })

    it('getHyperPersonalizationItems returns mapped items', () => {
      const ctx = {
        formDetails: {
          sendUserPreferredLanguageTypes: [
            { value: '0', text: 'Manual' },
            { value: '1', text: 'Preferred' }
          ]
        },
        getItemTitle: CampaignManagerCampaignInfo.methods.getItemTitle
      }
      const items = CampaignManagerCampaignInfo.computed.getHyperPersonalizationItems.call(ctx)
      expect(items).toHaveLength(2)
      expect(items[0].value).toBe('0')
      expect(items[0].text).toBe('Send in a manually selected language')
      expect(items[1].text).toBe("Send in the target users' preferred language")
    })

    it('getHyperPersonalizationItems returns undefined when formDetails missing', () => {
      const items = CampaignManagerCampaignInfo.computed.getHyperPersonalizationItems.call({})
      expect(items).toBeUndefined()
    })
  })

  describe('getItemTitle', () => {
    it('returns manual text for value 0', () => {
      expect(CampaignManagerCampaignInfo.methods.getItemTitle.call({}, '0')).toBe(
        'Send in a manually selected language'
      )
    })

    it('returns preferred text for other values', () => {
      expect(CampaignManagerCampaignInfo.methods.getItemTitle.call({}, '1')).toBe(
        "Send in the target users' preferred language"
      )
    })
  })

  describe('setTargetGroups', () => {
    it('maps response data to targetGroupList', () => {
      const ctx = { targetGroups: [] }
      CampaignManagerCampaignInfo.methods.setTargetGroups.call(ctx, {
        data: {
          data: {
            results: [
              { name: 'Group 1', resourceId: 'r1' },
              { name: 'Group 2', resourceId: 'r2' }
            ]
          }
        }
      })
      expect(ctx.targetGroupList).toEqual([
        { name: 'Group 1', resourceId: 'r1' },
        { name: 'Group 2', resourceId: 'r2' }
      ])
    })

    it('handles response with empty data', () => {
      const ctx = { targetGroups: [] }
      CampaignManagerCampaignInfo.methods.setTargetGroups.call(ctx, {
        data: { data: { results: [] } }
      })
      expect(ctx.targetGroupList).toEqual([])
    })
  })

  describe('searchTargetGroups', () => {
    it('calls callForTargetGroups when search is empty', () => {
      const callForTargetGroups = jest.fn()
      const ctx = {
        callForTargetGroups,
        targetGroupPayload: {},
        isTargetGroupsLoading: false
      }
      CampaignManagerCampaignInfo.methods.searchTargetGroups.call(ctx, '')
      expect(callForTargetGroups).toHaveBeenCalled()
    })

    it('calls API with search payload when query is non-empty', async () => {
      jest.clearAllMocks()
      const ctx = {
        targetGroupPayload: getDefaultAxiosPayload(),
        targetGroups: [],
        isTargetGroupsLoading: true
      }
      ctx.setTargetGroups = CampaignManagerCampaignInfo.methods.setTargetGroups.bind(ctx)
      CampaignManagerCampaignInfo.methods.searchTargetGroups.call(ctx, 'acme')
      await flushPromises()
      expect(searchTargetGroups).toHaveBeenCalled()
      expect(ctx.targetGroupList).toEqual([])
    })
  })

  describe('callForTargetGroups pagination', () => {
    it('returns early without fetching when next page is past total pages', () => {
      jest.clearAllMocks()
      const ctx = {
        targetGroupPayload: { pageNumber: 2 },
        totalNumberOfPagesOfTargetGroups: 2,
        isTargetGroupsLoading: false
      }
      CampaignManagerCampaignInfo.methods.callForTargetGroups.call(ctx, true)
      expect(searchTargetGroups).not.toHaveBeenCalled()
    })
  })

  describe('target group modal helpers', () => {
    it('handleCreateGroup opens modal when ref chain is missing', () => {
      const ctx = { isTargetGroupModalVisible: false, $refs: {} }
      CampaignManagerCampaignInfo.methods.handleCreateGroup.call(ctx)
      expect(ctx.isTargetGroupModalVisible).toBe(true)
    })

    it('handleCloseTargetGroupModal hides modal', () => {
      const ctx = { isTargetGroupModalVisible: true }
      CampaignManagerCampaignInfo.methods.handleCloseTargetGroupModal.call(ctx)
      expect(ctx.isTargetGroupModalVisible).toBe(false)
    })
  })

  describe('watchers', () => {
    it('clickedUserGroupResourceId emits smartGroupSelected null when val falsy', () => {
      const emit = jest.fn()
      CampaignManagerCampaignInfo.watch.clickedUserGroupResourceId.handler.call(
        { $emit: emit, targetGroupList: [] },
        null
      )
      expect(emit).toHaveBeenCalledWith('smartGroupSelected', null)
    })

    it('clickedUserGroupResourceId emits smartGroupSelected when val matches group', () => {
      const emit = jest.fn()
      const targetGroupList = [{ resourceId: 'r1', name: 'Group 1' }]
      CampaignManagerCampaignInfo.watch.clickedUserGroupResourceId.handler.call(
        { $emit: emit, targetGroupList },
        'r1'
      )
      expect(emit).toHaveBeenCalledWith('smartGroupSelected', { resourceId: 'r1', name: 'Group 1' })
    })

    it('clickedUserGroupResourceId does not emit smartGroupSelected when id is not in list', () => {
      const emit = jest.fn()
      CampaignManagerCampaignInfo.watch.clickedUserGroupResourceId.handler.call(
        { $emit: emit, targetGroupList: [{ resourceId: 'r1', name: 'Group 1' }] },
        'missing-id'
      )
      expect(emit).toHaveBeenCalledWith('update:clickedUserGroupResourceId', 'missing-id')
      expect(emit).not.toHaveBeenCalledWith('smartGroupSelected', expect.anything())
    })

    it('initialClickedUserGroupResourceId sets payload and loads groups when val is set', () => {
      const callForTargetGroups = jest.fn()
      const ctx = {
        targetGroupPayload: { selectTargetUserResourceIds: [] },
        callForTargetGroups
      }
      CampaignManagerCampaignInfo.watch.initialClickedUserGroupResourceId.handler.call(
        ctx,
        'user-res-1'
      )
      expect(ctx.targetGroupPayload.selectTargetUserResourceIds).toBe('user-res-1')
      expect(callForTargetGroups).toHaveBeenCalled()
    })

    it('defaultValues handler returns early when val is falsy', () => {
      const ctx = { formData: {} }
      CampaignManagerCampaignInfo.watch.defaultValues.handler.call(ctx, null)
      expect(Object.keys(ctx.formData)).toHaveLength(0)
    })
  })
})
