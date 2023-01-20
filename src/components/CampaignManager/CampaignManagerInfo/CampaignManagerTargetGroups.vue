<template>
  <div
    style="padding-right: 120px;"
    :class="[
      'campaign-manager-target-groups',
      { 'campaign-manager-target-groups--empty': isTargetGroupEmpty }
    ]"
  >
    <div class="campaign-manager-target-groups-card" :style="getContainerStyle">
      <div class="campaign-manager-target-groups-card__header">
        <v-text-field
          v-model.trim="search"
          ref="searchInput"
          id="input--campaign-manager-target-groups-search"
          class="k-list-preview-search"
          hide-details
          placeholder="Search"
          outlined
          prepend-inner-icon="mdi-magnify"
        />
      </div>
      <div class="campaign-manager-target-groups-card__content">
        <Multipane class="vertical-panes" layout="vertical">
          <div
            class="pane"
            :style="{
              width: isTargetGroupEmpty || !getTargetGroupUsersTableRenderStatus() ? '100%' : '60%',
              minWidth: '50%'
            }"
          >
            <CampaignManagerTargetGroupsTable
              ref="refGroupTable"
              :empty.sync="isTargetGroupEmpty"
              :is-loading.sync="isTargetGroupLoading"
              :response-of-target-groups-items="responseOfTargetGroupsItems"
              :search="search"
              :is-all-groups="isAllGroups"
              :is-show-company-column="isShowCompanyColumn"
              @on-highlighted-row-change="handleHiglightedRowChange"
              @handle-selection-change="$emit('handle-selection-change', $event)"
            />
          </div>
          <MultipaneResizer></MultipaneResizer>
          <div
            v-if="!isTargetGroupEmpty && getTargetGroupUsersTableRenderStatus()"
            class="pane"
            :style="{
              width: '40%',
              minWidth: '25%'
            }"
          >
            <CampaignManagerTargetGroupUsersTable
              class="ml-4"
              :is-target-group-empty="isTargetGroupEmpty"
              :is-target-group-loading="isTargetGroupLoading"
              :resourceId="highlightedRow.resourceId"
              :group-name="highlightedRow.name"
              :last-column-name="lastColumnName"
              :add-row-class-name="addRowClassName"
            />
          </div>
        </Multipane>
      </div>
    </div>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import CampaignManagerTargetGroupsTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupsTable'
import CampaignManagerTargetGroupUsersTable from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroupUsersTable'

export default {
  name: 'CampaignManagerTargetGroups',
  components: {
    CampaignManagerTargetGroupUsersTable,
    CampaignManagerTargetGroupsTable,
    Multipane,
    MultipaneResizer
  },
  props: {
    selectedTargetGroups: {
      type: Array
    },
    responseOfTargetGroupsItems: {
      type: Object
    },
    isValid: {
      type: Boolean
    },
    isAllGroups: {
      type: Boolean,
      default: false
    },
    isShowCompanyColumn: {
      type: Boolean,
      default: true
    },
    lastColumnName: {
      type: String,
      default: 'email'
    }
  },
  data() {
    return {
      search: '',
      highlightedRow: {},
      isTargetGroupEmpty: false,
      isTargetGroupLoading: true,
      timeout: null
    }
  },
  computed: {
    getContainerStyle() {
      return !this.isValid ? { border: '1px solid #ff5252 !important' } : {}
    }
  },
  watch: {
    search(val) {
      this.debounce(() => {
        this.$refs.refGroupTable.searchChangedFilter(
          [
            { FieldName: 'Name', Operator: 'Contains', Value: val },
            { FieldName: 'Priority', Operator: 'Contains', Value: val },
            { FieldName: 'CreateTime', Operator: 'Contains', Value: val },
            { FieldName: 'CompanyName', Operator: 'Contains', Value: val }
          ],
          val
        )
      }, 500)
    }
  },
  methods: {
    getTargetGroupUsersTableRenderStatus() {
      const { refGroupTable } = this.$refs
      let renderStatus = true
      if (refGroupTable) {
        renderStatus = refGroupTable.tableData.length
          ? true
          : !refGroupTable?.$refs?.refTable?.isColumnFilterActive
      }
      return renderStatus
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    handleHiglightedRowChange(row) {
      this.highlightedRow = row
    },
    addRowClassName({ row = {} }) {
      if (this.lastColumnName === 'phoneNumber') {
        return !!row.phoneNumber ? '' : 'k-table-row--disabled'
      }
      return ''
    }
  }
}
</script>
