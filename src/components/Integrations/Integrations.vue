<template>
  <div id="integrations">
    <v-overlay
      id="add-new-community-overlay"
      :value="modalStatus"
      :opacity="1"
      :z-index="99"
      color="white"
      v-if="modalStatus"
    >
      <new-integration
        :showModal="modalStatus"
        @closeOverlay="changeModalStatus"
        :integrationId="integrationId"
      />
    </v-overlay>
    <delete-integration-modal
      :status="showDeleteModal"
      @handleCloseModal="showDeleteModal = false"
      @handleDelete="handleDelete($event)"
      @handleMultipleDelete="handleDeleteMultiple"
      :selected-integration="selectedIntegration"
    />
    <DatatableLoading :loading="loading">
      <template v-slot:skeleton-content>
        <data-table
          :is-column-filter-active="tableOptions.isColumnFilterActive"
          :table="tableData"
          id="integrationsList"
          ref="refIntegrationsList"
          :refName="'integrationsList'"
          :columns="tableOptions.columns"
          :countRow="5"
          :selectable="true"
          :filterable="true"
          :options="true"
          :sizeable="true"
          :pageSizes="tableOptions.pageSizes"
          :empty="tableOptions.empty"
          :select-event="tableOptions.selectEvent"
          :row-actions="tableOptions.rowActions"
          :addButton="tableOptions.addButton"
          @deleteAction="showDeleteModal = true"
          @handleEdit="handleEdit"
          @disable="handleDisable"
          @onEmptyBtnClicked="modalStatus = true"
          @addAction="changeModalStatus(true)"
          @downloadEvent="exportIntegrationList"
          @handleMultipleDelete="handleActionDelete"
          @sortChangedEvent="sortChangedEvent($event)"
          @paginationChangedEvent="paginationChangedEvent($event)"
          @searchChangedEvent="searchChangedEvent($event)"
          :dataLength="tableData && tableData.totalNumberOfRecords"
          :requestParams="bodyData"
          :isServerSide="false"
          @columnFilterChanged="columnFilterChanged"
          @columnFilterCleared="columnFilterCleared"
        >
          <template v-slot:datatable-row-actions="{ scope }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="handleEdit(scope.row)" class="btn-hover" icon v-on="on">
                  <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ tableOptions.rowActions[0].name }}</span>
            </v-tooltip>
            <v-menu bottom left offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-hover" icon v-on="on">
                  <v-icon @click.native="selectedMenuIndex = scope.$index"
                    >mdi-dots-vertical</v-icon
                  >
                </v-btn>
              </template>
              <v-list
                class="v-cart-dropdown-list el-table__action-buttons integrations__row-actions"
              >
                <v-list-item class="sub-menu-el">
                  <v-list-item-title
                    @click="
                      scope.row.status === 'Active'
                        ? handleDisable(scope.row)
                        : handleEnable(scope.row)
                    "
                  >
                    <v-icon class="pr-3">{{
                      scope.row.status === 'Active'
                        ? 'mdi-minus-circle-outline'
                        : 'mdi-check-circle-outline'
                    }}</v-icon>
                    <span>{{ scope.row.status === 'Active' ? 'Disable' : 'Enable' }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="sub-menu-el">
                  <v-list-item-title @click="handleActionDelete(scope.row)">
                    <v-icon class="pr-3">mdi-delete</v-icon>
                    <span>Delete</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </data-table>
      </template>
    </DatatableLoading>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import DeleteIntegrationModal from './DeleteIntegrationModal'
import {
  deleteIntegration,
  disableIntegration,
  enableIntegration,
  exportReportedEmails,
  getIntegrationList
} from '../../api/integrations'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE
} from '../../model/constants/commonConstants'
import DatatableLoading from '../SkeletonLoading/DatatableLoading'
export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration,
    DeleteIntegrationModal,
    DatatableLoading
  },
  data() {
    return {
      loading: true,
      integrationId: null,
      tableData: [],
      showDeleteModal: false,
      selectedIntegration: {},
      tableOptions: {
        isColumnFilterActive: false,
        columns: [
          {
            property: PROPERTY_STORE.NAME,
            align: 'left',
            editable: false,
            label: 'Integration Name',
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 250,
            filterableType: 'text',
            filterableCustomFieldName: 'Name'
          },
          {
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            width: 350,
            filterableType: 'text',
            filterableCustomFieldName: 'Description'
          },
          {
            property: PROPERTY_STORE.STATUS,
            align: 'center',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.STATUS),
            fixed: false,
            sortable: true,
            show: true,
            type: 'status',
            width: 160,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', 'InActive']
          },
          {
            property: PROPERTY_STORE.CREATEDATE,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATEDATE),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            width: 300,
            filterableType: 'date',
            filterableCustomFieldName: 'createDate'
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
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_INTEGRATIONS,
          btn: 'ADD AN INTEGRATION',
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration'
        }
      },
      modalStatus: false,
      bodyData: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'createDate',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }
    }
  },
  methods: {
    sortChangedEvent({ prop, order }) {
      this.bodyData = { ...this.bodyData, orderBy: prop, ascending: order === 'ascending' }
      this.getDatatableList()
    },
    handleDeleteMultiple(selections) {
      selections.forEach((item) => this.handleDelete(item))
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
            message: 'Integration has been deleted'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Integration can not be deleted'
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
            message: 'Integration has been disabled'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Integration can not be disabled'
          })
        })
    },
    handleEnable(row) {
      enableIntegration(row.resourceId)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            message: 'Integration has been enabled'
          })
          this.getDatatableList()
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Integration can not be enabled'
          })
        })
    },
    handleAdd() {},
    changeModalStatus(status, restart) {
      this.integrationId = null
      this.modalStatus = status
      if (restart) this.getDatatableList()
    },
    exportIntegrationList({ exportTypes, reportAllPages, pageNumber, pageSize }) {
      exportTypes.map((exportType) => {
        const payload = {
          pageNumber: pageNumber,
          pageSize: pageSize,
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
      this.loading = true
      getIntegrationList(this.bodyData)
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.tableData = data.results || []
          /*
          this.bodyData.pageNumber = data.pageNumber
          this.bodyData.pageSize = data.pageSize
          console.log('this.bodyData', this.bodyData)
          this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
           */
        })
        .catch((error) => {
          this.tableData = []
        })
        .finally(() => (this.loading = false))
    },
    handleActionDelete(row) {
      this.selectedIntegration = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x, i, t) => {
        if (x.FieldName !== filter.FieldName) {
          items.push(x)
        }
      })

      requestBody = [...items]
      if (Array.isArray(filter)) {
        filter.forEach((x, i, t) => {
          const elem = filter[i]
          elem.FieldName = filter[i].FieldName
          requestBody.push(elem)
        })
      } else {
        const elem = filter
        elem.FieldName = filter.FieldName
        requestBody.push(elem)
      }

      this.bodyData.filter.FilterGroups[0].FilterItems = requestBody
      this.getDatatableList()
    },
    columnFilterCleared(fieldName) {
      let items = []
      let filterPayload = this.bodyData.filter.FilterGroups[0].FilterItems

      filterPayload.map((x, i, t) => {
        if (x.FieldName !== fieldName) {
          items.push(x)
        }
      })

      filterPayload = [...items]
      this.bodyData.filter.FilterGroups[0].FilterItems = filterPayload
      this.getDatatableList()

      this.tableOptions.isColumnFilterActive =
        this.bodyData.filter.FilterGroups[0].FilterItems.length >= 1
    }
  },
  mounted() {
    this.getDatatableList()
  }
}
</script>

<style lang="scss">
.integrations {
  min-height: 90vh;
}
.integrations__row-actions {
  .v-list-item__title {
    display: flex;
    align-items: center;
  }
}
</style>
