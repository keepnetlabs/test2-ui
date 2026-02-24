import CommonSimulatorFastLaunchStep1 from '@/components/Common/Simulator/CommonSimulatorFastLaunchStep1.vue'

describe('CommonSimulatorFastLaunchStep1.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getDisabledStatusOfRandomlySelected returns true when sendRandomlyUsers is false', () => {
      const ctx = {
        formData: { sendRandomlyUsers: false }
      }
      expect(
        CommonSimulatorFastLaunchStep1.computed.getDisabledStatusOfRandomlySelected.call(ctx)
      ).toBe(true)
    })

    it('getDisabledStatusOfRandomlySelected returns false when sendRandomlyUsers is true', () => {
      const ctx = {
        formData: { sendRandomlyUsers: true }
      }
      expect(
        CommonSimulatorFastLaunchStep1.computed.getDisabledStatusOfRandomlySelected.call(ctx)
      ).toBe(false)
    })

    it('getRandomlySelectedItems returns empty when formDetails is null', () => {
      const ctx = { formDetails: null }
      expect(
        CommonSimulatorFastLaunchStep1.computed.getRandomlySelectedItems.call(ctx)
      ).toEqual([])
    })

    it('getRandomlySelectedItems returns empty when formDetails has no sendRandomlyUsersCalculateTypes', () => {
      const ctx = { formDetails: {} }
      expect(
        CommonSimulatorFastLaunchStep1.computed.getRandomlySelectedItems.call(ctx)
      ).toEqual([])
    })

    it('getRandomlySelectedItems returns items when formDetails has sendRandomlyUsersCalculateTypes', () => {
      const items = [{ text: 'Percent', value: '1' }]
      const ctx = { formDetails: { sendRandomlyUsersCalculateTypes: items } }
      expect(
        CommonSimulatorFastLaunchStep1.computed.getRandomlySelectedItems.call(ctx)
      ).toEqual(items)
    })
  })
})
