import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'

describe('CommonCampaignManagerDeleteDialog.vue (extra branching)', () => {
  const getContent = CommonCampaignManagerDeleteDialog.computed.getContent

  describe('getContent single-delete branch', () => {
    it('uses item.name when item is defined', () => {
      expect(
        getContent.call({
          isMultiple: false,
          item: { name: 'Q4 Phishing' }
        })
      ).toBe('Q4 Phishing will be deleted.')
    })

    it('stringifies missing name when item exists but name is absent', () => {
      expect(
        getContent.call({
          isMultiple: false,
          item: {}
        })
      ).toBe('undefined will be deleted.')
    })

    it('treats empty string name as falsy in template', () => {
      expect(
        getContent.call({
          isMultiple: false,
          item: { name: '' }
        })
      ).toBe(' will be deleted.')
    })
  })

  describe('getSubTitle', () => {
    it('uses userCount 0 in multiple mode', () => {
      expect(
        CommonCampaignManagerDeleteDialog.computed.getSubTitle.call({
          isMultiple: true,
          userCount: 0
        })
      ).toBe('0 campaign(s) will deleted permanently')
    })
  })
})
