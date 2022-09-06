<template>
  <AppDialog
    title-id="text--training-report-audience-details-popup-title"
    subtitle-id="text--training-report-audience-details-popup-subtitle"
    maxHeightSize="665"
    :custom-size="getModalSize"
    :icon="CONSTANTS.icon"
    :title="getTitle"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        v-if="isFromUserGroups"
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        is-server-side
        no-padding-bottom
        :show-filter-options="false"
        :is-settings-popup="false"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :server-side-props="serverSideProps"
        :server-side-events="tableOptions.serverSideEvents"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
      >
        <template v-slot:datatable-custom-column="{ scope }">
          <span
            v-if="scope.column.property === 'groupName'"
            class="datatable-link"
            @click="handleGroupNameClick(scope.row)"
          >
            {{ scope.row.groupName }}
          </span>
        </template>
      </DataTable>
      <template v-if="isFromPhishingCampaign">
        <div class="training-report-summary-audience-details__body-title">
          <span class="training-report-summary-audience-details__body-campaign-name">
            {{ getCampaignName }}
          </span>
          <span class="datatable-link" @click="handleViewReportClick">
            View Report <v-icon color="#2196F3" size="20">mdi-open-in-new</v-icon>
          </span>
        </div>
        <p class="training-report-summary-audience-details__body-description">
          {{ getCampaignDescription }}
        </p>
        <span class="training-report-summary-audience-details__body-criteria-title">
          Selected Criteria
        </span>
        <div class="training-report-summary-audience-details__body-criteria-badges">
          <div
            v-for="criteria in getCriteria"
            :key="criteria"
            class="training-report-summary-audience-details__body-criteria-badge"
          >
            {{ criteria }}
          </div>
        </div>
      </template>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn class="pa-0 k-dialog__button" text color="#2196f3" @click="handleClose"
          >CLOSE
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import DataTable from '@/components/DataTable'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'TrainingReportSummaryAudienceDetails',
  components: { DataTable, AppDialog },
  mixins: [useLoading],
  props: {
    status: {
      type: Boolean
    },
    userGroups: {
      type: Object
    },
    phishingCampaign: {
      type: Object
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'training-report-summary-audience-details',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'groupName',
            align: 'left',
            editable: false,
            label: 'Group Name',
            fixed: 'left',
            sortable: true,
            show: true,
            type: 'slot',
            filterableType: 'text',
            width: 150
          },
          {
            property: 'userCount',
            align: 'left',
            editable: false,
            label: 'Users',
            sortable: true,
            show: true,
            type: 'number',
            width: 100
          },
          {
            property: 'priority',
            align: 'left',
            editable: false,
            label: 'Priority',
            sortable: true,
            show: true,
            type: 'priority',
            width: 150,
            filterableType: 'select',
            filterableItems: ['Very High', 'Very Low', 'High', 'Low']
          },
          {
            property: 'type',
            align: 'right',
            editable: false,
            label: 'Type',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            filterableType: 'select',
            filterableItems: ['User Group', 'Smart Group']
          },
          {
            property: 'tags',
            align: 'right',
            editable: false,
            label: 'Tags',
            sortable: true,
            show: true,
            type: 'textArray',
            filterableType: 'text',
            width: 150,
            hasTooltip: true
          },
          {
            property: 'dateCreated',
            align: 'left',
            editable: false,
            label: 'Date Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: labels.EmptyCampaignManagerReportOpenedDetail
        },
        rowActions: [],
        downloadButton: {
          show: false
        }
      },
      tableData: [
        {
          groupName: 'Sales Department',
          userCount: 215,
          priority: 'Very High',
          type: 'User Group',
          tags: ['tag'],
          dateCreated: '05.09.2019'
        },
        {
          groupName: 'Failed Phishing in 2 months',
          userCount: 5,
          priority: 'Very Low',
          type: 'Smart Group',
          tags: ['tag'],
          dateCreated: '05.09.2019'
        },
        {
          groupName: 'Had 2 training',
          userCount: 45,
          priority: 'High',
          type: 'Smart Group',
          tags: ['tag'],
          dateCreated: '05.09.2019'
        },
        {
          groupName: 'Executives',
          userCount: 70,
          priority: 'Very High',
          type: 'User Group',
          tags: ['tag'],
          dateCreated: '05.09.2019'
        },
        {
          groupName: 'Test group',
          userCount: 70,
          priority: 'Low',
          type: 'User Group',
          tags: ['tag'],
          dateCreated: '05.09.2019'
        }
      ]
    }
  },
  computed: {
    getTitle() {
      return 'Audience Details'
    },
    getSubtitle() {
      return this.type === 'userGroups' ? 'By User Groups' : 'By Campaign'
    },
    getModalSize() {
      return this.type === 'userGroups' ? '1000' : '480'
    },
    isFromUserGroups() {
      return this.type === 'userGroups'
    },
    isFromPhishingCampaign() {
      return this.type === 'phishingCampaign'
    },
    getCampaignName() {
      return this.phishingCampaign?.name || 'Campaign Name'
    },
    getCampaignDescription() {
      return (
        this.phishingCampaign?.description ||
        'Erat nec pellentesque non amet amet ultrices at ut. Tempus, sit accumsan cras mauris arcu hendrerit. '
      )
    },
    getCriteria() {
      return (
        this.phishingCampaign?.criteria || ['Clicked', 'Submitted Data', 'Reported', 'Opened Email']
      )
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {},
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === this.CONSTANTS.ascending
      this.axiosPayload.orderBy = prop
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      const filterItems = searchFilter.filter.FilterGroups[0].FilterItems.filter((filterItem) => {
        const column = this.tableOptions.columns.find(
          (col) => col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
        return column.filterableType
      })
      this.axiosPayload.filter.FilterGroups[1].FilterItems = [...filterItems]
      this.resetPageNumber()
      this.callForData()
    },
    handleClose() {
      this.$emit('close')
    },
    handleViewReportClick() {
      let routeData = this.$router.resolve(
        `/reports/campaign-reports/campaign-report/${this.phishingCampaign.resourceId}`
      )
      window.open(routeData.href, '_blank')
    },
    handleGroupNameClick() {
      // Open target user group page in a new tab
    }
  }
}
</script>
