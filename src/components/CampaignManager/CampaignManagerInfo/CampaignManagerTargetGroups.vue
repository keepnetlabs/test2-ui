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
        <div style="position: relative;">
          <v-menu
            v-model="isFilterCompanyMenuOpen"
            bottom
            min-width="232px"
            max-width="232px"
            class="filter__container"
            max-height="355px"
            z-index="201"
            content-class="campaign-manager-target-groups__menu"
            :close-on-content-click="false"
            :offset-y="true"
          >
            <template #activator="{ on }">
              <div>
                <v-text-field
                  v-on="on"
                  v-model.trim="company"
                  id="input--campaign-manager-company"
                  class="ml-4 campaign-manager-target-groups__input-company"
                  outlined
                  hide-details
                  readonly
                  autocomplete="off"
                  placeholder="Select a company to filter"
                  :append-icon="filterCompanyIcon"
                  @click:append="isFilterCompanyMenuOpen = true"
                ></v-text-field>
              </div>
            </template>
            <div class="filter__body-container">
              <div>
                <v-text-field
                  v-model="filterValue"
                  placeholder="Search"
                  class="campaign-manager-target-groups__input-search"
                  outlined
                  dense
                  height="40"
                  style="margin-top: 1px;"
                ></v-text-field>
              </div>
              <v-checkbox
                v-for="item in getCompanyItems"
                v-model="filterChecked"
                :key="item.value"
                color="#2196f3"
                :value="item.value"
                :label="item.text"
              />
            </div>
            <div class="filter__footer">
              <v-btn text class="filter__footer-button" color="#f56c6c" @click="clearFilter">
                Clear
              </v-btn>
              <v-btn
                text
                class="filter__footer-button"
                color="#2196f3"
                :disabled="getFilterButtonDisabled"
                @click="handleFilter"
              >
                Filter
              </v-btn>
            </div>
          </v-menu>
        </div>
      </div>
      <div class="campaign-manager-target-groups-card__content">
        <Multipane class="vertical-panes" layout="vertical">
          <div
            class="pane"
            :style="{
              width: isTargetGroupEmpty ? '100%' : '60%',
              minWidth: '50%'
            }"
          >
            <CampaignManagerTargetGroupsTable
              ref="refGroupTable"
              :empty.sync="isTargetGroupEmpty"
              :is-loading.sync="isTargetGroupLoading"
              @on-highlighted-row-change="highlightedRow = $event"
            />
          </div>
          <MultipaneResizer></MultipaneResizer>
          <div
            v-if="!isTargetGroupEmpty"
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
  data() {
    return {
      search: '',
      company: 'Company',
      filterCompanyIcon: 'mdi-menu-down',
      isFilterCompanyMenuOpen: false,
      filterValue: '',
      filterChecked: [],
      companyItems: [],
      highlightedRow: {},
      isTargetGroupEmpty: false,
      isTargetGroupLoading: true,
      timeout: null
    }
  },
  computed: {
    getFilterButtonDisabled() {
      return !Boolean(this.filterChecked.length)
    },
    getCompanyItems() {
      return this.filterValue
        ? this.companyItems.filter((item) => item.text.includes(this.filterValue))
        : this.companyItems
    }
  },
  watch: {
    search(val) {
      this.debounce(() => {
        this.$refs.refGroupTable.searchChangedFilter([
          { FieldName: 'Name', Operator: 'Contains', Value: val },
          { FieldName: 'Priority', Operator: 'Contains', Value: val },
          { FieldName: 'CreateTime', Operator: 'Contains', Value: val }
        ])
      }, 500)
    }
  },
  created() {
    this.callForCompanyItems()
  },
  methods: {
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    callForCompanyItems() {
      getMyCompanies().then((response) => {
        const {
          data: { data }
        } = response
        this.companyItems = data.map((item) => ({ text: item.name, value: item.resourceId }))
      })
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
</style>
