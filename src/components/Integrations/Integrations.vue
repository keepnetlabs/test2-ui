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

    <data-table
      :loading="loading"
      :is-column-filter-active="tableOptions.isColumnFilterActive"
      :table="tableData"
      id="integrations-data-table"
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
      :download-button="tableOptions.downloadButton"
      v-if="checkPermissions('analysis-engines/search', 'POST')"
      @refreshAction="getDatatableList"
    >
      <template v-slot:datatable-row-actions="{ scope }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="handleEdit(scope.row)"
              class="btn-hover"
              icon
              v-on="on"
              :disabled="tableOptions.rowActions[0].disabled"
            >
              <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ tableOptions.rowActions[0].name }}</span>
        </v-tooltip>
        <v-menu bottom left offset-y transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn class="btn-hover" icon v-on="on">
              <v-icon @click.native="selectedMenuIndex = scope.$index">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="v-cart-dropdown-list el-table__action-buttons integrations__row-actions">
            <v-list-item class="sub-menu-el" :disabled="tableOptions.rowActions[1].disabled">
              <v-list-item-title
                @click="
                  scope.row.status === 'Active' ? handleDisable(scope.row) : handleEnable(scope.row)
                "
              >
                <v-icon class="pr-3">{{
                  scope.row.status === 'Active'
                    ? 'mdi-minus-circle-outline'
                    : 'mdi-check-circle-outline'
                }}</v-icon>
                <span>{{
                  scope.row.status === labels.Active ? labels.InActive : labels.Active
                }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="sub-menu-el" :disabled="tableOptions.rowActions[2].disabled">
              <v-list-item-title @click="handleActionDelete(scope.row)">
                <v-icon class="pr-3">mdi-delete</v-icon>
                <span>{{ labels.Delete }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </data-table>
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
} from '@/api/integrations'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE,
  LABEL_STORE
} from '@/model/constants/commonConstants'
import { checkPermission } from '@/utils/functions'

import labels from '@/model/constants/labels'

export default {
  name: 'Integrations',
  components: {
    DataTable,
    NewIntegration,
    DeleteIntegrationModal
  },
  data() {
    return {
      loading: true,
      integrationId: null,
      labels,
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
            label: labels.IntegrationName,
            sortable: true,
            show: true,
            type: 'text',
            fixed: 'left',
            width: 240,
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
            width: 150,
            hasTooltip: true,
            filterableType: 'select',
            filterableCustomFieldName: 'Status',
            filterableItems: ['Active', { text: 'Inactive', value: 'InActive' }]
          },
          {
            property: PROPERTY_STORE.CREATETIME,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.CREATETIME),
            fixed: false,
            sortable: true,
            show: true,
            type: 'text',
            filterableType: 'date',
            filterableCustomFieldName: 'createTime'
          }
        ],
        rowActions: [
          {
            name: labels.Edit,
            icon: 'mdi-pencil',
            action: 'handleEdit',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}', 'PUT')
          },
          {
            name: labels.Disable,
            icon: 'mdi-minus-circle-outline',
            action: 'disable',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}/disable', 'PUT')
          },
          {
            name: labels.Delete,
            icon: 'mdi-delete',
            action: 'deleteAction',
            disabled: !this.checkPermissions('analysis-engines/{resourceId}', 'DELETE')
          }
        ],
        downloadButton: {
          show: true,
          disabled: !this.checkPermissions('analysis-engines/search/export', 'POST')
        },
        selectEvent: {
          clipboard: true,
          edit: false,
          delete: true,
          download: false
        },
        pageSizes: [5, 10, 25],
        empty: {
          message: LABEL_STORE.NO_INTEGRATIONS,
          btn: labels.AddAnIntegration,
          icon: 'mdi-account-plus'
        },
        addButton: {
          show: true,
          action: 'addAction',
          tooltip: 'Add an integration',
          disabled: !this.checkPermissions('analysis-engines', 'POST')
        }
      },
      modalStatus: false,
      bodyData: {
        pageNumber: 1,
        pageSize: 5000,
        orderBy: 'createTime',
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
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
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
      deleteIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEdit(row) {
      this.modalStatus = true
      this.integrationId = row.resourceId
    },
    handleDisable(row) {
      disableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
      })
    },
    handleEnable(row) {
      enableIntegration(row.resourceId).then(() => {
        this.getDatatableList()
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
          orderBy: 'CreateTime',
          ascending: false,
          reportAllPages,
          exportType: exportType === 'XLS' ? 'Excel' : exportType,
          filter: this.bodyData.filter
        }
        exportReportedEmails(payload)
          .then((response) => {
            const { data } = response
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `integrations.${exportType.toLocaleLowerCase()}`
            link.click()
          })
          .catch((error) => {})
      })
    },
    getDatatableList() {
      this.loading = true
      if (this.checkPermissions('analysis-engines/search', 'POST')) {
        getIntegrationList(this.bodyData)
          .then((response) => {
            const {
              data: { data, status }
            } = response
            this.tableData = data.results || []
            /*
                  this.bodyData.pageNumber = data.pageNumber
                  this.bodyData.pageSize = data.pageSize
                  this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
                   */
          })
          .catch(() => {
            this.tableData = []
          })
          .finally(() => (this.loading = false))
      } else {
        this.$router.push('/')
      }
    },
    handleActionDelete(row) {
      this.selectedIntegration = row
      this.showDeleteModal = true
    },
    columnFilterChanged(filter) {
      this.tableOptions.isColumnFilterActive = true
      let items = []
      let requestBody = this.bodyData.filter.FilterGroups[0].FilterItems
      requestBody.map((x) => {
        if (Array.isArray(filter)) {
          filter.forEach((i) => {
            if (x.FieldName !== i.FieldName) {
              items.push(x)
            }
          })
        } else {
          if (x.FieldName !== filter.FieldName) {
            items.push(x)
          }
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
        const { FieldName, Value } = filter
        if (FieldName === 'Status' && Value === '') {
        } else {
          requestBody.push(elem)
        }
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
