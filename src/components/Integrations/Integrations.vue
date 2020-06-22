<template>
  <div id="integrations">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
    >
      <new-integration
        :showModal="modalStatus"
        @closeOverlay="changeModalStatus"
        :integrationId="integrationId"
      />
    </v-overlay>
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
      @handleEdit="handleEdit"
      @disable="handleDisable"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportIntegrationList"
      @sortChangedEvent="sortChangedEvent($event)"
      @paginationChangedEvent="paginationChangedEvent($event)"
      @searchChangedEvent="searchChangedEvent($event)"
      :dataLength="tableData && tableData.totalNumberOfRecords"
      :requestParams="bodyData"
      :isServerSide="false"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import {
  deleteIntegration,
  disableIntegration,
  exportReportedEmails,
  getIntegrationList,
  getIntegrationDetails,
  updateIntegration
} from '../../api/integrations'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'

export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration
  },
  data() {
    return {
      integrationId: null,
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
            fixed: 'left',
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
            label: 'Date Created',
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
            action: 'handleEdit'
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
          action: 'addAction',
          tooltip: 'Add Integration'
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
      this.getDatatableList()
    },
    paginationChangedEvent({ pageSize, pageNumber }) {
      this.bodyData = {
        ...this.bodyData,
        pageSize: pageSize,
        pageNumber: pageNumber,
        totalNumberOfRecords: this.tableData.totalNumberOfRecords
      }
      this.getDatatableList()
    },
    searchChangedEvent({ filter }) {
      this.bodyData = { ...this.bodyData, filter }
      this.getDatatableList()
    },
    handleDelete(row) {
      deleteIntegration(row.resourceId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Integration has been deleted successfully!'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when deleting integration!'
          })
        })
    },
    handleEdit(row) {
      this.modalStatus = true
      this.integrationId = row.resourceId
    },
    handleDisable(row) {
      disableIntegration(row.resourceId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Integration has been disabled successfully!'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when disable integration!'
          })
        })
    },
    handleAdd() {},
    changeModalStatus(status, restart) {
      this.integrationId = null
      this.modalStatus = status
      if (restart) this.getDatatableList()
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: 1,
          pageSize: 3,
          orderBy: 'Name',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportReportedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `users.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    getDatatableList() {
      getIntegrationList(this.bodyData)
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.tableData = data.results || []
          this.bodyData.pageNumber = data.pageNumber
          this.bodyData.pageSize = data.pageSize
          this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
          console.log(this.tableData.totalNumberOfRecords)
          this.$refs.refIntegrationsList.loadWithDataArray(data.results || [], this.bodyData)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting the integrations!'
          })
        })
    }
  },
  mounted() {
    this.getDatatableList()
  }
}
</script>

<style></style>
