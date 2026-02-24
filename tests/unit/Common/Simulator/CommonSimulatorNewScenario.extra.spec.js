import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario.vue'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'

describe('CommonSimulatorNewScenario.vue (extra branch coverage)', () => {
  describe('computed', () => {
    it('getSelectedRolesText returns "Not selected" when no roles', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: [],
        formValues: { roleResourceIds: [] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('Not selected')
    })

    it('getSelectedRolesText returns "1 role" when single role', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: [],
        formValues: { roleResourceIds: ['r1'] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('1 role')
    })

    it('getSelectedRolesText returns joined names when selectedRoleNames has values', () => {
      const ctx = {
        isPhishing: true,
        selectedRoleNames: ['Admin', 'Finance'],
        formValues: { roleResourceIds: [] }
      }
      expect(
        CommonSimulatorNewScenario.computed.getSelectedRolesText.call(ctx)
      ).toBe('Admin, Finance')
    })

    it('maxStep returns 3 when attachment based', () => {
      const ctx = { isAttachmentBasedScenario: true }
      expect(CommonSimulatorNewScenario.computed.maxStep.call(ctx)).toBe(3)
    })

    it('maxStep returns 4 when not attachment based', () => {
      const ctx = { isAttachmentBasedScenario: false }
      expect(CommonSimulatorNewScenario.computed.maxStep.call(ctx)).toBe(4)
    })

    it('isAttachmentBasedScenario returns false when methodTypeId is not 3', () => {
      const ctx = {
        isAttachmentBased: undefined,
        isEdit: false,
        isDuplicate: false,
        isFetched: true,
        formValues: { methodTypeId: '1' }
      }
      expect(
        CommonSimulatorNewScenario.computed.isAttachmentBasedScenario.call(ctx)
      ).toBe(false)
    })

    it('isAttachmentBasedScenario returns false when formValues.methodTypeId is undefined', () => {
      const ctx = {
        isAttachmentBased: undefined,
        isEdit: false,
        formValues: {}
      }
      expect(
        CommonSimulatorNewScenario.computed.isAttachmentBasedScenario.call(ctx)
      ).toBe(false)
    })

    it('getScenarioInfoItems includes Quishing Type when isQuishing', () => {
      const ctx = {
        isQuishing: true,
        isPhishing: false,
        formValues: { name: 'X', methodTypeId: '1' },
        getDifficultyType: 'Easy',
        getMethodText: 'Click',
        categoryText: '',
        quishingType: 'Individual'
      }
      const result = CommonSimulatorNewScenario.computed.getScenarioInfoItems.call(ctx)
      expect(result['Quishing Type']).toBe('Individual')
      expect(result['Category']).toBeUndefined()
    })

    it('getModalTitle returns correct strings for phishing new/edit/duplicate', () => {
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: false
        })
      ).toBe('New Phishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: true,
          isDuplicate: true
        })
      ).toBe('Duplicate Phishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.PHISHING,
          isEdit: true,
          isDuplicate: false
        })
      ).toBe('Edit Phishing Scenario')
    })

    it('getModalTitle returns correct strings for quishing new/edit/duplicate', () => {
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.QUISHING,
          isEdit: false
        })
      ).toBe('New Quishing Scenario')
      expect(
        CommonSimulatorNewScenario.computed.getModalTitle.call({
          type: SCENARIO_TYPES.QUISHING,
          isEdit: true,
          isDuplicate: true
        })
      ).toBe('Duplicate Quishing Scenario')
    })
  })
})
