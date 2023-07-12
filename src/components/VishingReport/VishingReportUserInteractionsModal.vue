<template>
  <AppDialog
    class="vishing-report-user-interactions-modal"
    title-id="text--vishing-report-user-interactions-popup-title"
    subtitle-id="text--vishing-report-user-interactions-popup-subtitle"
    maxHeightSize="665"
    :title="labels.AllInteractions"
    :custom-size="'800'"
    :icon="CONSTANTS.icon"
    :subtitle="getSubtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DataTable
        :id="CONSTANTS.id"
        ref="refTable"
        is-server-side
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
        :server-side-events="tableOptions.serverSideEvents"
        :server-side-props="serverSideProps"
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
                  {{ getStatusBadgeProps(scope.row.status).text }}

                  <v-tooltip v-if="getCanRenderTooltip(scope.row)" right :max-width="230">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        class="ml-2"
                        :color="getStatusBadgeProps(scope.row.status).color"
                        size="21"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <span class="tooltip-span">
                      {{ getTooltipContent(scope.row) }}
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
      serverSideProps: new ServerSideProps('', false, 5),
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'CallDate', pageSize: 5 }),
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
    getCanRenderTooltip(row = {}) {
      if (
        row?.status === 'NotResponded' &&
        row?.answeredBy &&
        row?.answeredBy === 'Answered By A Machine'
      ) {
        return true
      }
      return !!(
        row?.status === 'Answered' &&
        row?.answeredBy &&
        row?.answeredBy !== 'Answered By A Human'
      )
    },
    getTooltipContent(row = {}) {
      if (row?.status === 'NotResponded') {
        return labels.AnsweredByMachineTooltipText
      }
      if (row?.status === 'Answered') {
        return labels.AnsweredByUnknownTooltipText
      }
      return ''
    },
    callForData() {
      this.setLoading(true)
      const payload = {
        ...this.axiosPayload,
        resourceId: this.item.resourceId
      }
      if (
        payload.filter.FilterGroups[1].FilterItems.length &&
        payload.filter.FilterGroups[1].FilterItems.some(
          (field) => field.FieldName === 'CallDuration'
        )
      ) {
        const fieldIndex = payload.filter.FilterGroups[1].FilterItems.findIndex(
          (field) => field.FieldName === 'CallDuration'
        )
        if (fieldIndex !== -1) payload.filter.FilterGroups[1].FilterItems.splice(fieldIndex, 1)
      }
      getVishingReportUsersInteractions(payload)
        .then((response) => {
          this.tableData = response?.data?.data?.results || []
        })
        .finally(this.setLoading)
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
