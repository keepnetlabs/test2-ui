import CampaignManagerPrintoutCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerPrintoutCampaignInfo.vue'

describe('CampaignManagerPrintoutCampaignInfo.vue', () => {
  describe('data rules validations', () => {
    let rules

    beforeEach(() => {
      rules = CampaignManagerPrintoutCampaignInfo.data().rules
    })

    it('validates name strictly', () => {
      const requiredNameRule = rules.name[0]
      const startsWithSpaceNameRule = rules.name[1]
      const maxLengthNameRule = rules.name[2]

      // Empty/Null returns string or boolean depending on abstract rule definition wrapper.
      expect(typeof requiredNameRule('Test')).toBe('boolean')
      expect(requiredNameRule('Test')).toBe(true)
      
      // Starts with space rule
      expect(typeof startsWithSpaceNameRule(' Test')).toBe('string')
      expect(startsWithSpaceNameRule('Test')).toBe(true)

      // Max length validation
      expect(typeof maxLengthNameRule('Test')).toBe('boolean')
    })

    it('validates select strictly', () => {
      const selectRequiredRule = rules.select[0]
      const selectStartsWithSpaceRule = rules.select[1]

      // Array emptiness (dropdowns usually emit arrays)
      expect(typeof selectRequiredRule([])).toBe('string')
      expect(selectRequiredRule([1])).toBe(true)

      // Starts with space on string selections
      expect(typeof selectStartsWithSpaceRule(' test')).toBe('string')
      expect(selectStartsWithSpaceRule('test')).toBe(true)
    })
  })
})
