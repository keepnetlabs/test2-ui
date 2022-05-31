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
    />
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
export default {
  name: 'LDAPScheduledSyncsTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  data() {
    return {
      CONSTANTS: {
        id: 'target-user-ldap-import-manually-data-table'
      },
      axiosPayload: getDefaultAxiosPayload(),
      tableData: [],
      serverSideProps: new ServerSideProps(),
      tableOptions: {
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            label: labels.GroupName,
            fixed: 'left',
            sortable: true,
            show: true,
            width: '160'
          },
          {
            property: PROPERTY_STORE.TARGET_USERS,
            align: 'right',
            editable: false,
            label: labels.TargetUsers,
            fixed: false,
            sortable: true,
            show: true,
            type: 'number',
            filterableType: 'number',
            emptyText: 0
          }
        ],
        iEmpty: {
          message: labels.EmptyTargetUsersPeople
        },
        addButton: {
          show: false
        },
        downloadButton: {
          show: false
        },
        rowActions: [],
        serverSideEvents: { pagination: true, search: true, sort: true }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {}
  }
}
</script>
