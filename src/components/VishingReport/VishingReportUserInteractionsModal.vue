<template>
  <AppDialog
    class="vishing-report-user-interactions-modal"
    title-id="text--vishing-report-user-interactions-popup-title"
    subtitle-id="text--vishing-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :title="labels.AllInteractions"
    :custom-size="'1000'"
    :icon="CONSTANTS.icon"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        selectable
        filterable
        options
        no-padding-bottom
        :show-filter-options="false"
        :is-settings-popup="false"
        :loading="isLoading"
        :table="tableData"
        :columns="tableOptions.columns"
        :empty="tableOptions.iEmpty"
        :row-actions="tableOptions.rowActions"
        :add-button="tableOptions.addButton"
        :download-button="tableOptions.downloadButton"
        :axios-payload.sync="axiosPayload"
        :count-row="5"
        @columnFilterChanged="columnFilterChanged"
        @columnFilterCleared="columnFilterCleared"
        @server-side-page-number-changed="serverSidePageNumberChanged"
        @server-side-size-changed="serverSideSizeChanged"
        @sortChangedEvent="sortChanged"
        @searchChangedEvent="handleSearchChange"
        @refreshAction="callForData"
      >
        <template v-slot:datatable-custom-column="{ scope, col }">
          <div class="vishing-report-users-interactions__interaction-column">
            <v-btn style="display: none;" />
            <Badge v-bind="getStatusBadgeProps(scope.row.status)" :col="col" size="medium">
              <template #content>
                <div class="d-flex align-center">
                  {{ scope.row.status }}

                  <v-tooltip
                    v-if="scope.row.status === 'Not Responded' && scope.row.isAnsweredByMachine"
                    right
                    :max-width="230"
                    :disabled="!scope.row.isAnsweredByMachine"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="ml-2" color="#757575" size="21">
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <span class="tooltip-span">
                      {{ labels.AnsweredByMachineTooltipText }}
                    </span>
                  </v-tooltip>
                </div>
              </template>
            </Badge>
          </div>
        </template>
      </DataTable>
    </template>
    <template #app-dialog-footer>
      <div class="d-flex" style="justify-content: flex-end;">
        <v-btn
          id="btn--action-vishing-report-user-intractions-modal"
          class="pa-0 k-dialog__button"
          text
          color="#2196f3"
          @click="handleClose"
        >
          {{ labels.Close }}
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
import { getDefaultAxiosPayload } from '@/utils/functions'
import { useLoading } from '@/hooks/useLoading'
import { getStatusBadgeProps } from '@/components/VishingReport/utils'
import Badge from '@/components/Badge'
import { getVishingReportUsersInteractions } from '@/api/vishing'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'

export default {
  name: 'VishingReportUserInteractionsModal',
  components: { DataTable, AppDialog, Badge },
  mixins: [useLoading, useDefaultTableFunctions],
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      CONSTANTS: {
        icon: 'mdi-text-box',
        id: 'vishing-report-user-interactions-data-table',
        ascending: 'ascending'
      },
      serverSideProps: new ServerSideProps(),
      axiosPayload: getDefaultAxiosPayload(),
      tableOptions: {
        serverSideEvents: { pagination: true, search: true, sort: true },
        columns: [
          {
            property: 'status',
            align: 'center',
            fixed: 'left',
            editable: false,
            label: labels.Status,
            show: true,
            type: 'slot',
            props: {
              style: {
                maxWidth: '150px !important'
              }
            },
            hideSort: true
          },
          {
            property: 'callDate',
            align: 'right',
            fixed: false,
            editable: false,
            label: labels.CallDate,
            show: true,
            type: 'date',
            hideSort: true
          },
          {
            property: 'callDuration',
            align: 'center',
            fixed: 'right',
            editable: false,
            label: labels.CallDuration,
            show: true,
            type: 'text',
            hideSort: true
          }
        ],
        addButton: {
          show: false
        },
        iEmpty: {
          message: `No details for the user who hasn’t responded yet`
        },
        rowActions: [],
        downloadButton: {
          show: false
        }
      },
      tableData: []
    }
  },
  computed: {
    getSubtitle() {
      return `${this.item?.firstName || ''} ${this.item?.lastName || ''}`
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    getStatusBadgeProps(status) {
      return getStatusBadgeProps(status)
    },
    callForData() {
      this.setLoading(true)
      getVishingReportUsersInteractions(this.axiosPayload.filter, this.item.resourceId)
        .then((response) => {
          this.tableData = response?.data || []
        })
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
