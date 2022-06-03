<template>
  <DataTable
    ref="refTable"
    :id="CONSTANTS.id"
    :class="{ 'ml-n4': isLoading }"
    selectable
    filterable
    options
    is-server-side
    row-key="displayName"
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
    @handleSelectionChange="handleSelectionChange"
  />
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import useDefaultTableFunctions from '@/hooks/useDefaultTableFunctions'
import LDAPService from '@/api/ldap'
export default {
  name: 'TargetUserLDAPImportTable',
  components: { DataTable },
  mixins: [useLoading, useDefaultTableFunctions],
  inject: ['resourceId'],
  data() {
    return {
      CONSTANTS: {
        id: 'target-user-ldap-import-data-table'
      },
      axiosPayload: getDefaultAxiosPayload({ orderBy: 'displayName' }),
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
            property: 'displayName',
            align: 'left',
            editable: false,
            label: labels.GroupName,
            fixed: false,
            show: true,
            sortable: false,
            hideSort: true,
            type: 'text',
            filterableType: 'text',
            filterableCustomFieldName: 'DisplayName',
            width: 240
          },
          {
            property: 'count',
            align: 'left',
            editable: false,
            label: labels.TargetUsers,
            fixed: false,
            sortable: false,
            hideSort: true,
            show: true,
            type: 'number',
            emptyText: 0
          }
        ],
        iEmpty: {
          message: labels.EmptyLDAP
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
    callForData() {
      this.setLoading(true)
      LDAPService.searchADGroups({ ...this.axiosPayload, lDAPSettingId: this.resourceId })
        .then((response) => {
          const {
            data: {
              data: { results, totalNumberOfRecords, totalNumberOfPages, pageNumber }
            }
          } = response
          this.serverSideProps.totalNumberOfRecords = totalNumberOfRecords
          this.serverSideProps.totalNumberOfPages = totalNumberOfPages
          this.serverSideProps.pageNumber = pageNumber
          this.tableData = results || []
        })
        .finally(this.setLoading)
    },
    handleSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    }
  }
}
</script>
