import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

/**
 * Adds the "Email Role" (Lure / Payload) column to a campaign report user table, but only
 * for Double Barrel campaigns. Mix into any report user-table component that keeps its
 * columns in `tableOptions.columns`.
 *
 * Barrel awareness comes from the parent view (CampaignManagerReport.vue) via a reactive
 * provide/inject (`reportBarrelState`), so the intermediate wrapper components don't need
 * to forward any prop.
 */
export default {
  inject: {
    reportBarrelState: {
      default: () => ({ isBarrel: false })
    }
  },
  computed: {
    isBarrelReportColumnVisible() {
      return !!(this.reportBarrelState && this.reportBarrelState.isBarrel)
    }
  },
  watch: {
    isBarrelReportColumnVisible: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.syncBarrelEmailRoleColumn())
      }
    }
  },
  methods: {
    syncBarrelEmailRoleColumn() {
      const columns = this.tableOptions && this.tableOptions.columns
      if (!Array.isArray(columns)) return
      const existingIndex = columns.findIndex((col) => col.property === 'barrelEmailRole')
      if (this.isBarrelReportColumnVisible && existingIndex === -1) {
        const anchorIndex = columns.findIndex(
          (col) => col.property === COLUMNS.PHISHING_SCENARIO_NAME.property
        )
        const insertAt = anchorIndex === -1 ? columns.length : anchorIndex + 1
        columns.splice(insertAt, 0, { ...COLUMNS.BARREL_EMAIL_ROLE })
      } else if (!this.isBarrelReportColumnVisible && existingIndex !== -1) {
        columns.splice(existingIndex, 1)
      }
    }
  }
}
