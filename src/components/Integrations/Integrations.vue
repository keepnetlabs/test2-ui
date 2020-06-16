<template>
  <div id="integrations">
    <new-integration :showModal="modalStatus" @closeOverlay="changeModalStatus" />
    <data-table
      id="integrationsList"
      ref="refIntegrationsList"
      :refName="'integrationsList'"
      :columns="tableOptions.columns"
      :countRow="5"
      :selectable="true"
      :filterable="true"
      :options="true"
      :sizeable="true"
      :row-actions="tableOptions.rowActions"
      :pageSizes="tableOptions.pageSizes"
      :empty="tableOptions.empty"
      :addButton="tableOptions.addButton"
      @deleteAction="handleDelete"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
      @sortChangedEvent="sortChangedEvent($event)"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @searchChangedEvent="searchChangedEvent($event)"
      :dataLength="tableData && tableData.totalNumberOfRecords"
      :requestParams="bodyData"
      :isServerSide="true"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import { getIntegrationList } from '../../api/integrations'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration
  },
  data() {
    return {
      tableData: [],
      tableOptions: {
        columns: [
          {
            property: 'name',
            align: 'left',
            editable: false,
            label: 'Integration Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: true,
            width: 250
            //minWidth: 80
          },
          {
            property: 'description',
            align: 'left',
            editable: false,
            label: 'Description',
            sortable: true,
            show: true,
            type: 'text',
            width: 350
            //minWidth: 80
          },
          {
            property: 'status',
            align: 'center',
            editable: false,
            label: 'Status',
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true
            //minWidth: 80
          },
          {
            property: 'createDate',
            align: 'left',
            editable: false,
            label: 'Created',
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300
            //minWidth: 80
          }
        ],
        rowActions: [
          {
            name: 'Edit',
            icon: 'mdi-pencil',
            action: 'edit'
          },
          {
            name: 'Disable',
            icon: 'mdi-minus-circle-outline',
            action: 'disable'
          },
          {
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        empty: {
          message: 'No integrations are showing',
          subMes: 'Add Integrations',
          btn: 'Add Integrations',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addAction'
        }
      },
      modalStatus: false,
      bodyData: {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'createDate',
        ascending: false
      }
    }
  },
  methods: {
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.refIntegrationsList.loadWithDataArray(_this.tableData.data, this.bodyData)
      })
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      const _this = this
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.refIntegrationsList.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      const _this = this
      this.$store.dispatch('investigations/getInvestigationList', this.bodyData).finally(() => {
        this.$refs.refIntegrationsList.loadWithDataArray(_this.tableData.data, _this.bodyData)
      })
    },
    handleDelete() {},
    handleAdd() {},
    exportIntegrationList() {},
    changeModalStatus(status) {
      this.modalStatus = status
    }
  },
  mounted() {
    getIntegrationList(this.bodyData)
      .then((response) => {
        const {
          data: { data, status }
        } = response
        this.tableData = data.results || []
        this.bodyData.pageNumber = data.pageNumber
        this.bodyData.pageSize = data.pageSize
        this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
        this.$refs.refIntegrationsList.loadWithDataArray(data.results || [])
      })
      .catch((error) => {
        this.$store.dispatch('common/createSnackBar', {
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          message: 'Error when getting the Investigations!'
        })
      })
  }
}
</script>

<style></style>
