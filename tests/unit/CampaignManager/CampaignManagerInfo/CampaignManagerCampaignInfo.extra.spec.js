jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn().mockResolvedValue({ data: { data: { results: [], totalNumberOfPages: 1 } } }),
  createTargetGroup: jest.fn().mockResolvedValue({ data: { data: { resourceId: 'new-id' } } })
}))

import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo.vue'

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

    it('defaultValues handler returns early when val is falsy', () => {
      const ctx = { formData: {} }
      CampaignManagerCampaignInfo.watch.defaultValues.handler.call(ctx, null)
      expect(Object.keys(ctx.formData)).toHaveLength(0)
    })
  })
})
