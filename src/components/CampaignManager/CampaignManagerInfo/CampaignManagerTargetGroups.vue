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
              width:
                isTargetGroupEmpty || !getTargetGroupUsersTableRenderStatus()
                  ? '100%'
                  : isPhishing
                  ? '50%'
                  : '60%',
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
              :is-call-api-when-created="isCallApiWhenCreated"
              :is-show-company-column="isShowCompanyColumn"
              :isCallback="isCallback"
              :default-selected-target-group-resource-ids="defaultSelectedTargetGroupResourceIds"
              @on-highlighted-row-change="handleHiglightedRowChange"
              @handle-selection-change="$emit('handle-selection-change', $event)"
            />
          </div>
          <MultipaneResizer></MultipaneResizer>
          <div
            v-if="!isTargetGroupEmpty && getTargetGroupUsersTableRenderStatus()"
            class="pane"
            :style="{
              width: isPhishing ? '50%' : '40%',
              minWidth: '25%'
            }"
          >
            <CampaignManagerTargetGroupUsersTable
              ref="refGroupUsersTable"
              class="ml-4"
              :is-target-group-empty="isTargetGroupEmpty"
              :is-target-group-loading="isTargetGroupLoading"
              :resourceId="highlightedRow.resourceId"
              :group-name="highlightedRow.name"
              :is-smart-group="highlightedRow.isCreatedBySystem"
              :last-column-name="lastColumnName"
              :add-row-class-name="addRowClassName"
              :is-vishing="isVishing"
              :is-smishing="isSmishing"
              :is-awareness="isAwareness"
              :isMFAScenarioSelected="isMFAScenarioSelected"
              :add-phone-number-column="isAwareness"
              :add-prefferred-language-column="isPhishing"
              :scenario-resource-ids="scenarioResourceIds"
              :is-phishing="isPhishing"
              :target-group-resource-ids="targetGroupResourceIds"
              :send-user-preferred-language="sendUserPreferredLanguage"
              :scenario-distribution="scenarioDistribution"
              :category-filter="categoryFilter"
              :is-learning-path="isLearningPath"
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
import useDebounce from '@/hooks/useDebounce'
export default {
  name: 'CampaignManagerTargetGroups',
  components: {
    CampaignManagerTargetGroupUsersTable,
    CampaignManagerTargetGroupsTable,
    Multipane,
    MultipaneResizer
  },
  mixins: [useDebounce],
  props: {
    defaultSelectedTargetGroupResourceIds: {
      type: Array,
      default: () => []
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
    },
    isVishing: {
      type: Boolean,
      default: false
    },
    isCallApiWhenCreated: {
      type: Boolean,
      default: false
    },
    isSmishing: {
      type: Boolean,
      default: false
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    isAwareness: {
      type: Boolean,
      default: false
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    },
    addPhoneNumberColumn: {
      type: Boolean,
      default: false
    },
    isPhishing: {
      type: Boolean,
      default: false
    },
    targetGroupResourceIds: {
      type: Array,
      default: () => []
    },
    scenarioResourceIds: {
      type: Array,
      default: () => []
    },
    sendUserPreferredLanguage: {
      type: String,
      default: '0'
    },
    scenarioDistribution: {
      type: Number,
      default: 0
    },
    categoryFilter: {
      type: Object
    },
    isLearningPath: {
      type: Boolean,
      default: false
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
    handleHiglightedRowChange(row) {
      this.highlightedRow = row
    },
    addRowClassName({ row = {} }) {
      if (this.lastColumnName === 'phoneNumber')
        return !row.phoneNumber ? 'k-table-row--disabled' : ''
      return ''
    }
  }
}
</script>
