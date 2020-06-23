<template>
  <div id="clients" class="clients">
    <new-clients :showModal="modalStatus" :clientId="clientId" @closeOverlay="changeModalStatus" />
    <v-overlay fixed :opacity="0.46" :value="isWantToDelete" :z-index="999">
      <v-card light class="download-card pb-4 pa-6" style="max-width: 580px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-alert</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline"
              >Are You Sure To Delete This Client
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <p>Do you want to delete emails or move to trash?</p>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap justify-space-between flex-row">
          <div>
            <v-btn class="pa-0" text color="#f56c6c" @click="isWantToDelete = false">CANCEL </v-btn>
          </div>
          <div class="d-flex flex-row flex-end">
            <v-btn class="pa-0" text color="#2196f3" @click="isWantToDeleteConfirm(true)"
              >Delete Client
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-overlay>
    <data-table
      id="clientList"
      ref="refClientList"
      :refName="'clientList'"
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
      @handleEdit="handleEdit"
      @onEmptyBtnClicked="onEmptyBtnClicked"
      @deleteAction="handleDelete"
      @addAction="changeModalStatus(true)"
      @downloadEvent="exportClientList"
    />
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewClients from './NewClients'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'
import { getClientList, exportClientList, deleteClient } from '../../api/clients'
export default {
  name: 'Clients',
  components: {
    DataTable,
    NewClients
  },
  data() {
    return {
      isWantToDelete: false,
      clientId: null,
      tableOptions: {
        columns: [
          {
            property: PROPERTY_STORE.COMPANYNAME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.COMPANYNAME),
            sortable: true,
            show: true,
            type: 'text',
            width: 230
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.APIKEY,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.APIKEY),
            sortable: true,
            show: true,
            type: 'text',
            width: 350
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 175
            //minWidth: 80
          },
          {
            property: PROPERTY_STORE.DATECREATED,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DATECREATED),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 160,
            hasTooltip: true
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
            name: 'Delete',
            icon: 'mdi-delete',
            action: 'deleteAction'
          }
        ],
        pageSizes: [5, 10, 25, 50, 100],
        empty: {
          message: 'No Clients are showing',
          subMes: 'Add Clients',
          btn: 'Add Clients',
          icon: 'mdi-account-plus'
        },

        addButton: {
          show: true,
          action: 'addAction'
        }
      },
      modalStatus: false
    }
  },
  methods: {
    handleEdit(row) {
      this.modalStatus = true
      this.clientId = row.resourceId
    },
    handleDelete(row) {
      this.isWantToDelete = true
      this.deletedClientId = row.resourceId
    },
    isWantToDeleteConfirm() {
      deleteClient(this.deletedClientId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Client has been deleted successfully!'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when deleting client!'
          })
        })
      this.isWantToDelete = false
    },
    handleAdd() {},
    exportClientList({ exportTypes, reportAllPages, pageNumber }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: 1,
          pageSize: 3,
          orderBy: 'Name',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType
        }
        exportClientList(payload)
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
    changeModalStatus(status) {
      this.modalStatus = status
    },
    onEmptyBtnClicked() {
      this.modalStatus = true
    },
    getDatatableList() {
      getClientList(this.bodyData)
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.tableData = data.results || []
          this.bodyData.pageNumber = data.pageNumber
          this.bodyData.pageSize = data.pageSize
          this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
          this.$refs.refClientList.loadWithDataArray(data.results || [], this.bodyData)
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting clients!'
          })
        })
    }
  },
  mounted() {
    this.$refs.refClientList.loadWithDataArray([
      {
        companyName: 'Dunder Mifflin Paper Co.',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Active',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 1
      },
      {
        companyName: 'Sabre Electronics',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Active',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 2
      },
      {
        companyName: 'Company name',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Stopped',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 3
      },
      {
        companyName: 'Company name',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Stopped',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 4
      },
      {
        companyName: 'Company name',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Active',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 5
      },
      {
        companyName: 'Company name',
        apiKey: '432a6103-192d-4310-9499-ccad2f827844',
        status: 'Active',
        dateCreated: '2020-06-18 02:14:05',
        resourceId: 6
      }
    ])
    this.getDatatableList()
  }
}
</script>

<style lang="scss"></style>
