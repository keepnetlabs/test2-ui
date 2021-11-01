<template>
  <div
    style="padding-right: 120px;"
    :class="[
      'campaign-manager-target-groups',
      { 'campaign-manager-target-groups--empty': isTargetGroupEmpty }
    ]"
  >
    <div class="campaign-manager-target-groups-card">
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
              :groupName="highlightedRow.name"
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
import { getMyCompanies } from '@/api/company'

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
    getFilterButtonDisabled() {
      return !Boolean(this.filterChecked.length)
    }
  },
  watch: {
    search(val) {
      this.debounce(() => {
        this.$refs.refGroupTable.tableOptions.isColumnFilterActive = !!val.length
        this.$refs.refGroupTable.searchChangedFilter([
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Priority', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val },
          { FieldName: 'CompanyName', Operator: 'Contains', Value: val }
        ])
      }, 500)
    }
  },
  methods: {
    getTargetGroupUsersTableRenderStatus() {
      const { refGroupTable } = this.$refs
      return refGroupTable
        ? refGroupTable.tableData.length
          ? true
          : !refGroupTable.tableOptions.isColumnFilterActive
        : true
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
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-target-groups {
  &--empty {
    .campaign-manager-target-groups-card__header {
      pointer-events: none;
      opacity: 0.5;
    }
    #campaign-manager-target-groups-data-table {
      height: 100%;
      .v-card {
        height: 100%;
      }
      .table-wrapper {
        box-shadow: none !important;
      }
    }
  }
  &-card {
    background: #ffffff;
    box-shadow: 0px 3px 1px -2px rgba(80, 80, 80, 0.12), 0px 2px 2px rgba(80, 80, 80, 0.14),
      0px 1px 5px rgba(80, 80, 80, 0.2);
    border-radius: 20px;
    &__header {
      display: flex;
      padding: 24px 0 16px 16px;
      border-bottom: 1px solid #e0e0e0;
    }
  }
  &__input-company {
    max-width: 139px;
    .v-icon {
      cursor: pointer;
    }
  }
  &__input-search {
    max-width: 200px;
  }
  &__menu {
    .filter__body-container {
      background-color: white;
      padding: 20px 20px 0 20px;
      position: relative;
    }
    .filter__footer {
      display: flex;
      justify-content: flex-end;
      position: sticky;
      padding-right: 8px;
      padding-bottom: 4px;
      bottom: 0;
      background-color: white;

      &-button {
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        line-height: 1.71;
        letter-spacing: normal;
      }
    }
  }
}
.campaign-manager-target-groups-radio {
  .v-radio label {
    color: #383b41;
    font-weight: 400;
  }
}
</style>
