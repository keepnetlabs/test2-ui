import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups.vue'

describe('CampaignManagerTargetGroups.vue (extra branch coverage)', () => {
  describe('getContainerStyle', () => {
    it('returns empty object when isValid is true', () => {
      expect(
        CampaignManagerTargetGroups.computed.getContainerStyle.call({ isValid: true })
      ).toEqual({})
    })

    it('returns border style when isValid is false', () => {
      expect(
        CampaignManagerTargetGroups.computed.getContainerStyle.call({ isValid: false })
      ).toEqual({ border: '1px solid #ff5252 !important' })
    })
  })

  describe('getTargetGroupUsersTableRenderStatus', () => {
    it('returns true when refGroupTable has tableData', () => {
      const ctx = {
        $refs: {
          refGroupTable: { tableData: [{ id: 1 }], $refs: {} }
        }
      }
      expect(CampaignManagerTargetGroups.methods.getTargetGroupUsersTableRenderStatus.call(ctx)).toBe(
        true
      )
    })

    it('returns inverse of isColumnFilterActive when tableData empty', () => {
      const ctx = {
        $refs: {
          refGroupTable: {
            tableData: [],
            $refs: { refTable: { isColumnFilterActive: false } }
          }
        }
      }
      expect(CampaignManagerTargetGroups.methods.getTargetGroupUsersTableRenderStatus.call(ctx)).toBe(
        true
      )
    })

    it('returns true when refGroupTable is undefined', () => {
      const ctx = { $refs: {} }
      expect(CampaignManagerTargetGroups.methods.getTargetGroupUsersTableRenderStatus.call(ctx)).toBe(
        true
      )
    })
  })

  describe('addRowClassName', () => {
    it('returns disabled class when lastColumnName is phoneNumber and row has no phoneNumber', () => {
      const ctx = { lastColumnName: 'phoneNumber' }
      expect(
        CampaignManagerTargetGroups.methods.addRowClassName.call(ctx, {
          row: { phoneNumber: '' }
        })
      ).toBe('k-table-row--disabled')
    })

    it('returns empty string when lastColumnName is phoneNumber and row has phoneNumber', () => {
      const ctx = { lastColumnName: 'phoneNumber' }
      expect(
        CampaignManagerTargetGroups.methods.addRowClassName.call(ctx, {
          row: { phoneNumber: '+123' }
        })
      ).toBe('')
    })

    it('returns empty string when lastColumnName is not phoneNumber', () => {
      const ctx = { lastColumnName: 'email' }
      expect(
        CampaignManagerTargetGroups.methods.addRowClassName.call(ctx, { row: {} })
      ).toBe('')
    })
  })
})
