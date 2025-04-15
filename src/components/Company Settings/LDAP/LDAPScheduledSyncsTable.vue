<template>
  <div>
    <DataTable
      :id="CONSTANTS.id"
      ref="refTable"
      selectable
      filterable
      options
      is-server-side
      :loading="isLoading"
      :show-filter-options="false"
      :is-settings-popup="false"
      :table="tableData"
      :columns="tableOptions.columns"
      :empty="tableOptions.iEmpty"
      :server-side-props="serverSideProps"
      :server-side-events="tableOptions.serverSideEvents"
      :select-event="tableOptions.selectEvent"
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
      @editAction="handleEdit"
      @deleteAction="handleDelete"
    >
      <template #datatable-custom-column="{ scope }">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>{{ scope.row.name }}</span>
          <v-tooltip bottom v-if="scope.row.errorMessage">
            <template #activator="{ on }">
              <v-icon v-on="on" color="#f56c6c" size="medium">mdi-alert-circle</v-icon>
            </template>
            <span>{{ scope.row.errorMessage }}</span>
          </v-tooltip>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import LDAPService from '@/api/ldap'
export default {
  name: 'LDAPScheduledSyncsTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'target-user-ldap-scheduled-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: false,
          download: false
        },
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: labels.Name,
            fixed: 'left',
            sortable: true,
            show: true,
            filterableType: 'text',
            type: 'slot',
            width: '160'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            label: labels.Status,
            fixed: false,
            sortable: true,
            show: true,
            type: 'badge',
            width: 180,
            filterableType: 'select',
            filterableItems: ['Active', { text: 'Passive', value: 'Passive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            label: labels.CreateTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'date'
          },
          {
            property: PROPERTY_STORE.LASTRUNTIME,
            align: 'left',
            label: labels.LastRunTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 180,
            isEditable: true,
            filterableType: 'date'
          },
          {
            property: 'nextRunTime',
            align: 'left',
            label: labels.NextRunTime,
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 165,
            isEditable: true,
            filterableType: 'date'
          }
        ],
        iEmpty: {
          message: labels.EmptyScheduledSyncs
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'editAction',
            id: 'btn-edit--ldap-scheduled-syncs-row-actions',
            disabled: !this.$store.getters['permissions/getLDAPScheduleUpdatePermission']
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction',
            id: 'btn-delete--ldap-scheduled-syncs-row-actions',
            disabled: !this.$store.getters['permissions/getLDAPScheduleDeletePermission']
          }
        ],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      LDAPService.searchLDAPSchedule(this.axiosPayload)
        .then((response) => {
          const { totalNumberOfRecords, totalNumberOfPages, pageNumber, results } =
            response?.data?.data || {}
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    handleEdit(row) {
      this.$emit('on-edit', row)
    },
    handleDelete(row) {
      this.$emit('on-delete', row)
    },
    unSelectRow(row) {
      this.$refs.refTable.unSelectRow(row)
    }
  }
}
</script>
