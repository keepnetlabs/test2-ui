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
    >
      <template v-slot:rowActions="{}">
        <el-table-column
          fixed="right"
          :min-width="150"
          align="right"
          class-name="actions-container"
          label="Actions"
          label-class-name="actions-label"
        >
          <template slot-scope="scope">
            <template v-if="rowActions[0].action === 'edit'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="handleEdit(scope.row)" class="btn-hover" icon v-on="on">
                    <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ tableOptions.rowActions[0].name }}</span>
              </v-tooltip>
            </template>
            <template v-else>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn class="btn-hover" icon v-on="on">
                    <v-icon>{{ tableOptions.rowActions[0].icon }}</v-icon>
                  </v-btn>
                </template>
                <span> {{ tableOptions.rowActions[0].name }} </span>
              </v-tooltip>
            </template>
            <v-menu bottom left offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-hover" icon v-on="on">
                  <v-icon @click.native="selectedMenuIndex = scope.$index"
                    >mdi-dots-vertical</v-icon
                  >
                </v-btn>
              </template>
              <v-list class="v-cart-dropdown-list el-table__action-buttons">
                <v-list-item
                  :key="ind"
                  class="sub-menu-el"
                  v-for="(act, ind) of rowActions"
                  v-if="!act.subElements && !act.isNotShow"
                >
                  <v-list-item-title>
                    <v-icon class="pr-3">{{ act.icon }}</v-icon>
                    <span>{{ act.name }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :key="ind + 'sub-item'"
                  v-for="(act, ind) of rowActions"
                  v-if="act.subElements && act.subElements.length"
                >
                  <v-menu :content-class="'sub-menu-sub'" open-on-hover>
                    <template v-slot:activator="{ on }">
                      <v-list-item-title class="sub-element-wrapper" v-on="on">
                        <v-icon class="pr-3">{{ act.icon }}</v-icon>
                        <span>{{ act.name }}</span>
                        <v-icon style="float: right;">mdi-chevron-right</v-icon>
                      </v-list-item-title>
                    </template>
                    <v-list>
                      <v-list-item :key="item" v-for="item of act.subElements">
                        {{ item }}
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </el-table-column>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataTable from '../DataTable'
import NewIntegration from './NewIntegration'
import {
  deleteIntegration,
  disableIntegration,
  exportReportedEmails,
  getIntegrationList
} from '../../api/integrations'
import {
  COMMON_CONSTANTS,
  getStoreValue,
  PROPERTY_STORE
} from '../../model/constants/commonConstants'

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
            property: PROPERTY_STORE.NAME,
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
            property: PROPERTY_STORE.DESCRIPTION,
            align: 'left',
            editable: false,
            label: getStoreValue(PROPERTY_STORE.DESCRIPTION),
            sortable: true,
            show: true,
            type: 'text',
            width: 350
            //minWidth: 80
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
            hasTooltip: true
            //minWidth: 80
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
          btn: 'ADD AN INTEGRATION',
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
      getIntegrationList(this.bodyData)
        .then((response) => {
          const {
            data: { data, status }
          } = response
          this.tableData = data.results || []
          this.bodyData.pageNumber = data.pageNumber
          this.bodyData.pageSize = data.pageSize
          this.tableData.totalNumberOfRecords = data.totalNumberOfRecords
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
